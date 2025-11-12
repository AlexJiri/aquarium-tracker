"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Droplets, 
  Activity, 
  Lightbulb, 
  Image, 
  Settings,
  Fish
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthButton } from "@/components/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/planner", label: "Planner", icon: Calendar },
  { href: "/fertilization", label: "Fertilization", icon: Droplets },
  { href: "/measurements", label: "Measurements", icon: Activity },
  { href: "/lighting", label: "Lighting", icon: Lightbulb },
  { href: "/photos", label: "Photos", icon: Image },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
          <Fish className="h-6 w-6" />
          <span className="font-bold">Aquarium Tracker</span>
        </Link>
        <div className="flex flex-1 items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <AuthButton />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

