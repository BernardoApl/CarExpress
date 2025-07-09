"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Route, Calculator, Truck } from "lucide-react"
import { calcularDistancia, encontrarVeiculoMaisProximo, calcularCustos } from "@/utils/calculations"
import type { Local, Veiculo, Pedido, RotaCalculada } from "@/types"

interface RotaCalculatorProps {
  locais: Local[]
  veiculos: Veiculo[]
  pedidos: Pedido[]
  onExecutarEntrega: (veiculoIndex: number, novoLocal: string) => void
}

export function RotaCalculator({ locais, veiculos, pedidos, onExecutarEntrega }: RotaCalculatorProps) {
  const [pedidoSelecionado, setPedidoSelecionado] = useState("")
  const [rotaCalculada, setRotaCalculada] = useState<RotaCalculada | null>(null)
  const [erro, setErro] = useState("")

  const calcularRota = () => {
    setErro("")
    setRotaCalculada(null)

    if (!pedidoSelecionado) {
      setErro("Selecione um pedido para calcular a rota.")
      return
    }

    const pedido = pedidos.find((p) => p.identificador.toString() === pedidoSelecionado)
    if (!pedido) {
      setErro("Pedido não encontrado.")
      return
    }

    const localOrigem = locais.find((l) => l.nome === pedido.localOrigem)
    const localDestino = locais.find((l) => l.nome === pedido.localDestino)

    if (!localOrigem || !localDestino) {
      setErro("Local de origem ou destino não encontrado! Os locais do pedido foram removidos do sistema.")
      return
    }

    const resultado = encontrarVeiculoMaisProximo(veiculos, locais, localOrigem)
    if (!resultado) {
      setErro(
        'Nenhum veículo disponível encontrado! Todos os veículos estão ocupados ou não há veículos cadastrados com status "disponível".',
      )
      return
    }

    const { veiculo, distancia: distanciaAteOrigem } = resultado
    const distanciaEntrega = calcularDistancia(
      localOrigem.coordenadaX,
      localOrigem.coordenadaY,
      localDestino.coordenadaX,
      localDestino.coordenadaY,
    )
    const distanciaTotal = distanciaAteOrigem + distanciaEntrega
    const { custoDistancia, custoPeso, custoTotal } = calcularCustos(distanciaTotal, pedido.peso)

    setRotaCalculada({
      veiculo,
      pedido,
      localOrigem,
      localDestino,
      distanciaAteOrigem,
      distanciaEntrega,
      distanciaTotal,
      custoDistancia,
      custoPeso,
      custoTotal,
    })
  }

  const executarEntrega = () => {
    if (!rotaCalculada) return

    const veiculoIndex = veiculos.findIndex((v) => v.placa === rotaCalculada.veiculo.placa)
    if (veiculoIndex !== -1) {
      onExecutarEntrega(veiculoIndex, rotaCalculada.localDestino.nome)
      setRotaCalculada(null)
      setPedidoSelecionado("")
    }
  }

  if (pedidos.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Para calcular a rota, é necessário cadastrar pelo menos 1 pedido.</p>
        </CardContent>
      </Card>
    )
  }

  if (veiculos.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">
            Nenhum veículo cadastrado! É necessário ter pelo menos um veículo cadastrado para realizar entregas.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calcular Rota de Entrega
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Selecione o Pedido</label>
            <Select value={pedidoSelecionado} onValueChange={setPedidoSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um pedido" />
              </SelectTrigger>
              <SelectContent>
                {pedidos.map((pedido) => (
                  <SelectItem key={pedido.identificador} value={pedido.identificador.toString()}>
                    ID {pedido.identificador}: {pedido.localOrigem} → {pedido.localDestino} ({pedido.peso}kg)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {erro && <div className="text-red-600 text-sm">{erro}</div>}

          <Button onClick={calcularRota} className="w-full">
            <Route className="h-4 w-4 mr-2" />
            Calcular Rota
          </Button>
        </CardContent>
      </Card>

      {rotaCalculada && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Rota de Entrega Calculada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Informações do Veículo</h4>
                <p>
                  <strong>Placa:</strong> {rotaCalculada.veiculo.placa}
                </p>
                <p>
                  <strong>Modelo:</strong> {rotaCalculada.veiculo.modelo}
                </p>
                <p>
                  <strong>Local Atual:</strong> {rotaCalculada.veiculo.localAtual}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Informações do Pedido</h4>
                <p>
                  <strong>ID:</strong> {rotaCalculada.pedido.identificador}
                </p>
                <p>
                  <strong>Origem:</strong> {rotaCalculada.pedido.localOrigem}
                </p>
                <p>
                  <strong>Destino:</strong> {rotaCalculada.pedido.localDestino}
                </p>
                <p>
                  <strong>Peso:</strong> {rotaCalculada.pedido.peso}kg
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Distâncias</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <p>
                  <strong>Até origem:</strong> {rotaCalculada.distanciaAteOrigem.toFixed(2)} unidades
                </p>
                <p>
                  <strong>Da entrega:</strong> {rotaCalculada.distanciaEntrega.toFixed(2)} unidades
                </p>
                <p>
                  <strong>Total:</strong> {rotaCalculada.distanciaTotal.toFixed(2)} unidades
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Cálculo de Custos</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Custo por distância (R$ 50,00/100m):</strong> R$ {rotaCalculada.custoDistancia.toFixed(2)}
                </p>
                <p>
                  <strong>Custo por peso (R$ 25,00/10kg):</strong> R$ {rotaCalculada.custoPeso.toFixed(2)}
                </p>
                <p className="text-lg font-bold text-green-600">
                  <strong>CUSTO TOTAL: R$ {rotaCalculada.custoTotal.toFixed(2)}</strong>
                </p>
              </div>
            </div>

            <Button onClick={executarEntrega} className="w-full" size="lg">
              <Truck className="h-4 w-4 mr-2" />
              Executar Entrega
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
