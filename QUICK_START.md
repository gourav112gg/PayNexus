# SplitPay - Quick Start Guide

## 🚀 Get Started in 30 Seconds

### 1. Login with Demo Account
```
Email: user1@example.com
Password: password
Starting Balance: ₹5000
```

### 2. Explore the Dashboard
You'll land on the **Wallet** page showing:
- Your current balance (₹5000)
- Recent transactions
- Add Money button
- Quick navigation to other sections

### 3. Create Your First Group
1. Click **"Groups"** in the navigation
2. Click **"New Group"** button
3. Enter a group name (e.g., "Friends Dinner")
4. Add an optional description
5. Click **"Create Group"**

### 4. Invite Members
1. In your group, enter a friend's email
2. Click **"Send"** to invite them
3. They'll appear in "Pending Invitations"
4. When they accept, they move to "Members"

### 5. Create a Payment
1. Go to **"Payments"** page
2. Click **"New Payment"**
3. Select your group
4. Enter total amount (e.g., ₹1000)
5. Amount automatically splits equally (₹500 each for 2 members)
6. Click **"Create Payment"**

### 6. Approve Payment
1. All group members must approve
2. Watch the progress bar fill up
3. Once all approve, payment shows as "Approved"

### 7. Complete Payment
1. As the initiator, click **"Complete Payment"**
2. Money is deducted from all wallets
3. Money is credited to your wallet
4. Transaction appears in history

### 8. Get Your QR Code
1. Go to **"QR Code"** page
2. Your QR code is displayed
3. Download it as PNG
4. Share with friends for direct payments

### 9. Send Direct Payment
1. Switch to "Phone No" tab on QR page
2. Enter recipient's phone number
3. Enter amount
4. Click **"Send Payment"**

### 10. Add More Money
1. On Wallet page, click **"Add Money"**
2. Choose preset amount or enter custom
3. Money is added to your balance instantly

## 📱 Mobile Tips

- Navigation automatically adapts to mobile view
- Use hamburger menu for more space
- Cards are touch-friendly and responsive
- All features work on phones and tablets

## 🎯 Common Workflows

### Pay for Group Dinner
```
1. Create "Group Dinner" 
2. Invite 3 friends (4 people total)
3. Restaurant bill: ₹4000
4. Per person: ₹1000
5. Each person approves
6. Payment completed
7. Each wallet reduced by ₹1000
```

### Split Rent with Roommates
```
1. Create "Rent" group
2. Invite all roommates
3. Create payment for total rent
4. Everyone approves their share
5. Money split equally
6. Landlord receives total
```

### Friend Owes You Money
```
1. Use QR Code feature
2. Share your QR code
3. Friend scans with phone
4. Enters amount they owe
5. Payment sent to your wallet
```

## ⚡ Pro Tips

### Tip 1: Multiple Groups
- Create separate groups for different friend circles
- Groups are completely independent
- Keep track of different expenses separately

### Tip 2: Regular Expenses
- Create recurring groups for regular payments
- Monthly group outings
- Shared bill groups

### Tip 3: Track Everything
- Check your transaction history
- See who owes what
- Monitor your spending

### Tip 4: Use QR Codes
- Download your QR code
- Share it with friends
- They can pay you directly without groups

### Tip 5: Test Thoroughly
- Create test groups with dummy amounts
- Practice the approval flow
- Get comfortable before real use

## ❓ FAQ

**Q: Can I create multiple groups?**
A: Yes! You can create as many groups as you need.

**Q: What if a member doesn't approve?**
A: Payment remains pending. All members must approve to proceed.

**Q: Can I undo a payment?**
A: Once completed, payments are final (in demo mode).

**Q: How much money do I start with?**
A: ₹5000 Rs for testing. You can add more with "Add Money".

**Q: Can I pay someone directly without a group?**
A: Yes! Use the QR Code feature to send direct payments.

**Q: Is this a real payment app?**
A: This is a demo/testing version. All money is dummy. Ready for Supabase backend.

**Q: Can I delete a group?**
A: Yes! Click the trash icon next to the group name.

**Q: What happens if I logout?**
A: All data is in memory. You'll need to login again to see your groups.

## 🔑 Key Features at a Glance

| Feature | Location | How to Use |
|---------|----------|-----------|
| Wallet | Dashboard | View balance, add money, track transactions |
| Groups | Groups page | Create, invite, manage groups |
| Payments | Payments page | Create requests, approve, complete |
| QR Codes | QR Code page | Generate, download, share |
| Settings | Navigation | Logout, manage account |

## 🎨 Design Highlights

- **Premium UI**: Modern gradient design with purple and orange accents
- **Dark Mode**: Fully supported with CSS variables
- **Responsive**: Works perfectly on all devices
- **Smooth Animations**: Transitions and hover effects throughout
- **Real-time Updates**: Instant feedback on all actions

## 🚨 Important Notes

### Before Using as Real App
- This is currently a demo/prototype
- All data is stored locally (not persistent)
- No real money transactions
- QR scanner is a placeholder
- Needs Supabase backend for production

### For Development
- See README.md for full documentation
- Check PROJECT_SUMMARY.md for technical details
- Review /lib/types.ts for data structures
- Check /lib/store.ts for mock implementation

## 📞 Need Help?

1. Check the FAQ section above
2. Read the full README.md
3. Review PROJECT_SUMMARY.md
4. Check component source code with comments

## 🎓 Learning Path

1. **Start**: Understand wallet concepts
2. **Groups**: Create and manage groups
3. **Payments**: Learn splitting mechanism
4. **QR**: Explore direct payments
5. **Advanced**: Check Supabase integration guide

---

**Ready to explore?** Click the preview button and jump into your wallet dashboard!

Enjoy SplitPay! 🎉
