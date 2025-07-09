"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Car, Package, Route, Download, Upload, Truck } from "lucide-react"
import { useCarExpress } from "@/hooks/useCarExpress"
import { LocaisManager } from "@/components/locais-manager"
import { VeiculosManager } from "@/components/veiculos-manager"
import { PedidosManager } from "@/components/pedidos-manager"
import { RotaCalculator } from "@/components/rota-calculator"

export default function CarExpressApp() {
  const {
    locais,
    veiculos,
    pedidos,
    adicionarLocal,
    atualizarLocal,
    removerLocal,
    adicionarVeiculo,
    atualizarVeiculo,
    removerVeiculo,
    adicionarPedido,
    atualizarPedido,
    removerPedido,
    salvarDados,
  } = useCarExpress()

  const [mensagem, setMensagem] = useState("")

  const executarEntrega = (veiculoIndex: number, novoLocal: string) => {
    const novosVeiculos = [...veiculos]
    novosVeiculos[veiculoIndex] = {
      ...novosVeiculos[veiculoIndex],
      status: "disponivel",
      localAtual: novoLocal,
    }

    // Simular a atualização (em uma aplicação real, isso seria feito através do hook)
    localStorage.setItem("carexpress-veiculos", JSON.stringify(novosVeiculos))
    setMensagem(`Entrega finalizada com sucesso! Veículo ${veiculos[veiculoIndex].placa} agora está em ${novoLocal}`)

    // Recarregar a página para atualizar os dados
    window.location.reload()
  }

  const fazerBackup = () => {
    const dados = {
      locais,
      veiculos,
      pedidos,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `carexpress-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setMensagem("Backup realizado com sucesso!")
  }

  const restaurarDados = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const dados = JSON.parse(e.target?.result as string)

        if (dados.locais) localStorage.setItem("carexpress-locais", JSON.stringify(dados.locais))
        if (dados.veiculos) localStorage.setItem("carexpress-veiculos", JSON.stringify(dados.veiculos))
        if (dados.pedidos) localStorage.setItem("carexpress-pedidos", JSON.stringify(dados.pedidos))

        setMensagem("Dados restaurados com sucesso! Recarregue a página para ver as alterações.")
      } catch (error) {
        setMensagem("Erro ao restaurar dados. Verifique se o arquivo está correto.")
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Truck className="h-10 w-10 text-blue-600" />
            CarExpress
          </h1>
          <p className="text-xl text-gray-600">Sistema de Gerenciamento de Entregas</p>
        </div>

        {mensagem && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-center text-green-600 font-medium">{mensagem}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{locais.length}</p>
                  <p className="text-sm text-gray-600">Locais</p>
                </div>
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{veiculos.length}</p>
                  <p className="text-sm text-gray-600">Veículos</p>
                </div>
                <Car className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{pedidos.length}</p>
                  <p className="text-sm text-gray-600">Pedidos</p>
                </div>
                <Package className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{veiculos.filter((v) => v.status === "disponivel").length}</p>
                  <p className="text-sm text-gray-600">Disponíveis</p>
                </div>
                <Route className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="locais" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="locais" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Locais
            </TabsTrigger>
            <TabsTrigger value="veiculos" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              Veículos
            </TabsTrigger>
            <TabsTrigger value="pedidos" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="rotas" className="flex items-center gap-2">
              <Route className="h-4 w-4" />
              Rotas
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Backup
            </TabsTrigger>
            <TabsTrigger value="restore" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Restaurar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="locais">
            <LocaisManager
              locais={locais}
              onAdicionarLocal={adicionarLocal}
              onAtualizarLocal={atualizarLocal}
              onRemoverLocal={removerLocal}
            />
          </TabsContent>

          <TabsContent value="veiculos">
            <VeiculosManager
              veiculos={veiculos}
              locais={locais}
              onAdicionarVeiculo={adicionarVeiculo}
              onAtualizarVeiculo={atualizarVeiculo}
              onRemoverVeiculo={removerVeiculo}
            />
          </TabsContent>

          <TabsContent value="pedidos">
            <PedidosManager
              pedidos={pedidos}
              locais={locais}
              onAdicionarPedido={adicionarPedido}
              onAtualizarPedido={atualizarPedido}
              onRemoverPedido={removerPedido}
            />
          </TabsContent>

          <TabsContent value="rotas">
            <RotaCalculator locais={locais} veiculos={veiculos} pedidos={pedidos} onExecutarEntrega={executarEntrega} />
          </TabsContent>

          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Fazer Backup dos Dados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Faça o download de todos os seus dados em formato JSON para backup.
                </p>
                <Button onClick={fazerBackup} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Fazer Backup
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="restore">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Restaurar Dados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Selecione um arquivo de backup para restaurar seus dados.</p>
                <input
                  type="file"
                  accept=".json"
                  onChange={restaurarDados}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
