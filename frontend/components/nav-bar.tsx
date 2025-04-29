"use client";

import React, { useState, useEffect } from "react";
import { Bell, Menu, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { decodeJwt } from "jose";

type Decoded = { id: number; tipo: string; exp: number };

export function NavBar() {
  // 1. Primeiro todos os states
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<Decoded | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. Depois todos os hooks do Next.js
  const pathname = usePathname();
  const router = useRouter();

  // 3. Todos os effects juntos, em ordem consistente
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const publicRoutes = ['/', '/feedsemid', '/registrotemp'];

    if (publicRoutes.includes(pathname)) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    
    if (!token) {
      if (pathname !== "/login") {
        router.push("/login");
      }
      setLoading(false);
      return;
    }
    
    try {
      const decoded = decodeJwt(token) as Decoded;
      setSession(decoded);
      
      const pathId = pathname.split('/')[2];
      if (pathId && decoded.id !== Number(pathId)) {
        router.push(`/dashboard/${decoded.id}`);
      }
    } catch (err) {
      console.error("Token inválido:", err);
      localStorage.removeItem("token");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [isClient, pathname, router]);

  // Renderização condicional - mantida após todos os hooks
  if (!isClient) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <div className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-center">
          <span>Carregando…</span>
        </div>
      </header>
    );
  }

  if (session === null) {
    return null;
  }

  const { id: uid, tipo } = session;  

  const routes = [
    { href: `/dashboard/${uid}`,    label: "Dashboard",   roles: ["Cliente","Sub-Admin","Admin"] },
    { href: `/feed/${uid}`,         label: "Feed",        roles: ["Cliente","Sub-Admin","Admin"] },
    { href: `/atividades/${uid}`,   label: "Nova Atividade", roles: ["Cliente","Sub-Admin","Admin"] },
    { href: `/cupons/${uid}`,       label: "Cupons",      roles: ["Cliente","Sub-Admin","Admin"] },
    { href: `/sub_admin/${uid}`,    label: "Gerencia",   roles: ["Sub-Admin","Admin"] },
    { href: `/admin/${uid}`,        label: "Admin",       roles: ["Admin"] },
  ];

  const visibleRoutes = routes.filter(r => r.roles.includes(tipo));

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        {/* Menu mobile */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="md:hidden">
      <Menu className="h-6 w-6" />
      <span className="sr-only">Abrir menu</span>
    </Button>
  </SheetTrigger>
  <SheetContent side="left">
    <nav className="grid gap-6 text-lg font-medium">
      <Link href="/" onClick={() => setIsOpen(false)}>
        <span className="font-bold">Mundo Endorfina</span>
      </Link>
      {visibleRoutes.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setIsOpen(false)}
          className={cn(
            "flex items-center gap-2",
            pathname === href ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  </SheetContent>
</Sheet>

        {/* Logo */}
          <span className="font-bold flex items-center gap-2 text-lg font-semibold">Mundo Endorfina</span>

        {/* Menu desktop */}
        <nav className="mx-6 hidden items-center space-x-4 md:flex lg:space-x-6">
          {visibleRoutes.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Ícones à direita */}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Avatar" />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${uid}`}>
                  <User className="mr-2 h-4 w-4" /> Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/configuracoes/${uid}`}>Configurações</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button variant="ghost" onClick={handleLogout} className="h-[30px] w-[100px] bg-blue-200/40 text-red-500">
                  Sair
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
