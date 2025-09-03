# Dynamic Revenue Flow Calculator - Implementation Plan

## 🎯 Project Overview
A visual, node-based flow calculator for modeling business revenue streams with real-time adjustments, bottleneck visualization, and predictive capabilities using Markov chain models.

## 🏗️ Technical Architecture

### Core Stack
```
Frontend Framework:    Next.js 15 (App Router)
UI Library:           React 19 + TypeScript
Flow Visualization:   React Flow
State Management:     Zustand
Animations:          Framer Motion
Styling:             Tailwind CSS v4 + Radix UI
Data Processing:     Math.js (calculations)
Charts:              Recharts (supplementary)
API Layer:           Next.js API Routes (future)
Database:            PostgreSQL + Prisma (future)
```

### Architecture Pattern
```
┌─────────────────────────────────────────────┐
│           Presentation Layer                 │
│  (React Components + React Flow)             │
├─────────────────────────────────────────────┤
│           State Management                   │
│         (Zustand + React Query)              │
├─────────────────────────────────────────────┤
│          Business Logic Layer                │
│   (Calculation Engine + Markov Models)       │
├─────────────────────────────────────────────┤
│            Data Layer                        │
│    (Local State → API → Database)            │
└─────────────────────────────────────────────┘
```

## 📊 Data Models

### Node Types
```typescript
type NodeType = 'source' | 'processor' | 'metric' | 'outcome';

interface FlowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    value: number;
    unit: 'visitors' | 'users' | 'percentage' | 'currency';
    isAdjustable: boolean;
    min?: number;
    max?: number;
    step?: number;
    formula?: string;
    successRate?: number;
    trend?: number;
  };
}

interface FlowEdge {
  id: string;
  source: string;
  target: string;
  animated: boolean;
  data: {
    value: number;
    conversionRate: number;
    status: 'optimal' | 'warning' | 'critical';
  };
}
```

### Markov Chain Model
```typescript
interface MarkovState {
  id: string;
  label: string;
  isAbsorbing: boolean;
}

interface TransitionMatrix {
  states: MarkovState[];
  probabilities: number[][];
  timeStep: 'daily' | 'weekly' | 'monthly';
}
```

## 🚀 Implementation Phases

### Phase 1: Foundation (Week 1) ✅ **COMPLETED**
**Goal:** Basic working flow with interactive nodes

**Tasks:**
1. ✅ Project setup with Next.js 15 + TypeScript
2. ✅ Install core dependencies (React Flow, Zustand, Tailwind CSS v4)
3. ✅ Create basic layout structure with App Router
4. ✅ Implement React Flow canvas with TypeScript
5. ✅ Create node components (source, processor, outcome)
6. ✅ Add basic state management with Zustand
7. ✅ Implement value adjustment controls with inline editing
8. ✅ **Fix Tailwind CSS v4 configuration and border styling**

**Deliverables:**
- ✅ Working flow diagram with 7 interactive nodes
- ✅ Click-to-edit functionality on all adjustable values
- ✅ Basic revenue calculations (Visitors → Registration → Joins → Revenue/Profit)
- ✅ Real-time updates with automatic recalculation
- ✅ MiniMap and Controls implemented
- ✅ **Tailwind CSS v4 properly configured with @theme directive**
- ✅ **Fixed border styling issues with proper color definitions**

**Status:** Application running successfully at http://localhost:3001

**Technical Notes:**
- Migrated to Tailwind CSS v4 with `@tailwindcss/postcss` package
- Implemented CSS-based configuration using `@theme` directive
- Fixed border color defaults (v4 uses `currentColor` by default, now set to `gray-200`)

### Phase 2: Interactivity & Calculations (Week 2) ✅ **COMPLETED**
**Goal:** Dynamic calculations and real-time updates

**Tasks:**
1. ✅ Implement basic calculation engine (simple formulas working)
2. ✅ Create scenario comparison (ScenarioPanel with presets)
3. ✅ Add inline number input controls for values
4. ✅ Implement cascading updates (automatic recalculation)
5. ✅ Build bottleneck detection algorithm
6. ✅ Add quick adjustment controls (+/- buttons)
7. ✅ Progress tracking to $1M target

**Deliverables:**
- ✅ Real-time recalculation working
- ✅ Scenario management with presets
- ✅ Bottleneck detection and insights
- ✅ Quick value adjustments

### Phase 3: Visualization & Animation (Week 3) ✅ **COMPLETED**
**Goal:** Beautiful animations and bottleneck visualization

**Tasks:**
1. ✅ Implement flow animations (AnimatedEdge component)
2. ✅ Add edge thickness based on volume
3. ✅ Color coding for performance (optimal/warning/critical)
4. ✅ Bottleneck highlighting (BottleneckPanel)
5. ✅ Smooth transitions (CSS animations)
6. ✅ Add zoom/pan controls (React Flow built-in)
7. ✅ Implement minimap

