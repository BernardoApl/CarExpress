"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Edit, Plus } from "lucide-react"
import type { Local } from "@/types"

interface LocaisManagerProps {
  locais: Local[]
  onAdicionarLocal: (local: Local) => void
  onAtualizarLocal: (index: number, local: Local) => void
  onRemoverLocal: (index: number) => void
}

export function LocaisManager({ locais, onAdicionarLocal, onAtualizarLocal, onRemoverLocal }: LocaisManagerProps) {
  const [novoLocal, setNovoLocal] = useState<Local>({ nome: "", coordenadaX: 0, coordenadaY: 0 })
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null)
  const [erro, setErro] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")

    try {
      if (editandoIndex !== null) {
        onAtualizarLocal(editandoIndex, novoLocal)
        setEditandoIndex(null)
      } else {
        onAdicionarLocal(novoLocal)
      }
      setNovoLocal({ nome: "", coordenadaX: 0, coordenadaY: 0 })
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro desconhecido")
    }
  }

  const iniciarEdicao = (index: number) => {
    setNovoLocal(locais[index])
    setEditandoIndex(index)
  }

  const cancelarEdicao = () => {
    setNovoLocal({ nome: "", coordenadaX: 0, coordenadaY: 0 })
    setEditandoIndex(null)
    setErro("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editandoIndex !== null ? "Editar Local" : "Cadastrar Novo Local"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome do Local</Label>
              <Input
                id="nome"
                value={novoLocal.nome}
                onChange={(e) => setNovoLocal({ ...novoLocal, nome: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="coordenadaX">Coordenada X</Label>
                <Input
                  id="coordenadaX"
                  type="number"
                  step="0.01"
                  value={novoLocal.coordenadaX}
                  onChange={(e) => setNovoLocal({ ...novoLocal, coordenadaX: Number.parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="coordenadaY">Coordenada Y</Label>
                <Input
                  id="coordenadaY"
                  type="number"
                  step="0.01"
                  value={novoLocal.coordenadaY}
                  onChange={(e) => setNovoLocal({ ...novoLocal, coordenadaY: Number.parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
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
          <CardTitle>Locais Cadastrados ({locais.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {locais.length === 0 ? (
            <p className="text-gray-500">Nenhum local cadastrado.</p>
          ) : (
            <div className="space-y-2">
              {locais.map((local, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <strong>{local.nome}</strong>
                    <p className="text-sm text-gray-600">
                      Coordenadas: ({local.coordenadaX.toFixed(2)}, {local.coordenadaY.toFixed(2)})
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => iniciarEdicao(index)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onRemoverLocal(index)}>
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
