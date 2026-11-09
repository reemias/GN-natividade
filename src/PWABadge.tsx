import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import './PWABadge.css'

function PWABadge() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [registrationError, setRegistrationError] = useState('')
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      setRegistration(registration ?? null)
    },
    onRegisterError(error) {
      console.error('Falha ao registrar o service worker.', error)
      setRegistrationError('Não foi possível registrar o suporte offline neste navegador.')
    },
  })
  useEffect(() => {
    if (!registration) return
    const activeRegistration = registration

    function checkForUpdates() {
      if (!navigator.onLine) return
      void activeRegistration.update().catch((error: unknown) => {
        console.error('Falha ao verificar atualizações do app.', error)
      })
    }

    const intervalId = window.setInterval(checkForUpdates, 30 * 60 * 1000)
    window.addEventListener('focus', checkForUpdates)
    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener('focus', checkForUpdates)
    }
  }, [registration])

  function close() {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <div className="PWABadge" aria-live="polite">
      {registrationError && <p className="PWABadge-error" role="alert">{registrationError}</p>}
      { (offlineReady || needRefresh)
      && (
        <div className="PWABadge-toast" role="status" aria-labelledby="toast-message">
          <div className="PWABadge-message">
            { offlineReady
              ? <span id="toast-message">App pronto para funcionar offline.</span>
              : <span id="toast-message">Há uma nova versão do app disponível.</span>}
          </div>
          <div className="PWABadge-buttons">
            { needRefresh && <button className="PWABadge-toast-button" onClick={() => updateServiceWorker(true)}>Atualizar</button> }
            <button className="PWABadge-toast-button" onClick={() => close()}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PWABadge
