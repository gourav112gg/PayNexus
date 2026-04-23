'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CreditCard, Plus, Check, Clock, AlertCircle } from 'lucide-react';

export default function PaymentsPage() {
  const {
    groups,
    groupMembers,
    payments,
    fetchPayments,
    createPayment,
    approvePayment,
    completePayment,
    currentUser,
    wallet_balance,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [showNewPayment, setShowNewPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    groupId: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'pending' && groups.length > 0) {
      fetchPayments(groups[0].id);
    }
  }, [groups, activeTab, fetchPayments]);

  const handleCreatePayment = async () => {
    if (newPayment.groupId && newPayment.amount) {
      setLoading(true);
      try {
        const amount = parseFloat(newPayment.amount);
        if (amount <= wallet_balance) {
          await createPayment(newPayment.groupId, amount);
          setNewPayment({ groupId: '', amount: '' });
          setShowNewPayment(false);
          await fetchPayments(newPayment.groupId);
        } else {
          alert('Insufficient balance');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleApprovePayment = async (paymentId: string) => {
    setLoading(true);
    try {
      await approvePayment(paymentId);
      const groupId = payments.find((p) => p.id === paymentId)?.group_id;
      if (groupId) await fetchPayments(groupId);
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePayment = async (paymentId: string) => {
    setLoading(true);
    try {
      await completePayment(paymentId);
      const groupId = payments.find((p) => p.id === paymentId)?.group_id;
      if (groupId) await fetchPayments(groupId);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <Clock className="w-3 h-3" />
            Pending
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-semibold">
            <Check className="w-3 h-3" />
            Approved
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-semibold">
            <Check className="w-3 h-3" />
            Completed
          </div>
        );
      default:
        return null;
    }
  };

  const getApprovals = (paymentId: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return { total: 0, approved: 0 };
    return {
      total: payment.approvals.length,
      approved: payment.approvals.filter((a) => a.approved).length,
    };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-foreground">Payments</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage split payments with your groups
          </p>
        </div>
        <Button
          onClick={() => setShowNewPayment(!showNewPayment)}
          className="gap-2 bg-primary text-white font-medium btn-smooth hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          <span>New Payment</span>
        </Button>
      </div>

      {/* Create Payment Form */}
      {showNewPayment && (
        <Card className="border border-border/40 bg-muted/30 p-6 smooth-transition">
          <h3 className="font-semibold text-foreground mb-5">Create Payment Request</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Select Group
              </label>
              <select
                value={newPayment.groupId}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, groupId: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-md border border-border bg-background text-foreground text-sm smooth-transition focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="">Choose a group...</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Total Amount
              </label>
              <Input
                type="number"
                placeholder="e.g., 1000"
                value={newPayment.amount}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, amount: e.target.value })
                }
                className="input-minimal text-sm"
              />
              {newPayment.amount && newPayment.groupId && (
                <div className="mt-3 p-3 bg-background border border-border/40 rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">
                    Per member
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    ₹
                    {(
                      parseFloat(newPayment.amount) /
                      (groupMembers[newPayment.groupId]?.filter(
                        (m) => m.status === 'approved'
                      ).length || 1)
                    ).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-3">
              <Button
                onClick={handleCreatePayment}
                disabled={
                  loading ||
                  !newPayment.groupId ||
                  !newPayment.amount ||
                  parseFloat(newPayment.amount) > wallet_balance
                }
                className="bg-primary text-white font-medium btn-smooth hover:bg-primary/90"
              >
                Create
              </Button>
              <Button
                onClick={() => setShowNewPayment(false)}
                className="bg-muted text-foreground hover:bg-muted/80 font-medium smooth-transition"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-3 text-sm font-medium smooth-transition border-b-2 ${
            activeTab === 'pending'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-3 text-sm font-medium smooth-transition border-b-2 ${
            activeTab === 'completed'
              ? 'border-primary text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Payments List */}
      {payments.length === 0 ? (
        <Card className="border border-border/40 p-12 text-center">
          <CreditCard className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="font-semibold text-foreground mb-1">No payments yet</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Create your first payment request to get started
          </p>
          <Button
            onClick={() => setShowNewPayment(true)}
            className="bg-primary text-white font-medium btn-smooth hover:bg-primary/90"
          >
            Create Payment
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {payments
            .filter((p) =>
              activeTab === 'pending' ? p.status !== 'completed' : p.status === 'completed'
            )
            .map((payment) => {
              const { total, approved } = getApprovals(payment.id);
              const group = groups.find((g) => g.id === payment.group_id);
              const isInitiator = payment.initiator_id === currentUser?.id;

              return (
                <Card
                  key={payment.id}
                  className="border border-border/40 p-6 smooth-transition hover:border-border/60"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">
                          {group?.name}
                        </h3>
                        {getStatusBadge(payment.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">₹{payment.total_amount}</span> • ₹{payment.amount_per_member.toFixed(2)}/person
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        ₹{payment.total_amount}
                      </p>
                    </div>
                  </div>

                  {/* Approvals Progress */}
                  {payment.status !== 'completed' && (
                    <div className="mb-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-muted-foreground">
                          Approvals: {approved}/{total}
                        </p>
                        <span className="text-xs font-medium text-muted-foreground">
                          {Math.round((approved / total) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-full smooth-transition"
                          style={{ width: `${(approved / total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Approvals List */}
                  <div className="space-y-1.5 mb-5">
                    {payment.approvals.map((approval, idx) => (
                      <div
                        key={approval.id}
                        className="flex items-center justify-between p-2 bg-muted/40 rounded-md text-xs smooth-transition"
                      >
                        <span className="text-foreground font-medium">
                          Member {idx + 1}
                        </span>
                        {approval.approved ? (
                          <div className="flex items-center gap-1.5 text-green-600 font-medium">
                            <Check className="w-3.5 h-3.5" />
                            <span>Approved</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-5 border-t border-border/30">
                    {!isInitiator && payment.status === 'pending' && (
                      <Button
                        onClick={() => handleApprovePayment(payment.id)}
                        disabled={loading}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium text-xs btn-smooth gap-2 h-9"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </Button>
                    )}
                    {isInitiator &&
                      payment.status === 'approved' &&
                      approved === total && (
                        <Button
                          onClick={() => handleCompletePayment(payment.id)}
                          disabled={loading}
                          className="flex-1 bg-primary text-white font-medium text-xs btn-smooth gap-2 h-9 hover:bg-primary/90"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Complete
                        </Button>
                      )}
                    {payment.status === 'completed' && (
                      <div className="flex-1 px-4 py-2 bg-green-500/10 rounded-md border border-green-500/20 flex items-center gap-2 text-green-700 dark:text-green-400 text-xs font-medium">
                        <Check className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
}
