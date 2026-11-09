import { useLayoutEffect, useState } from 'react'
import './PWAInstallPrompt.css'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt: () => Promise<void>
}

function isStandalone() {
  return typeof window !== 'undefined'
    && (window.matchMedia('(display-mode: standalone)').matches
      || (navigator as Navigator & { standalone?: boolean }).standalone === true)
}

function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(isStandalone)
  const [message, setMessage] = useState('')

  useLayoutEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }

    function handleAppInstalled() {
      setInstalled(true)
      setInstallPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  async function handleInstall() {
    if (!installPrompt) return

    setMessage('')

    try {
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      setInstallPrompt(null)

      if (outcome === 'accepted') {
        setInstalled(true)
      }
    }
    catch {
      setMessage('Não foi possível abrir a instalação. Tente novamente pelo menu do navegador.')
      setInstallPrompt(null)
    }
  }

  function closePrompt() {
    setInstallPrompt(null)
    setMessage('')
  }

  if (installed || (!installPrompt && !message)) return null

  return (
    <div className="PWAInstallPrompt-backdrop">
      <section
        className="PWAInstallPrompt-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="PWAInstallPrompt-title"
        aria-describedby="PWAInstallPrompt-description"
      >
        <button
          className="PWAInstallPrompt-close"
          type="button"
          aria-label="Fechar aviso de instalação"
          onClick={closePrompt}
        >
          ×
        </button>
        <h2 id="PWAInstallPrompt-title">Instale o app Natividade</h2>
        <p id="PWAInstallPrompt-description">
          O Natividade pode ser instalado no seu dispositivo e funciona melhor como app.
        </p>
        {message && <p className="PWAInstallPrompt-error" role="alert">{message}</p>}
        {installPrompt && (
          <button className="PWAInstallPrompt-install" type="button" onClick={handleInstall}>
            Instalar
          </button>
        )}
      </section>
    </div>
  )
}

export default PWAInstallPrompt
