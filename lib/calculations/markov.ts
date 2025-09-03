export interface MarkovState {
  id: string
  label: string
  value: number
  isAbsorbing?: boolean
}

export interface TransitionProbability {
  from: string
  to: string
  probability: number
}

export interface MarkovChainResult {
  steadyState: number[]
  expectedSteps: number[]
  absorbingProbabilities: number[][]
  customerLifetimeValue: number
  retentionRate: number
  churnRate: number
  averageLifetime: number
}

export class MarkovChainCalculator {
  private states: MarkovState[]
  private transitionMatrix: number[][]
  private stateIndex: Map<string, number>

  constructor(states: MarkovState[], transitions: TransitionProbability[]) {
    this.states = states
    this.stateIndex = new Map(states.map((s, i) => [s.id, i]))
    this.transitionMatrix = this.buildTransitionMatrix(transitions)
  }

  private buildTransitionMatrix(transitions: TransitionProbability[]): number[][] {
    const n = this.states.length
    const matrix = Array(n).fill(0).map(() => Array(n).fill(0))

    transitions.forEach(t => {
      const fromIdx = this.stateIndex.get(t.from)
      const toIdx = this.stateIndex.get(t.to)
      if (fromIdx !== undefined && toIdx !== undefined) {
        matrix[fromIdx][toIdx] = t.probability
      }
    })

    // Ensure each row sums to 1 (stochastic matrix)
    for (let i = 0; i < n; i++) {
      const rowSum = matrix[i].reduce((a, b) => a + b, 0)
      if (rowSum > 0 && rowSum !== 1) {
        matrix[i] = matrix[i].map(p => p / rowSum)
      }
    }

    return matrix
  }

  calculateSteadyState(): number[] {
    const n = this.states.length
    const maxIterations = 1000
    const tolerance = 1e-6

    // Start with uniform distribution
    let state = Array(n).fill(1 / n)
    
    for (let iter = 0; iter < maxIterations; iter++) {
      const newState = Array(n).fill(0)
      
      // Multiply state vector by transition matrix
      for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
          newState[j] += state[i] * this.transitionMatrix[i][j]
        }
      }

      // Check convergence
      const diff = Math.max(...newState.map((v, i) => Math.abs(v - state[i])))
      if (diff < tolerance) break

