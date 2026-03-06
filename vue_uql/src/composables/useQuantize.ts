import { ref } from 'vue'
import { createUql, getHistoryLimit } from '../api/quantize'
import type { QuantizeResponse, HistoryItem } from '../types'

export function useQuantize() {
  const result = ref<QuantizeResponse | null>(null)
  const history = ref<HistoryItem[]>([])
  const isLoading = ref(false)
  const isHistoryLoading = ref(false)
  const error = ref<string | null>(null)
  const quantize = async (url: string) => {
    isLoading.value = true
    error.value = null
    result.value = null

    try {
      result.value = await createUql(url)
      await fetchHistory()
    } catch (e: any) {
      if (e.response?.status === 400) {
        error.value = e.response.data?.message || 'Wrong URL'
      } else {
        error.value = 'Failed to quantize URL. Please try again.'
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchHistory = async (limit = 5) => {
    isHistoryLoading.value = true
    try {
      history.value = await getHistoryLimit(limit)
    } catch (e) {
      console.error('Failed to fetch history:', e)
    } finally {
      isHistoryLoading.value = false
    }
  }

  const copyToClipboard = async (url: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(url)
      return true
    } catch {
      return false
    }
  }

  return {
    result,
    history,
    isLoading,
    isHistoryLoading,
    error,
    quantize,
    fetchHistory,
    copyToClipboard,
  }
}