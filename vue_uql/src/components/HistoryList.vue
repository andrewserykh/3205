<template>
  <TransitionGroup name="list" tag="div" class="history-section" v-if="history.length > 0">
    <div key="header" class="history-header">
      <div class="history-title-row">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <h3 class="history-title">Recent quantanizations</h3>
      </div>
      <span class="history-count">{{ history.length }} of 5</span>
    </div>

    <div
      v-for="(item, index) in history"
      :key="item.uql"
      class="history-item"
      :style="{ animationDelay: `${index * 0.06}s` }"
    >
      <div class="history-item-left">
        <div class="history-favicon-wrapper">
          <div class="history-favicon-fallback">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
        </div>
        <div class="history-item-info">
          <span class="history-item-title">{{ item.meta?.title || extractDomain(item.url) }}</span>
          <span class="history-item-url">{{ truncateUrl(item.url) }}</span>
        </div>
      </div>
      <div class="history-item-right">
        <span class="history-short-url">
          <span class="history-short-prefix">{{API_BASE_URL}}/</span>{{ item.uql }}
        </span>
        <button class="history-copy-btn" @click="copyToClipboard(`${API_BASE_URL}/${item.uql}`)" :title="'Copy ' + `${API_BASE_URL}/${item.uql}`">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import type { HistoryItem } from '../types'
import { API_BASE_URL } from '../constants'

defineProps<{
  history: HistoryItem[]
}>()

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

function truncateUrl(url: string): string {
  try {
    const parsed = new URL(url)
    const path = parsed.pathname + parsed.search
    const domain = parsed.hostname
    if (path.length > 35) {
      return domain + path.slice(0, 32) + '...'
    }
    return domain + path
  } catch {
    return url.length > 50 ? url.slice(0, 47) + '...' : url
  }
}

async function copyToClipboard(shortUrl: string) {
  try {
    await navigator.clipboard.writeText(shortUrl)
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = shortUrl
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}
</script>

<style scoped>
.history-section {
  width: 100%;
  max-width: 720px;
  margin: 40px auto 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
  margin-bottom: 16px;
}

.history-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
}

.history-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0;
}

.history-count {
  font-size: 12px;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius);
  margin-bottom: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeIn 0.4s ease-out forwards;
  opacity: 0;
}

.history-item:hover {
  border-color: var(--border-glow);
  background: var(--bg-elevated);
  transform: translateX(4px);
}

.history-item-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.history-favicon-wrapper {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(57, 255, 20, 0.06);
  border: 1px solid var(--border-subtle);
}

.history-favicon {
  width: 18px;
  height: 18px;
  border-radius: 3px;
}

.history-favicon-fallback {
  color: var(--text-muted);
}

.history-item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.history-item-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-item-url {
  font-size: 11px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-item-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-left: 16px;
}

.history-short-url {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  color: var(--accent-glow);
}

.history-short-prefix {
  color: var(--text-muted);
  font-weight: 400;
}

.history-copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-copy-btn:hover {
  border-color: var(--border-glow);
  color: var(--accent-glow);
  background: rgba(57, 255, 20, 0.06);
}

/* List transitions */
.list-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-leave-active {
  transition: all 0.3s ease-in;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.list-move {
  transition: transform 0.3s ease;
}

@media (max-width: 640px) {
  .history-section {
    padding: 0 8px;
  }

  .history-item {
    padding: 12px 14px;
  }

  .history-item-right {
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }

  .history-short-url {
    font-size: 12px;
  }
}
</style>
