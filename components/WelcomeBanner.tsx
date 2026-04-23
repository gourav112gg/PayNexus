'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Zap } from 'lucide-react';

interface WelcomeBannerProps {
  userName?: string;
}

export default function WelcomeBanner({ userName = 'User' }: WelcomeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-foreground">
            Welcome to SplitPay, {userName}!
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          You&apos;re all set to start splitting payments with your friends. Here&apos;s a quick overview:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold mt-0.5">•</span>
            <span className="text-muted-foreground"><strong>Create Groups:</strong> Add friends to group payments</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-secondary font-bold mt-0.5">•</span>
            <span className="text-muted-foreground"><strong>Smart Splitting:</strong> Amounts split equally</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent font-bold mt-0.5">•</span>
            <span className="text-muted-foreground"><strong>Easy Approval:</strong> QR codes & phone numbers</span>
          </li>
        </ul>
      </div>
      <Button
        onClick={() => setDismissed(true)}
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
}
