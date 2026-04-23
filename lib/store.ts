import { create } from 'zustand';
import type { User, Group, GroupMember, Payment, Transaction } from './types';

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;

  // Wallet
  wallet_balance: number;
  addToWallet: (amount: number) => void;
  deductFromWallet: (amount: number) => void;
  setWalletBalance: (amount: number) => void;

  // Groups
  groups: Group[];
  groupMembers: { [groupId: string]: GroupMember[] };
  fetchGroups: () => Promise<void>;
  createGroup: (name: string, description?: string) => Promise<string>;
  inviteToGroup: (groupId: string, email: string) => Promise<void>;
  respondToInvitation: (groupId: string, memberId: string, approved: boolean) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;

  // Payments
  payments: Payment[];
  fetchPayments: (groupId: string) => Promise<void>;
  createPayment: (groupId: string, amount: number) => Promise<string>;
  approvePayment: (paymentId: string) => Promise<void>;
  completePayment: (paymentId: string) => Promise<void>;

  // Transactions
  transactions: Transaction[];
  fetchTransactions: () => Promise<void>;
  settleTransaction: (transactionId: string) => Promise<void>;
}

// Mock data storage
let mockUsers: { [key: string]: User } = {
  'user1@example.com': {
    id: 'user1',
    email: 'user1@example.com',
    name: 'John Doe',
    phone: '+91 9876543210',
    wallet_balance: 5000,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
};

let mockGroups: Group[] = [];
let mockGroupMembers: { [key: string]: GroupMember[] } = {};
let mockPayments: Payment[] = [];
let mockTransactions: Transaction[] = [];

export const useAppStore = create<AppState>((set, get) => ({
  // Auth
  currentUser: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    // Mock login
    if (mockUsers[email]) {
      const user = mockUsers[email];
      set({
        currentUser: user,
        isAuthenticated: true,
        wallet_balance: user.wallet_balance,
      });
    } else {
      throw new Error('User not found');
    }
  },

  register: async (email: string, password: string, name: string) => {
    if (mockUsers[email]) {
      throw new Error('User already exists');
    }
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      wallet_balance: 5000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockUsers[email] = newUser;
    set({
      currentUser: newUser,
      isAuthenticated: true,
      wallet_balance: 5000,
    });
  },

  logout: () => {
    set({
      currentUser: null,
      isAuthenticated: false,
      wallet_balance: 0,
    });
  },

  // Wallet
  wallet_balance: 0,
  addToWallet: (amount: number) => {
    set((state) => ({
      wallet_balance: state.wallet_balance + amount,
    }));
  },
  deductFromWallet: (amount: number) => {
    set((state) => ({
      wallet_balance: Math.max(0, state.wallet_balance - amount),
    }));
  },
  setWalletBalance: (amount: number) => {
    set({ wallet_balance: amount });
  },

  // Groups
  groups: [],
  groupMembers: {},

  fetchGroups: async () => {
    const { currentUser } = get();
    if (currentUser) {
      const userGroups = mockGroups.filter(
        (g) => g.creator_id === currentUser.id || mockGroupMembers[g.id]?.some((m) => m.user_id === currentUser.id)
      );
      set({ groups: userGroups });
    }
  },

  createGroup: async (name: string, description?: string) => {
    const { currentUser } = get();
    if (!currentUser) throw new Error('Not authenticated');

    const groupId = `group_${Date.now()}`;
    const newGroup: Group = {
      id: groupId,
      name,
      description,
      creator_id: currentUser.id,
      total_members: 1,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockGroups.push(newGroup);
    mockGroupMembers[groupId] = [
      {
        id: `member_${Date.now()}`,
        group_id: groupId,
        user_id: currentUser.id,
        status: 'approved',
        joined_at: new Date().toISOString(),
      },
    ];

    await get().fetchGroups();
    return groupId;
  },

  inviteToGroup: async (groupId: string, email: string) => {
    const memberId = `member_${Date.now()}`;
    const newMember: GroupMember = {
      id: memberId,
      group_id: groupId,
      user_id: email, // Using email as temporary ID
      status: 'pending',
      joined_at: new Date().toISOString(),
    };

    if (!mockGroupMembers[groupId]) {
      mockGroupMembers[groupId] = [];
    }
    mockGroupMembers[groupId].push(newMember);

    const group = mockGroups.find((g) => g.id === groupId);
    if (group) {
      group.total_members += 1;
    }
  },

  respondToInvitation: async (groupId: string, memberId: string, approved: boolean) => {
    const members = mockGroupMembers[groupId];
    if (members) {
      const member = members.find((m) => m.id === memberId);
      if (member) {
        member.status = approved ? 'approved' : 'declined';
      }
    }
    await get().fetchGroups();
  },

  deleteGroup: async (groupId: string) => {
    mockGroups = mockGroups.filter((g) => g.id !== groupId);
    delete mockGroupMembers[groupId];
    await get().fetchGroups();
  },

  // Payments
  payments: [],

  fetchPayments: async (groupId: string) => {
    const groupPayments = mockPayments.filter((p) => p.group_id === groupId);
    set({ payments: groupPayments });
  },

  createPayment: async (groupId: string, amount: number) => {
    const { currentUser } = get();
    if (!currentUser) throw new Error('Not authenticated');

    const members = mockGroupMembers[groupId] || [];
    const approvedMembers = members.filter((m) => m.status === 'approved').length;
    const amountPerMember = amount / approvedMembers;

    const paymentId = `payment_${Date.now()}`;
    const newPayment: Payment = {
      id: paymentId,
      group_id: groupId,
      initiator_id: currentUser.id,
      total_amount: amount,
      amount_per_member: amountPerMember,
      status: 'pending',
      approvals: members
        .filter((m) => m.status === 'approved')
        .map((m) => ({
          id: `approval_${Date.now()}_${Math.random()}`,
          payment_id: paymentId,
          user_id: m.user_id,
          approved: false,
        })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockPayments.push(newPayment);
    return paymentId;
  },

  approvePayment: async (paymentId: string) => {
    const { currentUser } = get();
    if (!currentUser) throw new Error('Not authenticated');

    const payment = mockPayments.find((p) => p.id === paymentId);
    if (payment) {
      const approval = payment.approvals.find((a) => a.user_id === currentUser.id);
      if (approval) {
        approval.approved = true;
        approval.approved_at = new Date().toISOString();
      }

      // Check if all members approved
      const allApproved = payment.approvals.every((a) => a.approved);
      if (allApproved) {
        payment.status = 'approved';
      }
    }
  },

  completePayment: async (paymentId: string) => {
    const payment = mockPayments.find((p) => p.id === paymentId);
    if (payment && payment.status === 'approved') {
      payment.status = 'completed';

      // Create transactions
      const members = mockGroupMembers[payment.group_id] || [];
      const approvedMembers = members.filter((m) => m.status === 'approved');

      approvedMembers.forEach((member) => {
        if (member.user_id !== payment.initiator_id) {
          const transaction: Transaction = {
            id: `txn_${Date.now()}_${Math.random()}`,
            payment_id: paymentId,
            from_user_id: member.user_id,
            to_user_id: payment.initiator_id,
            amount: payment.amount_per_member,
            status: 'pending',
            created_at: new Date().toISOString(),
          };
          mockTransactions.push(transaction);
        }
      });
      await get().fetchTransactions();
    }
  },

  // Transactions
  transactions: [],
  fetchTransactions: async () => {
    const { currentUser } = get();
    if (currentUser) {
      const userTxns = mockTransactions.filter(
        (t) =>
          t.from_user_id === currentUser.id ||
          t.to_user_id === currentUser.id ||
          t.from_user_id === currentUser.email ||
          t.to_user_id === currentUser.email
      );
      set({ transactions: userTxns.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) });
    }
  },

  settleTransaction: async (transactionId: string) => {
    const { currentUser } = get();
    if (!currentUser) throw new Error('Not authenticated');

    const transaction = mockTransactions.find((t) => t.id === transactionId);
    if (transaction && transaction.status === 'pending') {
      transaction.status = 'completed';
      
      // Deduct from wallet if the current user is the one paying
      if (transaction.from_user_id === currentUser.id || transaction.from_user_id === currentUser.email) {
        get().deductFromWallet(transaction.amount);
      } else if (transaction.to_user_id === currentUser.id || transaction.to_user_id === currentUser.email) {
        // If current user is the initiator and somehow marking it paid for the other person
        // we add to wallet since they received it. Actually they always receive it upon settlement.
        get().addToWallet(transaction.amount);
      }
      
      await get().fetchTransactions();
    }
  },
}));
