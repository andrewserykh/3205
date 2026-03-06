<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo-group">
        <div class="atom-icon">
          <div class="atom-core"></div>
          <div class="atom-ring ring-1"></div>
          <div class="atom-ring ring-2"></div>
          <div class="atom-ring ring-3"></div>
        </div>
        <div class="logo-text">
          <span class="logo-name">URL Quantizer</span>
          <span class="logo-tag">UQL</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-header {
  position: relative;
  z-index: 10;
  padding: 24px 32px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 900px;
  margin: 0 auto;
}

.logo-group {
  display: flex;
  align-items: center;
  gap: 14px;
}

.atom-icon {
  width: 36px;
  height: 36px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.atom-core {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-glow);
  box-shadow: 0 0 12px var(--accent-glow), 0 0 24px rgba(57, 255, 20, 0.3);
  position: absolute;
}

.atom-ring {
  position: absolute;
  border: 1px solid;
  border-radius: 50%;
  animation: atomOrbit linear infinite;
}

.ring-1 {
  width: 28px;
  height: 10px;
  border-color: rgba(57, 255, 20, 0.5);
  animation-duration: 3s;
  transform: rotate(0deg);
}

.ring-2 {
  width: 28px;
  height: 10px;
  border-color: rgba(0, 229, 255, 0.35);
  animation-duration: 4s;
  transform: rotate(60deg);
}

.ring-3 {
  width: 28px;
  height: 10px;
  border-color: rgba(198, 255, 0, 0.25);
  animation-duration: 5s;
  transform: rotate(120deg);
}

.logo-text {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.logo-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.logo-tag {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--accent-glow);
  background: rgba(57, 255, 20, 0.1);
  border: 1px solid rgba(57, 255, 20, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.1em;
}


@media (max-width: 640px) {
  .app-header {
    padding: 16px 20px;
  }

  .header-tagline {
    display: none;
  }

  .logo-name {
    font-size: 16px;
  }
}
</style>
