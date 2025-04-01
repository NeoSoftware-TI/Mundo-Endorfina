import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center justify-center space-y-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
          Bem-vindo ao Mundo Endorfina
        </h1>
        <p className="max-w-2xl text-xl text-muted-foreground">
          Compartilhe suas corridas, acumule pontos e conquiste recompensas na melhor rede social para corredores
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-primary"
              >
                <path d="M18 20a6 6 0 0 0-12 0"></path>
                <circle cx="12" cy="10" r="4"></circle>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-medium">Conecte-se</h2>
            <p className="text-center text-muted-foreground">
              Participe de uma comunidade de corredores apaixonados e compartilhe suas jornadas
            </p>
          </div>

          <div className="flex flex-col items-center rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-primary"
              >
                <path d="M19 6v5a2 2 0 0 1-2 2h-2"></path>
                <path d="M4 14v5a2 2 0 0 0 2 2h12"></path>
                <path d="M7 14v7"></path>
                <path d="M9 8v8"></path>
                <path d="M11 2v20"></path>
                <path d="M13 8v8"></path>
                <path d="M15 14v7"></path>
                <path d="M17 6v5"></path>
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-medium">Acompanhe</h2>
            <p className="text-center text-muted-foreground">
              Monitore seu progresso, estabeleça metas e veja sua evolução ao longo do tempo
            </p>
          </div>

          <div className="flex flex-col items-center rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 rounded-full bg-primary/10 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-primary"
              >
                <path d="M6 10h.01"></path>
                <path d="M22 10h.01"></path>
                <path d="M14 5h.01"></path>
                <path d="M14 15h.01"></path>
                <path d="M18 13a6 6 0 0 0-12 0"></path>
                <path d="M9 13c-1.34 0-4.2.26-5 1.5a3 3 0 0 0 0 3C5 19 9 19 10.5 19"></path>
                <path d="M17.5 19c1.5 0 5.5 0 6.5-1.5a3 3 0 0 0 0-3c-.8-1.24-3.66-1.5-5-1.5"></path>
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-medium">Conquiste</h2>
            <p className="text-center text-muted-foreground">
              Acumule pontos e resgate cupons de produtos exclusivos para corredores
            </p>
          </div>
        </div>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
            <Link href="/registro">Cadastre-se</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

