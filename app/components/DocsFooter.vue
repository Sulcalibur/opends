<script setup lang="ts">
const { data: settingsData } = await useFetch('/api/settings/public').catch(() => ({ data: ref(null) }))
const settings = computed(() => settingsData.value?.settings || {})
const orgName = computed(() => settings.value.organization_name || 'Design System')
</script>

<template>
  <footer class="docs-footer">
    <div class="footer-left">
      <span>&copy; 2026 {{ orgName }}</span>
      <span class="footer-dot" />
      <span>Privacy</span>
      <span>Terms</span>
      <span>Contact</span>
    </div>
    <div class="footer-right">
      <span>Powered by</span>
      <span class="footer-brand">
        <svg width="14" height="14" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="28" height="28" rx="7" fill="var(--primary)" />
          <path d="M10 11.5C10 9.567 11.567 8 13.5 8h5C20.433 8 22 9.567 22 11.5v9c0 1.933-1.567 3.5-3.5 3.5h-5A3.5 3.5 0 0 1 10 20.5z" stroke="white" stroke-width="2.2"/>
          <circle cx="16" cy="16" r="1.7" fill="white"/>
        </svg>
        OpenDS
      </span>
      <span class="footer-version">v0.2.0</span>
    </div>
  </footer>
</template>

<style scoped>
.docs-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-top: 1px solid var(--border);
  font-size: 12.5px;
  color: var(--text-tertiary);
  background: var(--bg);
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.footer-dot {
  width: 3px;
  height: 3px;
  border-radius: 999px;
  background: var(--border-strong);
}

.footer-right {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: var(--text-secondary);
}

.footer-version {
  font-family: var(--f-mono);
  color: var(--text-tertiary);
}
</style>
