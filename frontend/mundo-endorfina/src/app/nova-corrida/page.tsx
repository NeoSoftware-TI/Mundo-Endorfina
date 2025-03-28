"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MapPin,
  Timer,
  TrendingUp,
  Upload,
  ImageIcon,
  Trash2,
  Plus,
  Heart,
  BarChart3,
  Droplets,
  Thermometer,
  Cloud,
} from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function NovaCorrida() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    distance: "",
    time: "",
    pace: "",
    content: "",
    // Novos campos para dados do smartwatch
    heartRate: "",
    calories: "",
    elevation: "",
    temperature: "",
    hydration: "",
    steps: "",
    weather: "",
    terrain: "Asfalto",
    mood: "Bom",
  })

  const [loading, setLoading] = useState(false)
  const [mainImages, setMainImages] = useState<File[]>([])
  const [watchImage, setWatchImage] = useState<File | null>(null)
  const [mainImagePreviews, setMainImagePreviews] = useState<string[]>([])
  const [watchImagePreview, setWatchImagePreview] = useState<string | null>(null)
  const [showAdvancedData, setShowAdvancedData] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file))

      setMainImages((prev) => [...prev, ...newFiles])
      setMainImagePreviews((prev) => [...prev, ...newPreviews])
    }
  }

  const handleRemoveMainImage = (index: number) => {
    setMainImages((prev) => prev.filter((_, i) => i !== index))
    setMainImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleWatchImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setWatchImage(file)
      setWatchImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validação básica
    if (!formData.distance || !formData.time || mainImages.length === 0) {
      toast.error("Por favor, preencha todos os campos obrigatórios e adicione pelo menos uma foto da corrida")
      setLoading(false)
      return
    }

    // Simulando envio para o backend
    setTimeout(() => {
      toast.success("Corrida registrada com sucesso!")
      router.push("/dashboard")
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="card-hover-effect">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl gradient-text">Nova Corrida</CardTitle>
          <CardDescription>Registre sua corrida e compartilhe com a comunidade</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
                <TabsTrigger value="advanced">Dados Avançados</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distance" className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      Distância (km)
                    </Label>
                    <Input
                      id="distance"
                      name="distance"
                      type="number"
                      step="0.01"
                      placeholder="5.0"
                      value={formData.distance}
                      onChange={handleChange}
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="flex items-center gap-1">
                      <Timer className="h-4 w-4 text-primary" />
                      Tempo (mm:ss)
                    </Label>
                    <Input
                      id="time"
                      name="time"
                      placeholder="25:00"
                      value={formData.time}
                      onChange={handleChange}
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pace" className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Ritmo (min/km)
                    </Label>
                    <Input
                      id="pace"
                      name="pace"
                      placeholder="5:00"
                      value={formData.pace}
                      onChange={handleChange}
                      className="transition-all focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="flex items-center gap-1">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Descrição
                  </Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Conte como foi sua corrida..."
                    rows={3}
                    value={formData.content}
                    onChange={handleChange}
                    className="transition-all focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Fotos da Corrida
                  </Label>

                  <div className="image-gallery">
                    {mainImagePreviews.map((preview, index) => (
                      <div key={index} className="image-gallery-item relative">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => handleRemoveMainImage(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}

                    {mainImagePreviews.length < 6 && (
                      <div
                        className="image-gallery-item flex items-center justify-center border-2 border-dashed border-muted-foreground/25 cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => document.getElementById("mainImage")?.click()}
                      >
                        <div className="text-center">
                          <Plus className="h-6 w-6 mx-auto text-muted-foreground" />
                          <span className="text-xs text-muted-foreground mt-1 block">Adicionar foto</span>
                          <Input
                            id="mainImage"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleMainImageChange}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">Adicione até 6 fotos da sua corrida</p>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-advanced" className="flex items-center gap-2 cursor-pointer">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    <span>Mostrar dados avançados do smartwatch</span>
                  </Label>
                  <Switch id="show-advanced" checked={showAdvancedData} onCheckedChange={setShowAdvancedData} />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="watchImage" className="flex items-center gap-1">
                      <Timer className="h-4 w-4 text-primary" />
                      Foto do Smartwatch
                    </Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-4 text-center">
                      {watchImagePreview ? (
                        <div className="relative aspect-video">
                          <img
                            src={watchImagePreview || "/placeholder.svg"}
                            alt="Preview do Smartwatch"
                            className="w-full h-full object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setWatchImage(null)
                              setWatchImagePreview(null)
                            }}
                          >
                            Remover
                          </Button>
                        </div>
                      ) : (
                        <div className="py-4">
                          <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            Clique para selecionar ou arraste uma imagem
                          </p>
                          <Input
                            id="watchImage"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleWatchImageChange}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("watchImage")?.click()}
                            className="mt-2 button-hover-effect"
                          >
                            Selecionar Imagem
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {showAdvancedData && (
                    <>
                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="heartRate" className="flex items-center gap-1">
                            <Heart className="h-4 w-4 text-primary" />
                            Frequência Cardíaca Média (bpm)
                          </Label>
                          <Input
                            id="heartRate"
                            name="heartRate"
                            type="number"
                            placeholder="150"
                            value={formData.heartRate}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="calories" className="flex items-center gap-1">
                            <BarChart3 className="h-4 w-4 text-primary" />
                            Calorias Queimadas
                          </Label>
                          <Input
                            id="calories"
                            name="calories"
                            type="number"
                            placeholder="350"
                            value={formData.calories}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="elevation" className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Elevação (m)
                          </Label>
                          <Input
                            id="elevation"
                            name="elevation"
                            type="number"
                            placeholder="120"
                            value={formData.elevation}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="temperature" className="flex items-center gap-1">
                            <Thermometer className="h-4 w-4 text-primary" />
                            Temperatura (°C)
                          </Label>
                          <Input
                            id="temperature"
                            name="temperature"
                            type="number"
                            placeholder="25"
                            value={formData.temperature}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="hydration" className="flex items-center gap-1">
                            <Droplets className="h-4 w-4 text-primary" />
                            Hidratação (ml)
                          </Label>
                          <Input
                            id="hydration"
                            name="hydration"
                            type="number"
                            placeholder="500"
                            value={formData.hydration}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="steps" className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-primary" />
                            Passos
                          </Label>
                          <Input
                            id="steps"
                            name="steps"
                            type="number"
                            placeholder="6500"
                            value={formData.steps}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="weather" className="flex items-center gap-1">
                            <Cloud className="h-4 w-4 text-primary" />
                            Clima
                          </Label>
                          <Input
                            id="weather"
                            name="weather"
                            placeholder="Ensolarado"
                            value={formData.weather}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="terrain" className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-primary" />
                            Terreno
                          </Label>
                          <select
                            id="terrain"
                            name="terrain"
                            value={formData.terrain}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="Asfalto">Asfalto</option>
                            <option value="Terra">Terra</option>
                            <option value="Grama">Grama</option>
                            <option value="Areia">Areia</option>
                            <option value="Trilha">Trilha</option>
                            <option value="Misto">Misto</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mood" className="flex items-center gap-1">
                            <Heart className="h-4 w-4 text-primary" />
                            Disposição
                          </Label>
                          <select
                            id="mood"
                            name="mood"
                            value={formData.mood}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="Excelente">Excelente</option>
                            <option value="Bom">Bom</option>
                            <option value="Regular">Regular</option>
                            <option value="Cansado">Cansado</option>
                            <option value="Exausto">Exausto</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <CardFooter className="px-0 pt-4">
              <Button type="submit" className="w-full bg-primary button-hover-effect" disabled={loading}>
                {loading ? "Registrando..." : "Registrar Corrida"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