**Deliverables:**
- ✅ Animated flow lines with particles
- ✅ Visual bottleneck indicators with alerts
- ✅ Performance dashboard with recommendations
- ✅ Optimization opportunity calculations

### Phase 4: Markov Chain Integration (Week 4) ✅ **COMPLETED**
**Goal:** Predictive modeling with state transitions

**Tasks:**
1. ✅ Implement Markov chain calculator (MarkovChainCalculator class)
2. ✅ Create transition matrix calculations
3. ✅ Add state probability visualization (MarkovAnalysisPanel)
4. ✅ Implement steady-state calculations
5. ✅ Add time-series projections (cohort retention over time)
6. ✅ Create cohort analysis view (CohortAnalysisPanel)
7. ✅ Build customer lifetime value (CLV) calculations
8. ✅ Add retention prediction models

**Deliverables:**
- ✅ Customer journey modeling with Markov chains
- ✅ Retention predictions with churn analysis
- ✅ LTV calculations per customer
- ✅ Cohort analysis dashboard with heatmap visualization
- ✅ Revenue projections and optimization insights

### Phase 5: Data Integration (Week 5)
**Goal:** Connect to real data sources

**Tasks:**
1. ⬜ Design API structure
2. ⬜ Implement data fetching layer
3. ⬜ Add caching strategy
4. ⬜ Create data transformers
5. ⬜ Implement WebSocket for real-time
6. ⬜ Add export functionality

**Deliverables:**
- API integration
- Real-time updates
- Data persistence

### Phase 6: Polish & Optimization (Week 6)
**Goal:** Production-ready application

**Tasks:**
1. ⬜ Performance optimization
2. ⬜ Mobile responsiveness
3. ⬜ Error handling
4. ⬜ Loading states
5. ⬜ Documentation
6. ⬜ Testing suite

**Deliverables:**
- Optimized performance
- Full documentation
- Test coverage

## 🎨 UI/UX Specifications

### Design System
```scss
// Color Palette
$primary: #3B82F6;      // Blue
$success: #10B981;      // Green
$warning: #F59E0B;      // Orange
$danger: #EF4444;       // Red
$neutral: #6B7280;      // Gray

// Node Colors
$source-node: #8B5CF6;  // Purple
$processor-node: #3B82F6; // Blue
$outcome-node: #10B981;  // Green

// Animation Timings
$transition-fast: 150ms;
$transition-base: 250ms;
$transition-slow: 500ms;
```

### Component Library
- **Nodes:** Custom React Flow nodes with Radix UI components
- **Controls:** Radix UI Slider, Input, Button
- **Layout:** CSS Grid + Flexbox
- **Charts:** Recharts for supplementary visualizations

## 📁 Project Structure
```
/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
│       └── flow/
├── components/
│   ├── flow/
│   │   ├── FlowCanvas.tsx
│   │   ├── nodes/
│   │   │   ├── SourceNode.tsx
│   │   │   ├── ProcessorNode.tsx
│   │   │   └── OutcomeNode.tsx
│   │   ├── edges/
│   │   │   └── AnimatedEdge.tsx
│   │   └── controls/
│   │       ├── StepperControl.tsx
│   │       └── PanelControls.tsx
│   ├── ui/
│   └── charts/
├── lib/
│   ├── calculations/
│   │   ├── engine.ts
│   │   ├── formulas.ts
│   │   └── markov.ts
│   ├── store/
│   │   └── flowStore.ts
│   └── utils/
├── styles/
│   └── globals.css
├── types/
│   └── flow.types.ts
└── public/
```

## 🧪 Testing Strategy

### Unit Tests
- Calculation engine
- Formula parser
- Markov chain calculations
- State management

### Integration Tests
- Node interactions
- Data flow
- API endpoints

### E2E Tests
- User workflows
- Scenario creation
- Export functionality

## 📈 Performance Targets
- Initial load: < 2s
- Recalculation: < 100ms
- Animation FPS: 60
- Max nodes: 100
- Max edges: 200

## 🔄 Development Workflow

### Branch Strategy
```
main
├── develop
│   ├── feature/phase-1-foundation
│   ├── feature/phase-2-calculations
│   ├── feature/phase-3-animations
│   ├── feature/phase-4-markov
│   └── feature/phase-5-api
```

### Commands
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run test         # Run tests
npm run lint         # Lint code
npm run format       # Format code
```

## 🚦 Success Metrics
- [x] Interactive flow with 7+ nodes ✅
- [x] Real-time calculation < 100ms ✅
- [x] Smooth animations at 60 FPS ✅
- [x] Markov chain predictions ✅
- [ ] API integration ready
- [ ] Mobile responsive
- [ ] 80% test coverage

## 🔜 Future Enhancements
- AI-powered optimization suggestions
- Multi-user collaboration
- Advanced scenario planning
- Historical data analysis
- Export to various formats (PDF, Excel, API)
- Custom formula builder
- Template marketplace

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

**Next Step:** Begin Phase 1 - Foundation Setup