import { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, opts = {}) => {
    const id = Date.now() + Math.random()
    const toast = { id, message, ...opts }
    setToasts((t) => [...t, toast])
    if (!opts.noAutoClose) {
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id))
      }, opts.duration || 3000)
    }
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed right-5 top-5 z-50 flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="max-w-xs w-full bg-indigo-700 text-white px-4 py-2 rounded shadow-lg ring-1 ring-black/10 animate-fade-in"
            role="status"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

// small fade-in animation for Tailwind (fallback JS if Tailwind not configured)
// Add a tiny effect class via global style insertion if not present
try {
  const id = 'app-toast-styles'
  if (!document.getElementById(id)) {
    const style = document.createElement('style')
    style.id = id
    style.innerHTML = `
      @keyframes copilot-fade-in { from { transform: translateY(-8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      .animate-fade-in { animation: copilot-fade-in 220ms ease-out; }
    `
    document.head.appendChild(style)
  }
} catch (e) {
  // ignore SSR or env without document
}

export default ToastProvider
