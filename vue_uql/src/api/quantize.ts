import { API_BASE_URL } from '../constants';
import axios from 'axios';
import type { QuantizeResponse, HistoryItem } from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

export const createUql = async (url: string): Promise<QuantizeResponse> => {
  const { data } = await api.post('/v1.0/quantize', { url })
  return data
}

export const getAllLinks = async (): Promise<HistoryItem[]> => {
  const { data } = await api.get('/v1.0/quantize')
  return data
}

export const getLinkByUql = async (uql: string): Promise<QuantizeResponse> => {
  const { data } = await api.get(`/v1.0/quantize/${uql}`)
  return data
}

export const getHistory = async (): Promise<HistoryItem[]> => {
  const { data } = await api.get('/v1.0/history')
  return data
}

export const getHistoryLimit = async (limit: number): Promise<HistoryItem[]> => {
  const { data } = await api.get(`/v1.0/history/${limit}`)
  return data
}