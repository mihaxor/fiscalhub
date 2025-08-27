# <img src="./public/logo.svg" alt="FiscalHub Logo" width="45" height="45" style="display: inline-block; vertical-align: middle;"> Fiscal Hub

**Fiscal Hub** is a web application for fiscal calculations in Romania, built with Next.js, React, and TypeScript. The application provides precise calculations for salaries, social contributions, taxes, micro-enterprises, LLCs, dividends, and real-time currency conversions.

## 🚀 Live Demo

The application is available live on Vercel: [Fiscal Hub](https://fiscalhub.vercel.app/)

## ✨ Main Features

### 🏢 Complete Fiscal Calculator
- **Salary calculation CIM (Individual Employment Contract)**
    - Calculation from NET → GROSS or GROSS → NET
    - Social contributions (CAS 25%, CASS 10%, CAM 2.25%)
    - Income tax (IV 10%)
    - Personal deductions
    - Detailed display of employee/employer costs

- **Calculation for SRL (Limited Liability Company)** (in development)
- **Calculation for MICRO 3 (Micro-enterprises)** (in development)
- **Support for PFA and MICRO 1** (in development)

### 💱 Real-Time Currency Converter
- **Automatically updated BNR exchange rates**
- Support for 39+ international currencies
- Quick converter EUR/USD/GBP → RON
- Universal converter between any two currencies
- Intuitive interface with quick currency switching

### ⚡ Technical Features
- **Flexible periods**: hour, day, month, year
- **Multi-currency**: RON, EUR, USD, GBP + 35 other currencies
- **Responsive design** optimized for mobile
- **Smooth animations** with Framer Motion and GSAP
- **Dark/light theme** with next-themes

## 🛠️ Technology Stack

### Frontend
- **Next.js** with App Router and Turbopack
- **React** with modern hooks
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **HeroUI** for UI components

### Libraries & Tools
- **Framer Motion** for animations
- **GSAP** for complex animations
- **Zustand** for state management
- **Lucide React** for icons
- **xml2js** for BNR XML parsing

### Development
- **ESLint** for linting
- **Yarn** as package manager
- **Git** for version control

## 🚀 Installation and Usage

### System Requirements
- Node.js 18+
- Yarn 1.22+

### Installation
```bash
# Clone the repository
git clone https://github.com/username/fiscalhub.git

# Navigate to directory
cd fiscalhub

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Available Scripts
```bash
yarn dev          # Development with Turbopack
yarn build        # Build for production
yarn start        # Start built application
yarn lint         # Run ESLint
yarn local        # Open browser + dev server
```

### Environment Variables
```env
NEXT_APP_BNR_RATES_API_URL=your_BNR_API_here
```

## 💡 How to Use

### Fiscal Calculator
1. **Enter the value** (net or gross salary)
2. **Select the period** (hour/day/month/year)
3. **Choose calculation type** (CIM, SRL, MICRO3, etc.)
4. **Specify calculation** (from NET or from GROSS)
5. **Press "Calculate"** for detailed results

### Currency Converter
1. **Enter amount** in EUR/USD/GBP fields
2. **See automatically** the equivalent in LEI
3. **Use universal converter** for other currencies
4. **Quickly switch** currencies with swap button

## 📊 Supported Fiscal Calculations

### Contributions and Taxes
- **CAS (Pensions)**: 25%
- **CASS (Health)**: 10%
- **IV (Income Tax)**: 10%
- **CAM (Unemployment)**: 2.25%
- **Personal Deduction**: Configurable

### Contract Types
- ✅ **CIM** - Individual Employment Contract
- ✅ **SRL** - Limited Liability Company
- ✅ **MICRO 3** - Micro-enterprise (3% tax)
- 🚧 **MICRO 1** - Micro-enterprise (1% tax)
- 🚧 **PFA** - Authorized Natural Person

## 🔄 API and Integrations

### BNR Exchange Rates API
- **Endpoint**: `/api/rates`
- **Source**: National Bank of Romania
- **Update**: Automatic, daily
- **Format**: JSON with all exchange rates

## 🚀 Deployment - Vercel

### Manual Build
```bash
yarn build
yarn start
```
