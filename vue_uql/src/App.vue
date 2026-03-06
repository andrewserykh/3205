<template>
  <div class="app-root">
    <ParticleBackground />

    <div class="app-content">
      <AppHeader />

      <main class="main-section">
        <div class="hero">
          <h1 class="hero-title">
            <span class="hero-line">Split your URL</span>
          </h1>
        </div>

        <UrlInput
          ref="urlInputRef"
          :is-loading="isLoading"
          :error="error"
          @quantize="handleQuantize"
        />

        <Transition name="fission-overlay">
          <div v-if="showFission" class="fission-overlay">
            <div class="fission-ring ring-1"></div>
            <div class="fission-ring ring-2"></div>
            <div class="fission-ring ring-3"></div>
            <div class="fission-core"></div>
          </div>
        </Transition>

        <ResultCard :result="result" @dismiss="clearResult" />

        <HistoryList :history="history" />

        <footer class="app-footer">
          <p class="footer-text">
            2026 Andrew Serykh. Telegram: @andrewserykh
          </p>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ParticleBackground from './components/ParticleBackground.vue'
import AppHeader from './components/AppHeader.vue'
import UrlInput from './components/UrlInput.vue'
import ResultCard from './components/ResultCard.vue'
import HistoryList from './components/HistoryList.vue'
import { useQuantize } from './composables/useQuantize'

const urlInputRef = ref<InstanceType<typeof UrlInput> | null>(null)
const showFission = ref(false)

const {
  result,
  history,
  isLoading,
  error,
  quantize,
  fetchHistory,
} = useQuantize()

const clearResult = () => {
  result.value = null
}

const triggerFission = () => {
  showFission.value = true
  setTimeout(() => { showFission.value = false }, 1200)
}

const handleQuantize = async (url: string) => {
  triggerFission()
  await quantize(url)

  if (result.value) {
    urlInputRef.value?.clearInput()
  }
}

onMounted(() => fetchHistory())
</script>

<style scoped>
.app-root {
  min-height: 100vh;
  position: relative;
}

.app-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24px 60px;
}

.hero {
  text-align: center;
  margin-bottom: 48px;
  margin-top: 60px;
  max-width: 600px;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin: 0 0 20px;
}
.hero-line {
  display: block;
  background: linear-gradient(135deg, var(--accent-glow) 0%, var(--accent-cyan) 50%, var(--accent-uranium) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 15px;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 480px;
  margin: 0 auto;
}

.fission-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  pointer-events: none;
}

.fission-core {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent-glow);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 40px var(--accent-glow), 0 0 80px rgba(57, 255, 20, 0.5);
  animation: fissionBurst 1.2s ease-out forwards;
}

.fission-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid;
  animation: fissionBurst 1.2s ease-out forwards;
}

.fission-ring.ring-1 {
  width: 60px;
  height: 60px;
  border-color: var(--accent-glow);
  animation-delay: 0s;
}

.fission-ring.ring-2 {
  width: 120px;
  height: 120px;
  border-color: var(--accent-cyan);
  animation-delay: 0.15s;
}

.fission-ring.ring-3 {
  width: 200px;
  height: 200px;
  border-color: var(--accent-uranium);
  animation-delay: 0.3s;
}

.fission-overlay-enter-active {
  transition: opacity 0.1s ease;
}

.fission-overlay-leave-active {
  transition: opacity 0.5s ease;
}

.fission-overlay-enter-from,
.fission-overlay-leave-to {
  opacity: 0;
}

.app-footer {
  margin-top: 60px;
  padding: 24px 0;
  text-align: center;
}

.footer-text {
  font-size: 12px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  opacity: 0.6;
}

@media (max-width: 640px) {
  .main-section {
    padding: 0 16px 40px;
  }

  .hero {
    margin-top: 32px;
    margin-bottom: 32px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 14px;
  }
}
</style>
