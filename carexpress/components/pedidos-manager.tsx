"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Plus, Package } from "lucide-react"
import type { Pedido, Local } from "@/types"

interface PedidosManagerProps {
  pedidos: Pedido[]
  locais: Local[]
  onAdicionarPedido: (pedido: Omit<Pedido, "identificador">) => void
  onAtualizarPedido: (index: number, pedido: Pedido) => void
  onRemoverPedido: (index: number) => void
}

export function PedidosManager({
  pedidos,
  locais,
  onAdicionarPedido,
  onAtualizarPedido,
  onRemoverPedido,
}: PedidosManagerProps) {
  const [novoPedido, setNovoPedido] = useState<Omit<Pedido, "identificador">>({
    localOrigem: "",
    localDestino: "",
    peso: 0,
  })
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null)
  const [erro, setErro] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")

    try {
      if (editandoIndex !== null) {
        onAtualizarPedido(editandoIndex, { ...novoPedido, identificador: pedidos[editandoIndex].identificador })
        setEditandoIndex(null)
      } else {
        onAdicionarPedido(novoPedido)
      }
      setNovoPedido({ localOrigem: "", localDestino: "", peso: 0 })
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro desconhecido")
    }
  }

  const iniciarEdicao = (index: number) => {
    const pedido = pedidos[index]
    setNovoPedido({
      localOrigem: pedido.localOrigem,
      localDestino: pedido.localDestino,
      peso: pedido.peso,
    })
    setEditandoIndex(index)
  }

  const cancelarEdicao = () => {
    setNovoPedido({ localOrigem: "", localDestino: "", peso: 0 })
    setEditandoIndex(null)
    setErro("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editandoIndex !== null ? "Editar Pedido" : "Cadastrar Novo Pedido"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="localOrigem">Local de Origem</Label>
              <Select
                value={novoPedido.localOrigem}
                onValueChange={(value) => setNovoPedido({ ...novoPedido, localOrigem: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o local de origem" />
                </SelectTrigger>
                <SelectContent>
                  {locais.map((local) => (
                    <SelectItem key={local.nome} value={local.nome}>
                      {local.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="localDestino">Local de Destino</Label>
              <Select
                value={novoPedido.localDestino}
                onValueChange={(value) => setNovoPedido({ ...novoPedido, localDestino: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o local de destino" />
                </SelectTrigger>
                <SelectContent>
                  {locais.map((local) => (
                    <SelectItem key={local.nome} value={local.nome}>
                      {local.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.01"
                min="0"
                value={novoPedido.peso}
                onChange={(e) => setNovoPedido({ ...novoPedido, peso: Number.parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            {erro && <div className="text-red-600 text-sm">{erro}</div>}
            <div className="flex gap-2">
              <Button type="submit">{editandoIndex !== null ? "Atualizar" : "Cadastrar"}</Button>
              {editandoIndex !== null && (
                <Button type="button" variant="outline" onClick={cancelarEdicao}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Pedidos Cadastrados ({pedidos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pedidos.length === 0 ? (
            <p className="text-gray-500">Nenhum pedido cadastrado.</p>
          ) : (
            <div className="space-y-2">
              {pedidos.map((pedido, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <strong>ID: {pedido.identificador}</strong>
                    <p className="text-sm text-gray-600">
                      {pedido.localOrigem} → {pedido.localDestino} | Peso: {pedido.peso}kg
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => iniciarEdicao(index)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onRemoverPedido(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
