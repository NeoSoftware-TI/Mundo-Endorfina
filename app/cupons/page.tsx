import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const cupons = [
  {
    id: "1",
    titulo: "10% de desconto em tênis de corrida",
    marca: "Nike",
    descricao: "Válido para toda linha de tênis de corrida",
    pontos: 500,
    validade: "30/06/2023",
    disponivel: true,
  },
  {
    id: "2",
    titulo: "Camiseta técnica grátis",
    marca: "Adidas",
    descricao: "Na compra de qualquer produto acima de R$ 300",
    pontos: 750,
    validade: "15/07/2023",
    disponivel: true,
  },
  {
    id: "3",
    titulo: "Relógio esportivo com 30% OFF",
    marca: "Garmin",
    descricao: "Válido para os modelos Forerunner",
    pontos: 1200,
    validade: "31/07/2023",
    disponivel: true,
  },
  {
    id: "4",
    titulo: "Inscrição gratuita em corrida",
    marca: "Track&Field Run Series",
    descricao: "Válido para etapas em São Paulo",
    pontos: 1500,
    validade: "31/08/2023",
    disponivel: false,
  },
]

export default function CuponsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Cupons Disponíveis</h1>
        <p className="mt-2 text-muted-foreground">Troque seus pontos por cupons exclusivos</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cupons.map((cupom) => (
          <Card key={cupom.id} className={cupom.disponivel ? "" : "opacity-70"}>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle>{cupom.titulo}</CardTitle>
                <Badge variant={cupom.disponivel ? "default" : "secondary"}>
                  {cupom.disponivel ? "Disponível" : "Esgotado"}
                </Badge>
              </div>
              <CardDescription>{cupom.marca}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{cupom.descricao}</p>
              <p className="mt-2 text-sm text-muted-foreground">Válido até {cupom.validade}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="font-semibold text-primary">{cupom.pontos} pontos</div>
              <Button disabled={!cupom.disponivel}>{cupom.disponivel ? "Resgatar" : "Indisponível"}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

