"use client"

import { useState, useEffect } from "react"
import type { Local, Veiculo, Pedido } from "@/types"

const STORAGE_KEYS = {
  locais: "carexpress-locais",
  veiculos: "carexpress-veiculos",
  pedidos: "carexpress-pedidos",
  proximoId: "carexpress-proximo-id",
}

export function useCarExpress() {
  const [locais, setLocais] = useState<Local[]>([])
  const [veiculos, setVeiculos] = useState<Veiculo[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [proximoIdPedido, setProximoIdPedido] = useState(1)

  // Carregar dados do localStorage
  useEffect(() => {
    const locaisData = localStorage.getItem(STORAGE_KEYS.locais)
    const veiculosData = localStorage.getItem(STORAGE_KEYS.veiculos)
    const pedidosData = localStorage.getItem(STORAGE_KEYS.pedidos)
    const proximoIdData = localStorage.getItem(STORAGE_KEYS.proximoId)

    if (locaisData) setLocais(JSON.parse(locaisData))
    if (veiculosData) setVeiculos(JSON.parse(veiculosData))
    if (pedidosData) setPedidos(JSON.parse(pedidosData))
    if (proximoIdData) setProximoIdPedido(JSON.parse(proximoIdData))
  }, [])

  // Salvar dados no localStorage
  const salvarDados = () => {
    localStorage.setItem(STORAGE_KEYS.locais, JSON.stringify(locais))
    localStorage.setItem(STORAGE_KEYS.veiculos, JSON.stringify(veiculos))
    localStorage.setItem(STORAGE_KEYS.pedidos, JSON.stringify(pedidos))
    localStorage.setItem(STORAGE_KEYS.proximoId, JSON.stringify(proximoIdPedido))
  }

  // CRUD Locais
  const adicionarLocal = (local: Local) => {
    if (locais.some((l) => l.nome === local.nome)) {
      throw new Error("Local já cadastrado! Um local com este nome já existe no sistema.")
    }
    const novosLocais = [...locais, local]
    setLocais(novosLocais)
    localStorage.setItem(STORAGE_KEYS.locais, JSON.stringify(novosLocais))
  }

  const atualizarLocal = (index: number, local: Local) => {
    const novosLocais = [...locais]
    novosLocais[index] = local
    setLocais(novosLocais)
    localStorage.setItem(STORAGE_KEYS.locais, JSON.stringify(novosLocais))
  }

  const removerLocal = (index: number) => {
    const novosLocais = locais.filter((_, i) => i !== index)
    setLocais(novosLocais)
    localStorage.setItem(STORAGE_KEYS.locais, JSON.stringify(novosLocais))
  }

  // CRUD Veículos
  const adicionarVeiculo = (veiculo: Veiculo) => {
    if (veiculos.some((v) => v.placa === veiculo.placa)) {
      throw new Error("Veículo já cadastrado! Um veículo com esta placa já existe no sistema.")
    }
    if (!locais.some((l) => l.nome === veiculo.localAtual)) {
      throw new Error("Local não encontrado! O local informado não foi cadastrado no sistema.")
    }
    const novosVeiculos = [...veiculos, veiculo]
    setVeiculos(novosVeiculos)
    localStorage.setItem(STORAGE_KEYS.veiculos, JSON.stringify(novosVeiculos))
  }

  const atualizarVeiculo = (index: number, veiculo: Veiculo) => {
    const novosVeiculos = [...veiculos]
    novosVeiculos[index] = veiculo
    setVeiculos(novosVeiculos)
    localStorage.setItem(STORAGE_KEYS.veiculos, JSON.stringify(novosVeiculos))
  }

  const removerVeiculo = (index: number) => {
    const novosVeiculos = veiculos.filter((_, i) => i !== index)
    setVeiculos(novosVeiculos)
    localStorage.setItem(STORAGE_KEYS.veiculos, JSON.stringify(novosVeiculos))
  }

  // CRUD Pedidos
  const adicionarPedido = (pedido: Omit<Pedido, "identificador">) => {
    if (!locais.some((l) => l.nome === pedido.localOrigem)) {
      throw new Error("Local de origem não encontrado! O local de origem informado não foi cadastrado no sistema.")
    }
    if (!locais.some((l) => l.nome === pedido.localDestino)) {
      throw new Error("Local de destino não encontrado! O local de destino informado não foi cadastrado no sistema.")
    }

    const novoPedido = { ...pedido, identificador: proximoIdPedido }
    const novosPedidos = [...pedidos, novoPedido]
    const novoProximoId = proximoIdPedido + 1

    setPedidos(novosPedidos)
    setProximoIdPedido(novoProximoId)
    localStorage.setItem(STORAGE_KEYS.pedidos, JSON.stringify(novosPedidos))
    localStorage.setItem(STORAGE_KEYS.proximoId, JSON.stringify(novoProximoId))

    return novoPedido
  }

  const atualizarPedido = (index: number, pedido: Pedido) => {
    const novosPedidos = [...pedidos]
    novosPedidos[index] = pedido
    setPedidos(novosPedidos)
    localStorage.setItem(STORAGE_KEYS.pedidos, JSON.stringify(novosPedidos))
  }

  const removerPedido = (index: number) => {
    const novosPedidos = pedidos.filter((_, i) => i !== index)
    setPedidos(novosPedidos)
    localStorage.setItem(STORAGE_KEYS.pedidos, JSON.stringify(novosPedidos))
  }

  return {
    locais,
    veiculos,
    pedidos,
    proximoIdPedido,
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
  }
}
