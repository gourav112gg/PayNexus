'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { QrCode, Copy, Download, Smartphone } from 'lucide-react';
import QRCode from 'qrcode';

export default function QRCodePage() {
  const { currentUser, wallet_balance } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'qr' | 'manual'>('qr');
  const [manualPayment, setManualPayment] = useState({
    phone: '',
    amount: '',
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, [currentUser]);

  const generateQRCode = async () => {
    if (!currentUser || !canvasRef.current) return;

    const qrData = JSON.stringify({
      phone: currentUser.phone || 'N/A',
      account_id: currentUser.id,
      name: currentUser.name,
    });

    try {
      await QRCode.toCanvas(canvasRef.current, qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrGenerated(true);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    }
  };

  const handleCopyPhone = () => {
    if (currentUser?.phone) {
      navigator.clipboard.writeText(currentUser.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.href = canvasRef.current.toDataURL();
      link.download = `${currentUser?.name}-qr-code.png`;
      link.click();
    }
  };

  const handleManualPayment = () => {
    if (manualPayment.phone && manualPayment.amount) {
      console.log('Processing payment to:', manualPayment.phone);
      alert(
        `Payment initiated: ₹${manualPayment.amount} to ${manualPayment.phone}`
      );
      setManualPayment({ phone: '', amount: '' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1 text-foreground">Payment Methods</h1>
        <p className="text-sm text-muted-foreground">
          Send and receive payments using QR codes or phone numbers
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* QR Code Section */}
        <Card className="border border-border/40 p-8 smooth-transition hover:border-border/60">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-primary/10 rounded-md">
              <QrCode className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-semibold text-foreground">Your QR Code</h2>
          </div>

          <p className="text-xs text-muted-foreground mb-6">
            Share your QR code with friends to receive payments
          </p>

          {/* QR Canvas */}
          <div className="mb-6 flex justify-center p-6 bg-muted rounded-md border border-border/40">
            <canvas
              ref={canvasRef}
              style={{ display: qrGenerated ? 'block' : 'none' }}
            />
          </div>

          {/* Account Details */}
          <div className="space-y-3 mb-6 pb-6 border-b border-border/30">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Account Name
              </p>
              <p className="font-semibold text-foreground text-sm">{currentUser?.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Phone Number
              </p>
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm text-foreground">
                  {currentUser?.phone || '•••••••••••'}
                </p>
                <Button
                  onClick={handleCopyPhone}
                  className="text-muted-foreground hover:text-primary h-auto px-2 py-1.5 smooth-transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Account ID
              </p>
              <p className="font-mono text-xs text-muted-foreground">{currentUser?.id}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadQR}
              className="flex-1 gap-2 bg-primary text-white font-medium btn-smooth hover:bg-primary/90 h-9"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </Button>
            <Button 
              onClick={generateQRCode} 
              className="bg-muted text-foreground hover:bg-muted/80 font-medium smooth-transition h-9 px-4"
            >
              Refresh
            </Button>
          </div>
        </Card>

        {/* Payment Options */}
        <div className="space-y-6">
          {/* Toggle */}
          <Card className="border border-border/40 p-6">
            <h2 className="font-semibold text-foreground mb-4">Send Payment</h2>
            <div className="flex gap-2 mb-6">
              <Button
                onClick={() => setPaymentMode('qr')}
                className={`flex-1 gap-2 text-xs font-medium smooth-transition h-9 ${
                  paymentMode === 'qr'
                    ? 'bg-primary text-white'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                QR Scan
              </Button>
              <Button
                onClick={() => setPaymentMode('manual')}
                className={`flex-1 gap-2 text-xs font-medium smooth-transition h-9 ${
                  paymentMode === 'manual'
                    ? 'bg-primary text-white'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Phone
              </Button>
            </div>

            {/* QR Scanner */}
            {paymentMode === 'qr' && (
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center border border-border/40">
                  <div className="text-center">
                    <QrCode className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-40" />
                    <p className="text-xs text-muted-foreground">
                      Camera would open here
                    </p>
                  </div>
                </div>
                <Button disabled className="w-full h-9 font-medium text-sm">
                  Enable Camera
                </Button>
              </div>
            )}

            {/* Manual Payment */}
            {paymentMode === 'manual' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Recipient Phone
                  </label>
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={manualPayment.phone}
                    onChange={(e) =>
                      setManualPayment({
                        ...manualPayment,
                        phone: e.target.value,
                      })
                    }
                    className="input-minimal text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Amount
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={manualPayment.amount}
                    onChange={(e) =>
                      setManualPayment({
                        ...manualPayment,
                        amount: e.target.value,
                      })
                    }
                    className="input-minimal text-sm"
                  />
                </div>
                <div className="p-3 bg-muted rounded-md border border-border/40">
                  <p className="text-xs text-muted-foreground mb-1">
                    Available Balance
                  </p>
                  <p className="text-lg font-semibold text-primary">
                    ₹{wallet_balance.toFixed(2)}
                  </p>
                </div>
                <Button
                  onClick={handleManualPayment}
                  className="w-full bg-primary text-white font-medium btn-smooth hover:bg-primary/90 h-10"
                  disabled={
                    !manualPayment.phone ||
                    !manualPayment.amount ||
                    parseFloat(manualPayment.amount) > wallet_balance
                  }
                >
                  Send Payment
                </Button>
              </div>
            )}
          </Card>

          {/* Info Card */}
          <Card className="border border-border/40 p-4">
            <p className="text-xs font-semibold text-foreground mb-3">Quick Tips</p>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Share your QR code to receive payments</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Use phone number for direct transfers</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Money splits equally among group members</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
