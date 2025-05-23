import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { NavBar } from '@/components/nav-bar'
import RankingMarquee from '@/components/ranking-marquee'
import { cn } from '@/lib/utils'
// importe o novo client component:
import ClientUnloadCleanup from '@/components/ClientUnloadCleanup'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mundo Endorfina - Rede Social de Corridas Virtuais',
  description: 'Compartilhe suas corridas, acumule pontos e resgate recompensas',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={cn(inter.className, 'min-h-screen bg-background')}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {/* Esse componente roda no cliente e limpa o localStorage no unload */}
          <ClientUnloadCleanup />
          <div className="flex min-h-screen flex-col">
            <NavBar />
            <RankingMarquee />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
