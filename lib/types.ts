// Database Types for Split Payment App

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  wallet_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  creator_id: string;
  total_members: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'declined';
  joined_at: string;
}

export interface Payment {
  id: string;
  group_id: string;
  initiator_id: string;
  total_amount: number;
  amount_per_member: number;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  approvals: PaymentApproval[];
  created_at: string;
  updated_at: string;
}

export interface PaymentApproval {
  id: string;
  payment_id: string;
  user_id: string;
  approved: boolean;
  approved_at?: string;
}

export interface Transaction {
  id: string;
  payment_id: string;
  from_user_id: string;
  to_user_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface QRCode {
  phone: string;
  account_id: string;
  name: string;
}
