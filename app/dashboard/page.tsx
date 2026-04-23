'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowUpRight, ArrowDownLeft, Plus, TrendingUp } from 'lucide-react';

export default function WalletPage() {
  const { currentUser, wallet_balance, addToWallet, transactions, fetchTransactions, settleTransaction } = useAppStore();
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAddMoney = () => {
    if (amount && parseFloat(amount) > 0) {
      addToWallet(parseFloat(amount));
      setAmount('');
      setShowAddMoney(false);
    }
  };



  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold mb-2 text-foreground tracking-tight">Wallet</h1>
        <p className="text-[16px] text-muted-foreground">
          Manage your balance and track all transactions
        </p>
      </div>

      {/* Balance Card */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-[1.5px] mb-3">
                Total Balance
              </p>
              <p className="text-[48px] font-bold text-foreground leading-none tracking-tighter">₹{wallet_balance.toFixed(2)}</p>
              <p className="text-[14px] text-muted-foreground mt-4 font-mono tracking-wide">{currentUser?.email}</p>
            </div>
            <div className="p-4 bg-primary rounded-full smooth-transition shadow-[0_4px_12px_rgba(30,215,96,0.2)]">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
        </Card>

        {/* Quick Action */}
        <Button
          onClick={() => setShowAddMoney(!showAddMoney)}
          className="w-full h-full py-10 flex flex-col items-center gap-3 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-[8px]"
        >
          <div className="p-3 bg-foreground/10 rounded-full">
            <Plus className="w-6 h-6 text-secondary-foreground" />
          </div>
          <span className="text-[14px] font-bold uppercase tracking-[1px]">Add Money</span>
        </Button>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <Card className="bg-popover border border-border/40 p-6 pt-5 shadow-[rgba(0,0,0,0.1)_0px_8px_24px] dark:shadow-[rgba(0,0,0,0.5)_0px_8px_24px]">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-[18px] font-bold text-foreground">Add Money</h3>
              <p className="text-[14px] text-muted-foreground mt-1">Quick preset amounts or custom</p>
            </div>
            <button
              onClick={() => setShowAddMoney(false)}
              className="text-muted-foreground hover:text-foreground smooth-hover"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            <Input
              type="number"
              placeholder="Enter custom amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleAddMoney}
              className="px-8"
            >
              Add
            </Button>
          </div>

          <div className="flex gap-3 flex-wrap">
            {[500, 1000, 2000, 5000].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  addToWallet(preset);
                  setShowAddMoney(false);
                }}
                className="px-5 py-2.5 rounded-full bg-transparent text-[14px] font-bold tracking-[1px] smooth-transition border border-border text-foreground hover:border-foreground hover:bg-foreground/5 active:scale-95"
              >
                ₹{preset}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Transactions & Debts */}
      <div>
        <h2 className="text-[20px] font-bold text-foreground mb-6 tracking-tight">Recent Activity & Debts</h2>
        <div className="space-y-3">
          {transactions.length > 0 ? (
            transactions.map((txn) => {
              const isReceived = txn.to_user_id === currentUser?.id || txn.to_user_id === currentUser?.email;
              const isPending = txn.status === 'pending';
              const Icon = isReceived ? ArrowDownLeft : ArrowUpRight;
              
              return (
                <Card
                  key={txn.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-accent group shadow-none gap-4"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`p-3 rounded-full smooth-transition ${isPending ? 'bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20' : 'bg-secondary text-secondary-foreground group-hover:bg-foreground/10'}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[16px] font-bold text-foreground">
                         {isReceived ? 'From' : 'To'} {isReceived ? txn.from_user_id : txn.to_user_id}
                      </p>
                      <p className="text-[14px] text-muted-foreground mt-0.5">
                        {new Date(txn.created_at).toLocaleDateString()} {isPending && '• Pending Debt'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <p
                      className={`text-[16px] font-bold tracking-wide ${
                        isPending && isReceived ? 'text-orange-500' : 
                        isPending && !isReceived ? 'text-red-500' :
                        isReceived ? 'text-primary' : 'text-foreground'
                      }`}
                    >
                      {isReceived ? '+' : '-'}₹{txn.amount.toFixed(2)}
                    </p>
                    {isPending && !isReceived && (
                      <Button onClick={() => settleTransaction(txn.id)} size="sm">
                         Settle Up
                      </Button>
                    )}
                    {isPending && isReceived && (
                      <Button variant="outline" size="sm" onClick={() => settleTransaction(txn.id)}>
                         Mark Paid
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="p-10 text-center bg-transparent border border-dashed border-border shadow-none hover:bg-transparent">
              <p className="text-[16px] font-medium text-muted-foreground">No transactions or debts yet</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
