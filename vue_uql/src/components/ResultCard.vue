<template>
  <Transition name="result">
    <div v-if="result" class="result-card">
      <div class="result-header">
        <div class="result-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Complete</span>
        </div>
        <button class="dismiss-btn" @click="$emit('dismiss')" title="Dismiss">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div class="short-url-row">
        <div class="short-url-display">
          <a :href="API_BASE_URL + '/' + result.uql"
            target="_blank"
            rel="noopener noreferrer"
            class="short-url-link">
          <span class="short-url-prefix">{{API_BASE_URL}}/</span>
          <span class="short-url-code">{{ result.uql }}</span>
        </a>
        </div>
        <button class="copy-btn" :class="{ copied }" @click="copyUrl">
          <svg v-if="!copied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{{ copied ? 'Copied' : 'Copy' }}</span>
        </button>
      </div>
      <div v-if="result.meta" class="og-preview">
        <div class="og-image-wrapper" v-if="result.meta.image">
          <img
            :src="result.meta.image"
            :alt="result.meta.title || 'Preview'"
            class="og-image"
            @error="handleImageError"
          />
          <div class="og-image-overlay"></div>
        </div>
        <div class="og-info">
          <h3 class="og-title" v-if="result.meta.title">{{ result.meta.title }}</h3>
          <p class="og-description" v-if="result.meta.description">{{ truncate(result.meta.description, 150) }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { API_BASE_URL } from '@/constants';
import type { QuantizeResponse } from '../types'

export interface QuantizeResult extends QuantizeResponse {}

const props = defineProps<{
  result: QuantizeResult | null
}>()

defineEmits<{
  dismiss: []
}>()

const copied = ref(false)

async function copyUrl() {
  if (!props.result) return
  try {
    await navigator.clipboard.writeText(props.result.shortUrl)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = props.result.shortUrl
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str
  return str.slice(0, max) + '...'
}

function handleImageError(e: Event) {
  const el = e.target as HTMLImageElement
  if (el.parentElement) el.parentElement.style.display = 'none'
}
</script>

<style scoped>
.result-card {
  width: 100%;
  max-width: 720px;
  margin: 32px auto 0;
  background: var(--bg-surface);
  border: 1px solid var(--border-glow);
  border-radius: var(--radius-lg);
  overflow: hidden;
  animation: fadeInScale 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  box-shadow: 0 0 30px rgba(57, 255, 20, 0.08), 0 8px 32px rgba(0, 0, 0, 0.3);
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-subtle);
}

.result-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--accent-glow);
  font-family: var(--font-mono);
}

.dismiss-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.dismiss-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.short-url-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: rgba(57, 255, 20, 0.03);
}

.short-url-display {
  font-family: var(--font-mono);
  font-size: 22px;
  font-weight: 600;
}

.short-url-prefix {
  color: var(--text-muted);
}

.short-url-code {
  color: var(--accent-glow);
  text-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--border-glow);
  border-radius: 8px;
  background: rgba(57, 255, 20, 0.08);
  color: var(--accent-glow);
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-mono);
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: rgba(57, 255, 20, 0.15);
}

.copy-btn.copied {
  border-color: rgba(0, 229, 255, 0.3);
  color: var(--accent-cyan);
  background: rgba(0, 229, 255, 0.08);
}

.og-preview {
  border-top: 1px solid var(--border-subtle);
}

.og-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.og-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.og-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--bg-surface) 0%, transparent 50%);
}

.og-info {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.og-site-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.og-favicon {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.og-site-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: var(--font-mono);
}

.og-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  margin: 0;
}

.og-description {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}

.og-url-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  color: var(--text-muted);
}

.og-url {
  font-size: 12px;
  font-family: var(--font-mono);
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.og-url:hover {
  color: var(--accent-glow);
}

.result-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.result-leave-active {
  transition: all 0.3s ease-in;
}

.result-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.97);
}

.result-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

@media (max-width: 640px) {
  .result-card {
    margin: 24px 8px 0;
  }

  .short-url-display {
    font-size: 18px;
  }

  .og-image-wrapper {
    height: 150px;
  }
}
</style>
