# SplitPay - Premium Group Payment App

A modern, premium frontend for managing group payments and wallet transactions with QR code support.

## Features

### 🎯 Core Features
- **User Authentication**: Email/password based login and registration
- **Smart Wallet**: Manage your balance with dummy money for testing
- **Group Management**: Create multiple groups and invite friends via email
- **Payment Splitting**: Automatic equal split of payments among group members
- **QR Code Payments**: Generate and scan QR codes for easy payments
- **Phone Number Payments**: Manual payment via phone numbers

### 💳 Wallet Features
- Add dummy money to your wallet (preset amounts: ₹500, ₹1000, ₹2000, ₹5000)
- View real-time balance
- Track transaction history
- Send and receive payments

### 👥 Group Features
- Create multiple groups with descriptions
- Invite members via email addresses
- Track pending and approved members
- Manage group payments
- Delete groups when needed

### 💰 Payment System
- Create payment requests for groups
- Automatic calculation of per-member amounts
- Individual member approval required
- Real-time approval tracking with progress bars
- Atomic transaction processing
- Transaction history

### 📱 QR Code System
- Generate QR codes with phone number + account ID
- Download QR codes as PNG
- Manual phone-based payment fallback
- Copy phone number to clipboard

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or pnpm

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd splitpay
```

2. Install dependencies
```bash
pnpm install
```

3. Run the development server
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials

```
Email: user1@example.com
Password: password
```

Starting balance: ₹5000

## Project Structure

```
├── app/
│   ├── page.tsx              # Login/Register page
│   ├── dashboard/
│   │   ├── layout.tsx        # Dashboard layout with auth check
│   │   ├── page.tsx          # Wallet dashboard
│   │   ├── groups/
│   │   │   └── page.tsx      # Groups management
│   │   ├── payments/
│   │   │   └── page.tsx      # Payment splitting
│   │   └── qr/
│   │       └── page.tsx      # QR code payments
│   ├── globals.css           # Global styles with design tokens
│   └── layout.tsx            # Root layout
│
├── components/
│   ├── Navigation.tsx        # Top navigation bar
│   ├── Footer.tsx            # Footer component
│   ├── WelcomeBanner.tsx    # Welcome message
│   ├── StatsCard.tsx        # Statistics card component
│   └── ui/                   # shadcn/ui components
│
├── lib/
│   ├── types.ts             # TypeScript interfaces
│   ├── store.ts             # Zustand store (mock Supabase)
│   └── utils.ts             # Utility functions
│
└── public/                   # Static assets
```

## Key Technologies

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **QR Codes**: qrcode library
- **Database**: Mock implementation (ready for Supabase integration)

## Design System

### Colors
- **Primary**: Cool purple/blue (`oklch(0.55 0.18 260)`)
- **Secondary**: Deep violet (`oklch(0.68 0.14 280)`)
- **Accent**: Warm orange/red (`oklch(0.62 0.22 25)`)
- **Background**: Light neutral (`oklch(0.98 0.001 240)`)
- **Foreground**: Dark text (`oklch(0.15 0 0)`)

### Typography
- **Font Family**: Geist (default system font)
- **Headings**: Bold with gradient text option
- **Body**: Regular weight with optimal line height

## Features Walkthrough

### 1. Authentication
- Sign up with email and password
- Login with existing credentials
- Initial wallet balance: ₹5000

### 2. Wallet Management
- View current balance
- Add money with preset buttons
- See transaction history
- Track payments sent and received

### 3. Group Creation & Management
- Create a new group with name and optional description
- Invite members by email
- Accept/decline membership requests
- View all group members
- Delete groups

### 4. Payment Splitting
- Create payment requests for any group
- Automatic split calculation
- All members must approve individually
- Real-time approval tracking
- Complete payment once all approve
- Money deducted from all wallets
- Money credited to initiator

### 5. QR Code Payments
- Generate QR code with your details
- Download QR code as PNG image
- Share with friends for easy payments
- Manual phone number entry as fallback
- Copy phone number with one click

## Data Structure

### User
```typescript
- id: string
- email: string
- phone?: string
- name: string
- wallet_balance: number
- created_at: string
- updated_at: string
```

### Group
```typescript
- id: string
- name: string
- description?: string
- creator_id: string
- total_members: number
- status: 'active' | 'inactive'
- created_at: string
```

### Payment
```typescript
- id: string
- group_id: string
- initiator_id: string
- total_amount: number
- amount_per_member: number
- status: 'pending' | 'approved' | 'completed'
- approvals: PaymentApproval[]
- created_at: string
```

## Integration with Supabase (Future)

This application is built with a mock data layer that can easily be replaced with real Supabase integration:

1. Replace mock functions in `lib/store.ts` with Supabase client calls
2. Set up Supabase tables matching the TypeScript interfaces in `lib/types.ts`
3. Add environment variables for Supabase credentials
4. Implement Real-time subscriptions for live updates
5. Add RLS (Row Level Security) policies for data protection

## API Routes (Ready for Backend)

The following routes are ready to be implemented:

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout

GET    /api/wallet/balance
POST   /api/wallet/add-money
GET    /api/wallet/transactions

POST   /api/groups/create
GET    /api/groups/list
POST   /api/groups/{id}/invite
PUT    /api/groups/{id}/update-member
DELETE /api/groups/{id}/delete

POST   /api/payments/create
GET    /api/payments/{groupId}
PUT    /api/payments/{id}/approve
PUT    /api/payments/{id}/complete

GET    /api/qr/generate
POST   /api/qr/scan
```

## Styling Notes

- All colors use CSS design tokens for easy theming
- Responsive design with mobile-first approach
- Gradient backgrounds for premium feel
- Smooth transitions and hover effects
- Dark mode support via CSS variables

## Performance Optimizations

- Client-side state management with Zustand
- Optimistic UI updates
- Lazy loading of dashboard components
- CSS-in-JS with Tailwind for minimal bundle
- Image optimization with Next.js Image component

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Future Enhancements

- Real Supabase backend integration
- Real-time notifications
- Payment history analytics
- Invoice generation
- Expense categorization
- Budget tracking
- Group expense splitting algorithm
- Mobile app (React Native)
- Advanced security features (2FA, biometric)
- Payment reminders
- Settlement optimization

## Contributing

Contributions are welcome! Please follow the existing code style and patterns.

## License

MIT License - feel free to use this project for personal or commercial use.

## Support

For issues, bugs, or feature requests, please open an issue in the repository.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
