import type { Local, Veiculo } from "@/types"

export function calcularDistancia(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

export function encontrarVeiculoMaisProximo(
  veiculos: Veiculo[],
  locais: Local[],
  localOrigem: Local,
): { veiculo: Veiculo; distancia: number } | null {
  let veiculoMaisProximo: Veiculo | null = null
  let menorDistancia = Number.POSITIVE_INFINITY

  for (const veiculo of veiculos) {
    if (veiculo.status === "disponivel") {
      const localVeiculo = locais.find((l) => l.nome === veiculo.localAtual)
      if (localVeiculo) {
        const distancia = calcularDistancia(
          localVeiculo.coordenadaX,
          localVeiculo.coordenadaY,
          localOrigem.coordenadaX,
          localOrigem.coordenadaY,
        )
        if (distancia < menorDistancia) {
          menorDistancia = distancia
          veiculoMaisProximo = veiculo
        }
      }
    }
  }

  return veiculoMaisProximo ? { veiculo: veiculoMaisProximo, distancia: menorDistancia } : null
}

export function calcularCustos(distanciaTotal: number, peso: number) {
  // Custo por distância: R$ 50,00 a cada 100 metros
  const custoDistancia = (distanciaTotal / 100.0) * 50.0
  // Custo por peso: R$ 25,00 a cada 10kg
  const custoPeso = (peso / 10.0) * 25.0
  const custoTotal = custoDistancia + custoPeso

  return { custoDistancia, custoPeso, custoTotal }
}
