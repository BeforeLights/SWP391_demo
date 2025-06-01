# HIV Care Connect - Quick Study Guide

## 🎯 **What This Application Does**
A Vietnamese healthcare management system for HIV treatment and care, featuring:
- Patient health monitoring and medication tracking
- Appointment booking and management
- Medical reports and test results
- Doctor administration and ARV protocol management

## 🏗️ **Project Architecture**

### **Frontend Stack**
- **React 18** with **TypeScript** - Component-based UI
- **Vite** - Development server and build tool
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Lucide React** - Icons

### **Key Folders**
```
src/
├── components/     # Reusable UI components
├── contexts/       # React Context for state management
├── pages/          # Route components (screens)
├── services/       # API calls and business logic
└── types/          # TypeScript type definitions
```

## 🔑 **Core Concepts to Understand**

### **1. React Context Pattern**
- `AuthContext` - Manages user authentication state
- `NotificationContext` - Handles app-wide notifications

### **2. Protected Routes**
- Some routes require authentication
- Role-based access (patient, doctor, admin)

### **3. TypeScript Interfaces**
Key types defined in `src/types/index.ts`:
- `User` - User account information
- `Patient` - Medical patient data  
- `Appointment` - Booking information
- `Medication` - Drug and dosage data

## 🚀 **Quick Start Development**

### **Run the Application**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npx tsc --noEmit   # Check TypeScript errors
```

### **Demo Login Credentials**
- Email: `patient@example.com`
- Password: `password123`

### **File Navigation Tips**
- **Pages** = Main screens/routes
- **Components** = Reusable UI pieces
- **Contexts** = Global state management
- **Services** = API calls and data fetching

## 📚 **Study Resources (30 minutes each)**

### **React Fundamentals**
- React Hooks: useState, useEffect, useContext
- Component composition and props
- Event handling and forms

### **TypeScript Basics**
- Interface definitions
- Type annotations
- Generic types

### **Tailwind CSS**
- Utility-first CSS approach
- Responsive design classes
- Component styling patterns

## 🔧 **Common Development Tasks**

### **Adding a New Page**
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/layout/Navbar.tsx`

### **Adding New Features**
1. Define TypeScript types in `src/types/index.ts`
2. Create service functions in `src/services/`
3. Build UI components
4. Connect with Context for state management

### **Styling Components**
- Use Tailwind utility classes
- Follow existing patterns in `src/index.css`
- Use predefined component classes like `.btn-primary`, `.card`

## 🎨 **Design System**
- **Primary Color**: Medical blue (`medical-600`)
- **Layout**: Card-based design with shadows
- **Typography**: Inter font family
- **Icons**: Lucide React icon set
- **Language**: Vietnamese UI text

## 🏥 **Medical Domain Knowledge**
- **ARV**: Antiretroviral drugs for HIV treatment
- **CD4**: T-cell count (immune system marker)
- **Viral Load**: HIV virus level in blood
- **Adherence**: Medication compliance tracking

## 🔍 **Debugging Tips**
- Check browser console for errors
- Use React Developer Tools browser extension
- TypeScript errors show in VS Code and terminal
- Use `console.log()` for debugging state changes
