export interface Local {
  nome: string
  coordenadaX: number
  coordenadaY: number
}

export interface Veiculo {
  placa: string
  modelo: string
  status: "disponivel" | "ocupado"
  localAtual: string
}

export interface Pedido {
  identificador: number
  localOrigem: string
  localDestino: string
  peso: number
}

export interface RotaCalculada {
  veiculo: Veiculo
  pedido: Pedido
  localOrigem: Local
  localDestino: Local
  distanciaAteOrigem: number
  distanciaEntrega: number
  distanciaTotal: number
  custoDistancia: number
  custoPeso: number
  custoTotal: number
}
