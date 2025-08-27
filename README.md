# <img src="./public/logo.svg" alt="FiscalHub Logo" width="45" height="45" style="display: inline-block; vertical-align: middle;"> Fiscal Hub

**Fiscal Hub** este o aplicație web pentru calculele fiscale din România, construită cu Next.js, React și TypeScript. Aplicația oferă calcule precise pentru salarii, contribuții sociale, impozite, microîntreprinderi, SRL-uri, dividende și conversii valutare în timp real.

## 🚀 Live Demo

The application is available live on Vercel: [Fiscal Hub](https://fiscalhub.vercel.app/)

## ✨ Funcționalități Principale

### 🏢 Calculator Fiscal Complet
- **Calcul salarial CIM (Contract Individual de Muncă)**
  - Calcul din NET → GROSS sau GROSS → NET
  - Contribuții sociale (CAS 25%, CASS 10%, CAM 2.25%)
  - Impozit pe venit (IV 10%)
  - Deduceri personale
  - Afișare detaliată costuri angajat/angajator

- **Calcul pentru SRL (Societate cu Răspundere Limitată)** (în dezvoltare)
- **Calcul pentru MICRO 3 (Microîntreprinderi)** (în dezvoltare)
- **Suport pentru PFA și MICRO 1** (în dezvoltare)

### 💱 Convertor Valutar în Timp Real
- **Cursuri BNR actualizate automat**
- Suport pentru 39+ valute internaționale
- Convertorul rapid EUR/USD/GBP → RON
- Convertor universal între orice două valute
- Interfață intuitivă cu schimbare rapidă a valutelor

### ⚡ Caracteristici Tehnice
- **Perioade flexibile**: oră, zi, lună, an
- **Multi-currency**: RON, EUR, USD, GBP + 35 alte valute
- **Responsive design** optimizat pentru mobile
- **Animații fluide** cu Framer Motion și GSAP
- **Tema întunecată/luminoasă** cu next-themes

## 🛠️ Stack Tehnologic

### Frontend
- **Next.js** cu App Router și Turbopack
- **React** cu hooks moderne
- **TypeScript** pentru type safety
- **Tailwind CSS** pentru styling
- **HeroUI** pentru componente UI

### Biblioteci & Tools
- **Framer Motion** pentru animații
- **GSAP** pentru animații complexe
- **Zustand** pentru state management
- **Lucide React** pentru iconuri
- **xml2js** pentru parsing XML BNR

### Dezvoltare
- **ESLint** pentru linting
- **Yarn** ca package manager
- **Git** pentru version control

## 🚀 Instalare și Utilizare

### Cerințe de Sistem
- Node.js 18+ 
- Yarn 1.22+

### Instalare
```bash
# Clonează repository-ul
git clone https://github.com/username/fiscalhub.git

# Navighează în director
cd fiscalhub

# Instalează dependențele
yarn install

# Pornește serverul de dezvoltare
yarn dev
```

### Scripturi Disponibile
```bash
yarn dev          # Dezvoltare cu Turbopack
yarn build        # Build pentru producție
yarn start        # Pornește aplicația built
yarn lint         # Rulează ESLint
yarn local        # Deschide browser + dev server
```

### Variabile de Mediu
```env
NEXT_APP_BNR_RATES_API_URL=your_BNR_API_here
NEXT_PUBLIC_APP_THEME=system
```

## 💡 Cum să Folosești

### Calculator Fiscal
1. **Introduce valoarea** (salariu net sau brut)
2. **Selectează perioada** (oră/zi/lună/an)
3. **Alege tipul de calcul** (CIM, SRL, MICRO3, etc.)
4. **Specifică calculul** (din NET sau din GROSS)
5. **Apasă "Calculează"** pentru rezultate detaliate

### Convertor Valutar
1. **Introduce suma** în câmpurile EUR/USD/GBP
2. **Vezi automat** echivalentul în LEI
3. **Folosește convertorul universal** pentru alte valute
4. **Schimbă rapid** valutele cu butonul de swap

## 📊 Calcule Fiscale Suportate

### Contribuții și Impozite
- **CAS (Pensii)**: 25%
- **CASS (Sănătate)**: 10% 
- **IV (Impozit Venit)**: 10%
- **CAM (Șomaj)**: 2.25%
- **Deducere Personală**: Configurabilă

### Tipuri de Contracte
- ✅ **CIM** - Contract Individual de Muncă
- ✅ **SRL** - Societate cu Răspundere Limitată  
- ✅ **MICRO 3** - Microîntreprindere (3% impozit)
- 🚧 **MICRO 1** - Microîntreprindere (1% impozit)
- 🚧 **PFA** - Persoană Fizică Autorizată

## 🔄 API și Integrări

### BNR Exchange Rates API
- **Endpoint**: `/api/rates`
- **Sursă**: Banca Națională a României
- **Actualizare**: Automată, zilnic
- **Format**: JSON cu toate cursurile valutare

## 🚀 Deployment - Vercel

### Build Manual
```bash
yarn build
yarn start
```