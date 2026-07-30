// Global CmdK command palette state
const isCmdKOpen = ref(false)

let listenerRegistered = false

function registerGlobalListener() {
  if (listenerRegistered || typeof window === 'undefined') return
  listenerRegistered = true

  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      isCmdKOpen.value = !isCmdKOpen.value
    }
  })
}

export function useCmdK() {
  registerGlobalListener()

  function open() {
    isCmdKOpen.value = true
  }

  function close() {
    isCmdKOpen.value = false
  }

  function toggle() {
    isCmdKOpen.value = !isCmdKOpen.value
  }

  return {
    isCmdKOpen,
    open,
    close,
    toggle,
  }
}
