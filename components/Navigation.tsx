"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Wallet, Users, CreditCard, QrCode, LogOut } from "lucide-react";

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, logout, wallet_balance } = useAppStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const navItems = [
    { href: "/dashboard", label: "Wallet", icon: Wallet },
    { href: "/dashboard/groups", label: "Groups", icon: Users },
    { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
    { href: "/dashboard/qr", label: "QR Code", icon: QrCode },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md pb-0 pt-2 border-b-0 smooth-transition shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-3 smooth-hover"
          >
            <div className="p-2 bg-primary rounded-full smooth-transition hover:scale-105 active:scale-95">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-[18px] text-foreground tracking-tight">
              PayNexus
            </span>
          </Link>

          {/* Nav Items */}
          <div className="hidden md:flex items-center gap-1 bg-card p-1.5 rounded-full">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`px-6 py-2.5 rounded-full flex items-center gap-2 smooth-transition text-[14px] font-bold tracking-[0.5px] ${
                  pathname === href
                    ? "bg-foreground text-background shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-2 sm:gap-5">
            <ThemeToggle />
            <div className="hidden sm:flex flex-col items-end text-right">
              <p className="text-[14px] font-bold text-foreground">
                ₹{wallet_balance.toFixed(2)}
              </p>
              <p className="text-[12px] font-medium text-muted-foreground">
                {currentUser?.name}
              </p>
            </div>
            <Button
              onClick={handleLogout}
              size="icon"
              variant="secondary"
              className="w-10 h-10 hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2 pb-4 overflow-x-auto scrollbar-hide pt-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-full flex items-center gap-2 flex-shrink-0 text-[14px] font-bold tracking-[0.5px] smooth-transition border border-transparent ${
                pathname === href
                  ? "bg-foreground text-background"
                  : "bg-card text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
