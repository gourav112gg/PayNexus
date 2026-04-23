import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface MinCashFlowTransaction {
  from: string;
  to: string;
  amount: number;
}

/**
 * Minimum Cash Flow Algorithm
 * Input: balances object { userId: netAmount }
 * Output: array of { from, to, amount } transactions
 */
export function minCashFlow(balances: Record<string, number>): MinCashFlowTransaction[] {
  const transactions: MinCashFlowTransaction[] = [];
  
  // Separate into creditors (positive) and debtors (negative)
  const creditors: { user: string; amount: number }[] = [];
  const debtors: { user: string; amount: number }[] = [];
  
  for (const [user, balance] of Object.entries(balances)) {
    const rounded = Math.round(balance * 100) / 100; // avoid float errors
    if (rounded > 0.01)  creditors.push({ user, amount: rounded });
    if (rounded < -0.01) debtors.push({ user, amount: Math.abs(rounded) });
  }
  
  // Sort descending for greedy approach
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);
  
  let i = 0, j = 0;
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor   = debtors[j];
    const settle   = Math.min(creditor.amount, debtor.amount);
    
    transactions.push({
      from:   debtor.user,
      to:     creditor.user,
      amount: Math.round(settle * 100) / 100,
    });
    
    creditor.amount -= settle;
    debtor.amount   -= settle;
    
    if (creditor.amount < 0.01) i++;
    if (debtor.amount < 0.01)   j++;
  }
  
  return transactions;
}
