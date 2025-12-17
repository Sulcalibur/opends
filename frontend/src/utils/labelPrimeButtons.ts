type IconMap = Record<string, string>

const ICON_LABELS: IconMap = {
  'pi-sync': 'Refresh',
  'pi-eye': 'View',
  'pi-trash': 'Delete'
}

function labelButton(el: HTMLElement) {
  const iconEl = el.querySelector('.p-button-icon') as HTMLElement | null
  if (!iconEl) return
  const cls = iconEl.className.split(/\s+/)
  const iconClass = cls.find(c => c.startsWith('pi-'))
  if (!iconClass) return
  const label = ICON_LABELS[iconClass]
  if (!label) return
  if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', label)
  if (!el.getAttribute('title')) el.setAttribute('title', label)
}

export function setupPrimeButtonLabels() {
  const process = (root: Document | HTMLElement) => {
    const buttons = root.querySelectorAll('button.p-button-icon-only')
    buttons.forEach(b => labelButton(b as HTMLElement))
  }
  process(document)
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      m.addedNodes.forEach(n => {
        if (n instanceof HTMLElement) process(n)
      })
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
}

