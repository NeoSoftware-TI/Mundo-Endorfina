"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, MoreHorizontal, Gift } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

// Dados simulados
const mockCoupons = Array.from({ length: 10 }).map((_, i) => ({
  id: `${i + 1}`,
  code: `ENDORFINA${i + 1}${i + 2}${i + 3}`,
  description: `Cupom para ${i % 3 === 0 ? "Tênis de corrida" : i % 3 === 1 ? "Camiseta esportiva" : "Acessórios fitness"}`,
  pointsRequired: (i + 1) * 100,
  discount: `${(i + 1) * 5}%`,
  expirationDate: new Date(2023, i % 12, 28).toISOString(),
  status: i % 4 === 0 ? "Inativo" : "Ativo",
  redemptions: i * 3,
}))

export default function CuponsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [coupons, setCoupons] = useState(mockCoupons)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentCoupon, setCurrentCoupon] = useState<(typeof mockCoupons)[0] | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    pointsRequired: "",
    discount: "",
    expirationDate: "",
    status: "Ativo",
  })

  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddCoupon = () => {
    const newCoupon = {
      id: `${coupons.length + 1}`,
      code: formData.code,
      description: formData.description,
      pointsRequired: Number.parseInt(formData.pointsRequired) || 0,
      discount: formData.discount,
      expirationDate: formData.expirationDate,
      status: formData.status,
      redemptions: 0,
    }

    setCoupons([...coupons, newCoupon])
    setIsAddDialogOpen(false)
    toast.success("Cupom adicionado com sucesso!")
    resetForm()
  }

  const handleEditCoupon = () => {
    if (!currentCoupon) return

    const updatedCoupons = coupons.map((coupon) =>
      coupon.id === currentCoupon.id
        ? {
            ...coupon,
            code: formData.code,
            description: formData.description,
            pointsRequired: Number.parseInt(formData.pointsRequired) || 0,
            discount: formData.discount,
            expirationDate: formData.expirationDate,
            status: formData.status,
          }
        : coupon,
    )

    setCoupons(updatedCoupons)
    setIsEditDialogOpen(false)
    toast.success("Cupom atualizado com sucesso!")
    resetForm()
  }

  const handleDeleteCoupon = (id: string) => {
    const updatedCoupons = coupons.filter((coupon) => coupon.id !== id)
    setCoupons(updatedCoupons)
    toast.success("Cupom removido com sucesso!")
  }

  const openEditDialog = (coupon: (typeof mockCoupons)[0]) => {
    setCurrentCoupon(coupon)
    setFormData({
      code: coupon.code,
      description: coupon.description,
      pointsRequired: coupon.pointsRequired.toString(),
      discount: coupon.discount,
      expirationDate: new Date(coupon.expirationDate).toISOString().split("T")[0],
      status: coupon.status,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      pointsRequired: "",
      discount: "",
      expirationDate: "",
      status: "Ativo",
    })
    setCurrentCoupon(null)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary">Gerenciar Cupons</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Cupom
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cupom</DialogTitle>
              <DialogDescription>Preencha os dados abaixo para adicionar um novo cupom.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Código
                </Label>
                <Input id="code" name="code" value={formData.code} onChange={handleChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descrição
                </Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pointsRequired" className="text-right">
                  Pontos
                </Label>
                <Input
                  id="pointsRequired"
                  name="pointsRequired"
                  type="number"
                  value={formData.pointsRequired}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discount" className="text-right">
                  Desconto
                </Label>
                <Input
                  id="discount"
                  name="discount"
                  placeholder="Ex: 10%"
                  value={formData.discount}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expirationDate" className="text-right">
                  Validade
                </Label>
                <Input
                  id="expirationDate"
                  name="expirationDate"
                  type="date"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddCoupon}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cupons</CardTitle>
          <CardDescription>Gerencie os cupons disponíveis para resgate na plataforma</CardDescription>
          <div className="flex items-center gap-2 mt-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por código ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Pontos</TableHead>
                <TableHead>Desconto</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resgates</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-primary" />
                      <span className="font-medium">{coupon.code}</span>
                    </div>
                  </TableCell>
                  <TableCell>{coupon.description}</TableCell>
                  <TableCell>{coupon.pointsRequired}</TableCell>
                  <TableCell>{coupon.discount}</TableCell>
                  <TableCell>{new Date(coupon.expirationDate).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={coupon.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      {coupon.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{coupon.redemptions}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(coupon)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteCoupon(coupon.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cupom</DialogTitle>
            <DialogDescription>Atualize os dados do cupom selecionado.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-code" className="text-right">
                Código
              </Label>
              <Input id="edit-code" name="code" value={formData.code} onChange={handleChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Descrição
              </Label>
              <textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-pointsRequired" className="text-right">
                Pontos
              </Label>
              <Input
                id="edit-pointsRequired"
                name="pointsRequired"
                type="number"
                value={formData.pointsRequired}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-discount" className="text-right">
                Desconto
              </Label>
              <Input
                id="edit-discount"
                name="discount"
                placeholder="Ex: 10%"
                value={formData.discount}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-expirationDate" className="text-right">
                Validade
              </Label>
              <Input
                id="edit-expirationDate"
                name="expirationDate"
                type="date"
                value={formData.expirationDate}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <select
                id="edit-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditCoupon}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

