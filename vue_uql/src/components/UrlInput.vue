<template>
  <div class="url-input-section">
    <div class="input-label-row">
      <span class="input-hint">All URLs are quantized with care, paste any URL to quantize it into its shortest form</span>
    </div>

    <div class="input-wrapper" :class="{ focused: isFocused, loading: isLoading }">
      <div class="input-glow"></div>
      <div class="input-inner">
        <div class="protocol-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>
        <textarea
          id="url-input"
          ref="inputRef"
          v-model="url"
          placeholder="https://example.com/your/really-long-url-that-needs-quantizing..."
          class="url-textarea"
          :disabled="isLoading"
          rows="3"
          @focus="isFocused = true"
          @blur="isFocused = false"
          @keydown.enter.exact.prevent="handleQuantize"
          @keydown.meta.enter.prevent="handleQuantize"
          @keydown.shift.enter.exact="() => {}"
        />
      </div>
    </div>

    <div class="action-row">
      <button
        class="quantize-btn"
        :class="{ loading: isLoading, disabled: !isValidUrl }"
        :disabled="isLoading || !isValidUrl"
        @click="handleQuantize"
      >
        <span v-if="isLoading" class="btn-loading">
          <span class="spinner"></span>
          <span>Initiating fission...</span>
        </span>
        <span v-else class="btn-content">
          <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
          </svg>
          <span>Quantize</span>
        </span>
      </button>
    </div>

    <p v-if="error" class="error-message">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  quantize: [url: string]
}>()

const props = defineProps<{
  isLoading: boolean
  error: string | null
}>()

const url = ref('')
const isFocused = ref(false)
const inputRef = ref<HTMLTextAreaElement | null>(null)

const isValidUrl = computed(() => {
  if (!url.value.trim()) return false
  try {
    new URL(url.value.trim())
    return true
  } catch {
    return false
  }
})

function handleQuantize() {
  if (url.value.trim() && !props.isLoading) {
    emit('quantize', url.value.trim())
  }
}


function clearInput() {
  url.value = ''
  inputRef.value?.focus()
}

defineExpose({ clearInput })
</script>

<style scoped>
.url-input-section {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
}

.input-label-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 4px;
}
.input-hint {
  font-size: 12px;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.input-wrapper {
  position: relative;
  border-radius: var(--radius-lg);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-glow {
  position: absolute;
  inset: -2px;
  border-radius: calc(var(--radius-lg) + 2px);
  background: linear-gradient(135deg, rgba(57, 255, 20, 0.15), rgba(0, 229, 255, 0.1), rgba(198, 255, 0, 0.1));
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.input-wrapper.focused .input-glow {
  opacity: 1;
}

.input-wrapper.loading .input-glow {
  opacity: 1;
  animation: pulseGlow 1.5s ease-in-out infinite;
}

.input-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  gap: 16px;
  transition: all 0.3s ease;
}

.input-wrapper.focused .input-inner {
  border-color: var(--border-glow);
  background: var(--bg-elevated);
}

.protocol-badge {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(57, 255, 20, 0.08);
  color: var(--accent-glow);
  margin-top: 2px;
}

.url-textarea {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 18px;
  font-family: var(--font-mono);
  line-height: 1.6;
  resize: none;
  min-height: 80px;
}

.url-textarea::placeholder {
  color: var(--text-muted);
  font-size: 16px;
}

.url-textarea:disabled {
  opacity: 0.5;
}

.action-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  padding: 0 4px;
}

.quantize-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 36px;
  border: none;
  border-radius: var(--radius);
  background: linear-gradient(135deg, #39ff14, #2dd40f);
  color: #050807;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.2), 0 4px 16px rgba(0, 0, 0, 0.3);
}

.quantize-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(57, 255, 20, 0.35), 0 8px 24px rgba(0, 0, 0, 0.4);
}

.quantize-btn:active:not(:disabled) {
  transform: translateY(0);
}

.quantize-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantize-btn.loading {
  background: linear-gradient(135deg, rgba(57, 255, 20, 0.3), rgba(0, 229, 255, 0.2));
  color: var(--accent-glow);
  border: 1px solid var(--border-glow);
}

.btn-content,
.btn-loading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-icon {
  transition: transform 0.3s ease;
}

.quantize-btn:hover:not(:disabled) .btn-icon {
  transform: rotate(90deg);
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(57, 255, 20, 0.2);
  border-top-color: var(--accent-glow);
  border-radius: 50%;
  animation: atomOrbit 0.8s linear infinite;
}

.shortcut-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-muted);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 4px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 12px 16px;
  background: rgba(255, 82, 82, 0.08);
  border: 1px solid rgba(255, 82, 82, 0.2);
  border-radius: var(--radius);
  color: #ff5252;
  font-size: 13px;
  font-family: var(--font-mono);
  animation: fadeIn 0.3s ease-out;
}

@media (max-width: 640px) {
  .url-input-section {
    padding: 0 8px;
  }

  .input-label-row {
    flex-direction: column;
    gap: 4px;
  }

  .input-inner {
    padding: 16px;
  }

  .url-textarea {
    font-size: 16px;
  }

  .quantize-btn {
    padding: 12px 28px;
    font-size: 15px;
  }

  .shortcut-hint {
    display: none;
  }
}
</style>
