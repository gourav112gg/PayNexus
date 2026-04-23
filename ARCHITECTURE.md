# SplitPay - Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser/Client                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Next.js 15 App Router (Frontend)             │   │
│  │  ┌─────────────┬─────────────┬─────────────┐        │   │
│  │  │   Pages     │ Components  │   Styling   │        │   │
│  │  └─────────────┴─────────────┴─────────────┘        │   │
│  │            ↓                                         │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │    Zustand Store (State Management)           │   │   │
│  │  │    - User auth & profile                      │   │   │
│  │  │    - Wallet balance                           │   │   │
│  │  │    - Groups & members                         │   │   │
│  │  │    - Payments & approvals                     │   │   │
│  │  │    - Transactions                             │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                        ↓
              (Ready for Backend API)
                        ↓
┌─────────────────────────────────────────────────────────────┐
│              Backend (To be implemented)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          Supabase / Database Layer                  │   │
│  │  ┌─────────┬──────────┬─────────┬──────────────┐    │   │
│  │  │ Users   │  Groups  │ Payments│ Transactions │    │   │
│  │  └─────────┴──────────┴─────────┴──────────────┘    │   │
│  │                                                       │   │
│  │  - Authentication (JWT tokens)                       │   │
│  │  - Data persistence (PostgreSQL)                     │   │
│  │  - Real-time subscriptions                           │   │
│  │  - RLS policies for security                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── RootLayout
│   ├── Navigation
│   │   ├── Logo
│   │   ├── NavItems (Groups, Payments, QR Code)
│   │   ├── WalletDisplay
│   │   └── LogoutButton
│   │
│   └── Dashboard Pages
│       ├── /dashboard (Wallet)
│       │   ├── WelcomeBanner
│       │   ├── BalanceCard
│       │   ├── AddMoneyModal
│       │   ├── QuickActions
│       │   └── TransactionList
│       │
│       ├── /dashboard/groups
│       │   ├── CreateGroupForm
│       │   ├── GroupCard (x multiple)
│       │   │   ├── MembersList
│       │   │   ├── InviteForm
│       │   │   └── PendingInvitations
│       │   └── EmptyState
│       │
│       ├── /dashboard/payments
│       │   ├── CreatePaymentForm
│       │   ├── PaymentCard (x multiple)
│       │   │   ├── ApprovalProgress
│       │   │   ├── MemberApprovals
│       │   │   └── ActionButtons
│       │   └── Tabs (Pending/Completed)
│       │
│       └── /dashboard/qr
│           ├── QRDisplay
│           │   ├── QRCanvas
│           │   ├── AccountDetails
│           │   └── DownloadButton
│           │
│           └── PaymentModes
│               ├── QRScanner
│               └── ManualPayment
│
└── Footer
```

## Data Flow

### Authentication Flow
```
User Input (Email/Password)
    ↓
[page.tsx - Login Component]
    ↓
[useAppStore - login/register action]
    ↓
[Zustand Store - updates currentUser]
    ↓
[Router pushes to /dashboard]
    ↓
[DashboardLayout - checks isAuthenticated]
    ↓
Dashboard Pages Rendered
```

### Payment Creation Flow
```
User creates payment in group
    ↓
Amount + Group ID
    ↓
[payments/page.tsx - handleCreatePayment]
    ↓
[useAppStore - createPayment action]
    ↓
[Zustand - calculates per-member amount]
    ↓
[Zustand - creates Payment object with approvals]
    ↓
[Zustand - updates payments array]
    ↓
[Component re-renders with new payment]
    ↓
Payment appears in Pending tab
```

### Payment Approval Flow
```
Member approves payment
    ↓
[payments/page.tsx - handleApprovePayment]
    ↓
[useAppStore - approvePayment action]
    ↓
[Zustand - marks approval as approved: true]
    ↓
[Zustand - checks if all approved]
    ↓
If all approved: payment.status = 'approved'
    ↓
[Component re-renders with updated status]
    ↓
Initiator can now complete payment
```

### Payment Completion Flow
```
Initiator completes payment
    ↓
[payments/page.tsx - handleCompletePayment]
    ↓
[useAppStore - completePayment action]
    ↓
[Zustand - marks payment as 'completed']
    ↓
[Zustand - creates transaction records]
    ↓
[Zustand - would update wallet balances (when integrated)]
    ↓
[Component updates to Completed tab]
    ↓
