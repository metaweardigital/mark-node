# Dynamic Revenue Flow Calculator

A powerful, visual tool for modeling business revenue streams with real-time calculations, predictive analytics, and interactive flow visualization.

## 🚀 Features

### Core Functionality
- **Interactive Flow Visualization**: Node-based revenue flow with drag-and-drop interface
- **Real-time Calculations**: Instant updates as you adjust values
- **Bottleneck Detection**: Automatically identifies and highlights conversion bottlenecks
- **Scenario Planning**: Compare Conservative, Current, Optimistic, and Aggressive scenarios

### Advanced Analytics
- **Markov Chain Predictions**: Customer lifetime value and retention modeling
- **Cohort Analysis**: Track retention and revenue across customer cohorts
- **Predictive Modeling**: Forecast future revenue based on current metrics
- **Optimization Insights**: Actionable recommendations for improvement

## 📊 Key Components

### 1. Flow Visualization
- **Source Nodes**: Site visitors entry point
- **Processor Nodes**: Registration, conversion, pricing, retention
- **Outcome Nodes**: Revenue and profit calculations
- **Animated Edges**: Visual flow with particle effects showing volume

### 2. Analysis Panels
- **Predictive Analytics**: CLV, retention rates, churn analysis
- **Bottleneck Panel**: Identifies weakest conversion points
- **Scenario Testing**: Quick presets and manual adjustments
- **Cohort Analysis**: Retention heatmaps and revenue tracking

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: React 18 + TypeScript
- **Visualization**: React Flow
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **Calculations**: Custom Markov Chain implementation

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Development

```bash
# Start development server
npm run dev

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Format code
npm run format
```

## 📈 Usage

### Basic Flow
1. **Adjust Input Values**: Click on any blue-highlighted value to edit
2. **View Real-time Updates**: See revenue and profit update instantly
3. **Identify Bottlenecks**: Red alerts show your weakest conversion points
4. **Test Scenarios**: Use preset scenarios or create custom configurations

### Advanced Features
- **Markov Analysis**: View customer lifetime value predictions
- **Cohort Tracking**: Analyze retention patterns over time
- **Export Data**: Download analysis results (coming soon)
- **API Integration**: Connect to live data sources (coming soon)

## 🎯 Key Metrics Tracked

- **Site Visitors**: Total monthly traffic
- **Registration Rate**: Visitor to registration conversion
- **Join Rate**: Registration to paid conversion  
- **Price Point**: Subscription or product price
- **Retention Rate**: Monthly rebill/retention percentage
- **Revenue**: Total monthly revenue
- **Profit**: Revenue after costs

## 🔮 Predictive Analytics

### Markov Chain Model
- Calculates steady-state probabilities
- Predicts customer lifetime value
- Models retention curves
- Provides churn predictions

### Cohort Analysis
- Month-over-month retention tracking
- Revenue per cohort visualization
- Comparative cohort performance
- Retention heatmaps

## 🎨 UI Design

The interface follows a modern, minimalistic design philosophy:
- Clean, card-based layouts
- Subtle shadows and borders
- Consistent color scheme
- Smooth animations and transitions
- Responsive panel system

## 📁 Project Structure

```
/
├── app/                  # Next.js app directory
├── components/          
│   ├── flow/            # Flow visualization components
│   │   ├── nodes/       # Custom node types
│   │   └── edges/       # Custom edge types
│   └── ui/              # UI components and panels
├── lib/
│   ├── calculations/    # Markov chain and analytics
│   ├── store/          # Zustand state management
│   └── utils/          # Helper functions
└── types/              # TypeScript definitions
```

## 🚀 Roadmap

### Completed ✅
- [x] Phase 1: Foundation Setup
- [x] Phase 2: Interactivity & Calculations
- [x] Phase 3: Visualization & Animation
- [x] Phase 4: Markov Chain Integration

### Upcoming 🔜
- [ ] Phase 5: Data Integration
  - API connectivity
  - Real-time data updates
  - Data export/import
- [ ] Phase 6: Polish & Optimization
  - Mobile responsive design
  - Performance optimization
  - Comprehensive testing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with Next.js and React Flow
- Inspired by modern analytics dashboards
- Markov chain implementation for predictive modeling

---

**Live Demo**: [Coming Soon]
**Documentation**: [View Full Docs](./IMPLEMENTATION_PLAN.md)