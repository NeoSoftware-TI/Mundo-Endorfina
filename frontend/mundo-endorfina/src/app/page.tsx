import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Mundo Endorfina</h1>
          <p className="text-xl text-foreground mb-6">
            Compartilhe suas corridas, ganhe pontos e troque por recompensas!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Link href="/registro">Registrar</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <div className="bg-card rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-primary mb-4">Compartilhe suas corridas</h2>
            <p className="text-foreground mb-4">
              Registre suas corridas, adicione fotos e compartilhe seu progresso com a comunidade.
            </p>
            <div className="rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=200&width=400"
                alt="Compartilhe suas corridas"
                width={400}
                height={200}
                className="w-full object-cover"
              />
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-secondary mb-4">Ganhe recompensas</h2>
            <p className="text-foreground mb-4">
              Acumule pontos com suas atividades e troque por cupons de produtos exclusivos.
            </p>
            <div className="rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=200&width=400"
                alt="Ganhe recompensas"
                width={400}
                height={200}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

