"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { LogOut, User } from "lucide-react";

export function CitizenHeader() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/citizen/dashboard" },
    { name: "Tag Litter", href: "/citizen/tag-litter" },
    { name: "Map", href: "/citizen/map" },
    { name: "My Reports", href: "/citizen/my-reports" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-8 flex items-center">
          <Link href="/citizen/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <Icons.logo className="h-6 w-6 text-primary" />
            <span className="font-headline">EcoSort AI</span>
          </Link>
        </div>
        <nav className="hidden md:flex flex-1 items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href ? "text-foreground" : "text-foreground/60"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="sm"><User className="mr-2 h-4 w-4"/> Profile</Button>
            <Button variant="ghost" size="sm" asChild>
                <Link href="/"><LogOut className="mr-2 h-4 w-4"/> Logout</Link>
            </Button>
        </div>
      </div>
    </header>
  );
}