All members see payment as completed
```

## State Structure (Zustand Store)

```typescript
AppState {
  // Authentication
  currentUser: User | null
  isAuthenticated: boolean
  
  // Wallet
  wallet_balance: number
  
  // Groups
  groups: Group[]
  groupMembers: { [groupId]: GroupMember[] }
  
  // Payments
  payments: Payment[]
  
  // Transactions
  transactions: Transaction[]
  
  // Actions (functions)
  login(email, password)
  register(email, password, name)
  logout()
  addToWallet(amount)
  createGroup(name, description)
  inviteToGroup(groupId, email)
  respondToInvitation(groupId, memberId, approved)
  createPayment(groupId, amount)
  approvePayment(paymentId)
  completePayment(paymentId)
  ... more actions
}
```

## Database Schema (Ready for Supabase)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  name VARCHAR,
  phone VARCHAR,
  wallet_balance DECIMAL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Groups Table
```sql
CREATE TABLE groups (
  id UUID PRIMARY KEY,
  name VARCHAR,
  description TEXT,
  creator_id UUID FOREIGN KEY,
  total_members INT,
  status VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### GroupMembers Table
```sql
CREATE TABLE group_members (
  id UUID PRIMARY KEY,
  group_id UUID FOREIGN KEY,
  user_id UUID FOREIGN KEY,
  status VARCHAR (pending/approved/declined),
  joined_at TIMESTAMP
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  group_id UUID FOREIGN KEY,
  initiator_id UUID FOREIGN KEY,
  total_amount DECIMAL,
  amount_per_member DECIMAL,
  status VARCHAR (pending/approved/completed),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### PaymentApprovals Table
```sql
CREATE TABLE payment_approvals (
  id UUID PRIMARY KEY,
  payment_id UUID FOREIGN KEY,
  user_id UUID FOREIGN KEY,
  approved BOOLEAN,
  approved_at TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  payment_id UUID FOREIGN KEY,
  from_user_id UUID FOREIGN KEY,
  to_user_id UUID FOREIGN KEY,
  amount DECIMAL,
  status VARCHAR (pending/completed/failed),
  created_at TIMESTAMP
);
```

## Page Routes & Responsibilities

```
/                           - Login/Register page
/dashboard                  - Wallet & balance management
/dashboard/groups           - Group CRUD operations
/dashboard/groups/[id]      - Group details (future)
/dashboard/payments         - Payment management
/dashboard/payments/[id]    - Payment details (future)
/dashboard/qr               - QR code generation & scanning
```

## Technology Stack

```
Frontend:
├── Next.js 15              - Framework
├── React 19               - UI Library
├── TypeScript             - Type safety
├── Tailwind CSS           - Styling
├── shadcn/ui              - Component library
├── Lucide React           - Icons
├── Zustand                - State management
├── qrcode                 - QR generation
└── next/navigation        - Routing

Backend (To Implement):
├── Supabase               - Backend service
├── PostgreSQL             - Database
├── Supabase Auth          - Authentication
├── Real-time API          - Live updates
└── RLS Policies           - Security

DevTools:
├── pnpm                   - Package manager
├── TypeScript Compiler    - Type checking
├── Tailwind CLI           - CSS generation
└── Vercel                 - Hosting (optional)
```

## Key Design Patterns

### 1. State Management
- **Zustand Store**: Centralized state for all app data
- **Actions**: Methods to modify state
- **Subscriptions**: Components subscribe to state changes

### 2. Component Architecture
- **Page Components**: Handle routing and high-level logic
- **Feature Components**: Self-contained features (Groups, Payments)
- **UI Components**: Reusable shadcn/ui components
- **Layout Components**: Navigation, Footer, Wrappers

### 3. Data Validation
- **TypeScript Interfaces**: Strong typing for all data
- **Form Validation**: Input validation before store updates
- **Type Guards**: Runtime type checking where needed

### 4. Error Handling
- **Try-Catch Blocks**: Wrap async operations
- **Error State**: Display errors to users
- **Loading States**: Show progress during operations

## API Routes (Ready to Implement)

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout

GET    /api/wallet/balance
POST   /api/wallet/add-money
GET    /api/wallet/transactions

POST   /api/groups/create
GET    /api/groups/list
GET    /api/groups/:id
POST   /api/groups/:id/invite
PUT    /api/groups/:id/members/:memberId
DELETE /api/groups/:id

POST   /api/payments/create
GET    /api/payments/:groupId
PUT    /api/payments/:id/approve
PUT    /api/payments/:id/complete

GET    /api/qr/generate
POST   /api/qr/scan
```

## Styling Architecture

```
globals.css
├── CSS Variables (Design Tokens)
│   ├── Colors (primary, secondary, accent, etc.)
│   ├── Typography (fonts, sizes)
│   └── Spacing (radius, gaps)
│
├── Tailwind Theme
│   ├── Color palette
│   ├── Typography
│   └── Responsive breakpoints
│
├── Custom Utilities
│   ├── gradient-text
│   ├── card-hover
│   └── glass-effect
│
└── Layer Styles
    ├── Base
    ├── Components
    └── Utilities
```

## Performance Optimizations

1. **Code Splitting**: Next.js automatic route-based splitting
2. **Image Optimization**: Ready for image components
3. **CSS-in-JS**: Tailwind CSS minimized output
4. **State Updates**: Zustand batch updates
5. **Component Memoization**: React.memo where needed
6. **Lazy Loading**: Route-based lazy loading

## Security Considerations

### Current Implementation
- Mock authentication (for development)
- Client-side only state management
- No actual data persistence

### When Moving to Production
- Implement Supabase Auth with JWT
- Use HTTP-only cookies
- Enable RLS policies
- Validate all inputs server-side
- Use HTTPS for all requests
- Implement rate limiting
- Add audit logging
- Encrypt sensitive data

## Testing Strategy

```
Unit Tests:
├── Store actions
├── Utility functions
└── Component logic

Integration Tests:
├── Full user flows
├── Payment splitting
└── Group management

E2E Tests:
├── Complete workflows
├── Cross-page navigation
└── Real-world scenarios
```

## Deployment

```
Development:
└── Local dev server (pnpm dev)

Preview/Staging:
└── Vercel preview deployments

Production:
├── Vercel hosting
├── Next.js build optimization
├── CDN for static assets
└── Environment variables setup
```

## Future Enhancements

```
Phase 1: MVP Complete ✅
├── Authentication ✅
├── Wallet ✅
├── Groups ✅
├── Payments ✅
└── QR Codes ✅

Phase 2: Backend Integration
├── Supabase setup
├── Database migration
├── Real-time subscriptions
└── Authentication integration

Phase 3: Advanced Features
├── Analytics dashboard
├── Expense categorization
├── Budget tracking
├── Settlement optimization
└── Notifications

Phase 4: Mobile & Scale
├── React Native app
├── Push notifications
├── Offline support
└── High-volume optimization
```

---

This architecture is designed to be scalable, maintainable, and ready for production backend integration.
