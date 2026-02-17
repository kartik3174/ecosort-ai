"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export function OfficialHeader() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/official/overview" },
    { name: "Live Map", href: "/official/live-map" },
    { name: "Reports", href: "/official/reports" },
    { name: "Cleanup Management", href: "/official/cleanup" },
    { name: "Alerts", href: "/official/alerts" },
    { name: "Analytics", href: "/official/analytics" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-8 flex items-center">
          <Link href="/official/overview" className="flex items-center gap-2 font-bold text-lg">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-headline">EcoSort AI <span className="text-sm font-normal text-muted-foreground">Official</span></span>
          </Link>
        </div>
        <nav className="hidden lg:flex flex-1 items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname.startsWith(item.href) ? "text-foreground" : "text-foreground/60"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center ml-auto">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/"><LogOut className="mr-2 h-4 w-4"/> Logout</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
