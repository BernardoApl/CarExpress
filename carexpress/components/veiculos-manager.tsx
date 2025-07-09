"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Plus, Car } from "lucide-react"
import type { Veiculo, Local } from "@/types"

interface VeiculosManagerProps {
  veiculos: Veiculo[]
  locais: Local[]
  onAdicionarVeiculo: (veiculo: Veiculo) => void
  onAtualizarVeiculo: (index: number, veiculo: Veiculo) => void
  onRemoverVeiculo: (index: number) => void
}

export function VeiculosManager({
  veiculos,
  locais,
  onAdicionarVeiculo,
  onAtualizarVeiculo,
  onRemoverVeiculo,
}: VeiculosManagerProps) {
  const [novoVeiculo, setNovoVeiculo] = useState<Veiculo>({
    placa: "",
    modelo: "",
    status: "disponivel",
    localAtual: "",
  })
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null)
  const [erro, setErro] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")

    try {
      if (editandoIndex !== null) {
        onAtualizarVeiculo(editandoIndex, novoVeiculo)
        setEditandoIndex(null)
      } else {
        onAdicionarVeiculo(novoVeiculo)
      }
      setNovoVeiculo({ placa: "", modelo: "", status: "disponivel", localAtual: "" })
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro desconhecido")
    }
  }

  const iniciarEdicao = (index: number) => {
    setNovoVeiculo(veiculos[index])
    setEditandoIndex(index)
  }

  const cancelarEdicao = () => {
    setNovoVeiculo({ placa: "", modelo: "", status: "disponivel", localAtual: "" })
    setEditandoIndex(null)
    setErro("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editandoIndex !== null ? "Editar Veículo" : "Cadastrar Novo Veículo"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="placa">Placa</Label>
              <Input
                id="placa"
                value={novoVeiculo.placa}
                onChange={(e) => setNovoVeiculo({ ...novoVeiculo, placa: e.target.value })}
                placeholder="ABC-1234"
                required
              />
            </div>
            <div>
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                value={novoVeiculo.modelo}
                onChange={(e) => setNovoVeiculo({ ...novoVeiculo, modelo: e.target.value })}
                placeholder="Ex: Fiat Uno"
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={novoVeiculo.status}
                onValueChange={(value: "disponivel" | "ocupado") => setNovoVeiculo({ ...novoVeiculo, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="ocupado">Ocupado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="localAtual">Local Atual</Label>
              <Select
                value={novoVeiculo.localAtual}
                onValueChange={(value) => setNovoVeiculo({ ...novoVeiculo, localAtual: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um local" />
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
            <Car className="h-5 w-5" />
            Veículos Cadastrados ({veiculos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {veiculos.length === 0 ? (
            <p className="text-gray-500">Nenhum veículo cadastrado.</p>
          ) : (
            <div className="space-y-2">
              {veiculos.map((veiculo, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <strong>{veiculo.placa}</strong> - {veiculo.modelo}
                    <p className="text-sm text-gray-600">
                      Status:{" "}
                      <span className={veiculo.status === "disponivel" ? "text-green-600" : "text-red-600"}>
                        {veiculo.status}
                      </span>{" "}
                      | Local: {veiculo.localAtual}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => iniciarEdicao(index)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onRemoverVeiculo(index)}>
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