      state = newState
    }

    return state
  }

  calculateAbsorptionProbabilities(): number[][] {
    const absorbingStates = this.states.filter(s => s.isAbsorbing)
    const transientStates = this.states.filter(s => !s.isAbsorbing)
    
    if (absorbingStates.length === 0) return []

    const t = transientStates.length
    const a = absorbingStates.length

    // Create Q (transient to transient) and R (transient to absorbing) matrices
    const Q: number[][] = []
    const R: number[][] = []

    for (let i = 0; i < t; i++) {
      Q[i] = []
      R[i] = []
      const fromIdx = this.stateIndex.get(transientStates[i].id)!
      
      for (let j = 0; j < t; j++) {
        const toIdx = this.stateIndex.get(transientStates[j].id)!
        Q[i][j] = this.transitionMatrix[fromIdx][toIdx]
      }
      
      for (let j = 0; j < a; j++) {
        const toIdx = this.stateIndex.get(absorbingStates[j].id)!
        R[i][j] = this.transitionMatrix[fromIdx][toIdx]
      }
    }

    // Calculate fundamental matrix N = (I - Q)^(-1)
    const I = Array(t).fill(0).map((_, i) => 
      Array(t).fill(0).map((_, j) => i === j ? 1 : 0)
    )
    
    const IminusQ = I.map((row, i) => 
      row.map((val, j) => val - Q[i][j])
    )
    
    const N = this.matrixInverse(IminusQ)
    
    // Calculate absorption probabilities B = N * R
    const B = this.matrixMultiply(N, R)
    
    return B
  }

  calculateCustomerLifetimeValue(
    monthlyRevenue: number,
    acquisitionCost: number = 0
  ): number {
    // Get retention rate from transition matrix
    const retentionRate = this.calculateRetentionRate()
    
    // CLV = (Average Revenue per User * Gross Margin) / Churn Rate - CAC
    const churnRate = 1 - retentionRate
    
    if (churnRate === 0) return Infinity
    
    const clv = (monthlyRevenue / churnRate) - acquisitionCost
    
    return Math.max(0, clv)
  }

  calculateRetentionRate(): number {
    // Find the probability of staying in active states
    const activeStates = this.states.filter(s => !s.isAbsorbing && s.label !== 'Churned')
    
    if (activeStates.length === 0) return 0
    
    let totalRetention = 0
    let count = 0
    
    activeStates.forEach(state => {
      const idx = this.stateIndex.get(state.id)!
      activeStates.forEach(nextState => {
        const nextIdx = this.stateIndex.get(nextState.id)!
        totalRetention += this.transitionMatrix[idx][nextIdx]
        count++
      })
    })
    
    return count > 0 ? totalRetention / count : 0
  }

  predictFutureStates(
    initialState: number[],
    periods: number
  ): number[][] {
    const predictions: number[][] = [initialState]
    
    for (let t = 1; t <= periods; t++) {
      const prevState = predictions[t - 1]
      const nextState = Array(this.states.length).fill(0)
      
      for (let j = 0; j < this.states.length; j++) {
        for (let i = 0; i < this.states.length; i++) {
          nextState[j] += prevState[i] * this.transitionMatrix[i][j]
        }
      }
      
      predictions.push(nextState)
    }
    
    return predictions
  }

  calculateCohortRetention(
    cohortSize: number,
    periods: number
  ): number[] {
    // Start with all users in the first active state
    const initialState = Array(this.states.length).fill(0)
    initialState[0] = cohortSize
    
    const predictions = this.predictFutureStates(initialState, periods)
    
    // Calculate retention for each period
    const retention = predictions.map(state => {
      const activeUsers = state.reduce((sum, val, idx) => {
        const isActive = !this.states[idx].isAbsorbing && 
                        this.states[idx].label !== 'Churned'
        return sum + (isActive ? val : 0)
      }, 0)
      return activeUsers / cohortSize
    })
    
    return retention
  }

  private matrixInverse(matrix: number[][]): number[][] {
    const n = matrix.length
    const identity = Array(n).fill(0).map((_, i) => 
      Array(n).fill(0).map((_, j) => i === j ? 1 : 0)
    )
    
    // Gaussian elimination with partial pivoting
    const augmented = matrix.map((row, i) => [...row, ...identity[i]])
    
    for (let i = 0; i < n; i++) {
      // Find pivot
      let maxRow = i
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k
        }
      }
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]]
      
      // Make diagonal 1
      const pivot = augmented[i][i]
      if (Math.abs(pivot) < 1e-10) {
        throw new Error('Matrix is singular')
      }
      
      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= pivot
      }
      
      // Eliminate column
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = augmented[k][i]
          for (let j = 0; j < 2 * n; j++) {
            augmented[k][j] -= factor * augmented[i][j]
          }
        }
      }
    }
    
    // Extract inverse from augmented matrix
    return augmented.map(row => row.slice(n))
  }

  private matrixMultiply(A: number[][], B: number[][]): number[][] {
    const m = A.length
    const n = B[0].length
    const p = A[0].length
    
    const C = Array(m).fill(0).map(() => Array(n).fill(0))
    
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < p; k++) {
          C[i][j] += A[i][k] * B[k][j]
        }
      }
    }
    
    return C
  }

  getComprehensiveAnalysis(monthlyRevenue: number): MarkovChainResult {
    const steadyState = this.calculateSteadyState()
    const retentionRate = this.calculateRetentionRate()
    const churnRate = 1 - retentionRate
    const averageLifetime = churnRate > 0 ? 1 / churnRate : Infinity
    const clv = this.calculateCustomerLifetimeValue(monthlyRevenue)
    
    // Calculate expected steps to absorption
    const expectedSteps = Array(this.states.length).fill(0)
    const absorbingProbs = this.calculateAbsorptionProbabilities()
    
    return {
      steadyState,
      expectedSteps,
      absorbingProbabilities: absorbingProbs,
      customerLifetimeValue: clv,
      retentionRate,
      churnRate,
      averageLifetime
    }
  }
}

// Helper function to create a subscription Markov chain
export function createSubscriptionMarkovChain(
  regRate: number,
  joinRate: number,
  rebillRate: number
): { states: MarkovState[], transitions: TransitionProbability[] } {
  const states: MarkovState[] = [
    { id: 'visitor', label: 'Visitor', value: 100 },
    { id: 'registered', label: 'Registered', value: 0 },
    { id: 'subscriber', label: 'Subscriber', value: 0 },
    { id: 'retained', label: 'Retained', value: 0 },
    { id: 'churned', label: 'Churned', value: 0, isAbsorbing: true }
  ]
  
  const transitions: TransitionProbability[] = [
    { from: 'visitor', to: 'registered', probability: regRate / 100 },
    { from: 'visitor', to: 'churned', probability: 1 - (regRate / 100) },
    { from: 'registered', to: 'subscriber', probability: joinRate / 100 },
    { from: 'registered', to: 'churned', probability: 1 - (joinRate / 100) },
    { from: 'subscriber', to: 'retained', probability: rebillRate / 100 },
    { from: 'subscriber', to: 'churned', probability: 1 - (rebillRate / 100) },
    { from: 'retained', to: 'retained', probability: rebillRate / 100 },
    { from: 'retained', to: 'churned', probability: 1 - (rebillRate / 100) },
    { from: 'churned', to: 'churned', probability: 1 }
  ]
  
  return { states, transitions }
}