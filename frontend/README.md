# IMMY Application

A React Native application for the Ethiopian and Eritrean community with approximately 2,000 users. This project follows a balanced structure that maintains a good balance between organization and simplicity, making it easy to maintain while still allowing for growth.

## Project Structure

The project is organized into two main directories:

```
immy-project/
├── frontend/                # React Native application
├── backend/                 # Server-side code
├── .gitignore               # Git ignore file
├── README.md                # Project documentation
└── package.json             # Root package.json for project-wide scripts
```

### Frontend Structure (React Native)

```
frontend/
├── android/                 # Android native code
├── ios/                     # iOS native code
├── src/
│   ├── assets/              # Static assets
│   │   ├── fonts/
│   │   └── images/
│   │
│   ├── components/          # Reusable UI components
│   │   ├── shared/          # Generic shared components
│   │   │   ├── ImageUpload.js
│   │   │   ├── LoadingComponent.js
│   │   │   └── ... other shared components
│   │   ├── listings/        # Components specific to listings
│   │   ├── auth/            # Components specific to auth
│   │   └── ... other feature-specific components
│   │
│   ├── screens/             # Screen components
│   │   ├── auth/            # Auth screens
│   │   │   ├── LoginScreen.js
│   │   │   ├── SignupScreen.js
│   │   │   └── ... other auth screens
│   │   ├── listings/        # Listing screens
│   │   │   ├── CreateListingScreen.js
│   │   │   ├── ListingDetailScreen.js
│   │   │   └── ... other listing screens
│   │   ├── profile/         # Profile screens
│   │   └── ... other screen categories
│   │
│   ├── navigation/          # Navigation configuration
│   │   ├── AppNavigator.js  # Main app navigation
│   │   ├── AuthNavigator.js # Auth flow navigation
│   │   └── BottomTabNavigator.js
│   │
│   ├── store/               # State management (Redux)
│   │   ├── auth/            # Auth-related state
│   │   │   ├── authSlice.js
│   │   │   └── authActions.js
│   │   ├── listings/        # Listings-related state
│   │   │   ├── listingSlice.js
│   │   │   └── listingActions.js
│   │   ├── language/        # Language-related state
│   │   │   └── languageSlice.js
│   │   └── index.js         # Store configuration
│   │
│   ├── services/            # API services
│   │   ├── api.js           # API client setup
│   │   ├── authService.js   # Authentication service
│   │   └── listingService.js # Listing service
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useForm.js
│   │   └── useAuth.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── helpers.js
│   │
│   ├── constants/           # Application constants
│   │   ├── colors.js
│   │   ├── routes.js
│   │   └── config.js
│   │
│   └── translations/        # i18n translations
│       ├── i18n.js
│       ├── en.js
│       └── ... other language files
│
├── App.js                   # Main App component
├── index.js                 # Entry point
├── app.json                 # App configuration
├── babel.config.js          # Babel configuration
├── metro.config.js          # Metro bundler config
├── package.json             # Frontend dependencies
└── ... other config files
```

### Backend Structure (Node.js/Express)

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # Database configuration
│   │   ├── auth.js          # Authentication configuration
│   │   └── app.js           # Application configuration
│   │
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   ├── listingController.js
│   │   ├── userController.js
│   │   └── ... other controllers
│   │
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # Authentication middleware
│   │   ├── errorHandler.js  # Error handling middleware
│   │   └── ... other middleware
│   │
│   ├── models/              # Database models
│   │   ├── User.js
│   │   ├── Listing.js
│   │   └── ... other models
│   │
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── listingRoutes.js
│   │   ├── userRoutes.js
│   │   └── index.js         # Route consolidation
│   │
│   ├── services/            # Business logic
│   │   ├── authService.js
│   │   ├── listingService.js
│   │   └── ... other services
│   │
│   ├── utils/               # Utility functions
│   │   ├── logger.js
│   │   ├── validators.js
│   │   └── ... other utilities
│   │
│   └── server.js            # Entry point
│
├── .env.example             # Example environment variables
├── .env                     # Environment variables (gitignored)
├── package.json             # Backend dependencies
└── ... other config files
```

## Cleanup Scripts

This project includes scripts to help identify and clean up duplicate files and folders:

### 1. Identify Duplicates

Run the following command to identify duplicate files and folders:

```bash
node cleanup-duplicates.js
```

This will generate a report of duplicate files and folders that exist both in the root directory and in the frontend/src or backend/src directories.

### 2. Remove Duplicates

Run the following command to remove duplicate files and folders:

```bash
node cleanup-duplicates-action.js
```

This script will prompt for confirmation before removing any files or folders. Make sure you have a backup before running this script.

## Getting Started

1. Install dependencies:

```bash
npm run install-all
```

2. Start the development servers:

```bash
npm run dev
```

This will start both the frontend and backend servers.

## Key Benefits of This Structure

- **Clear Separation**: Frontend and backend code are cleanly separated
- **Feature Organization**: Components, screens, and state are organized by feature
- **Maintainability**: Easy to locate files and understand the application structure
- **Scalability**: Structure can grow as the application expands
- **Reasonable Complexity**: Not over-engineered for the project size
