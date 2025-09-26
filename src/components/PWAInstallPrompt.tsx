'use client'

import { useEffect, useState } from 'react'
import { X, Download, Smartphone } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Detectar iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Detectar se já está instalado (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true
    setIsStandalone(standalone)

    // Listener para o evento beforeinstallprompt (Chrome/Edge)
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Mostrar prompt após 3 segundos se não estiver instalado
      setTimeout(() => {
        if (!standalone) {
          setShowPrompt(true)
        }
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Para iOS, mostrar instruções após 5 segundos se não estiver instalado
    if (iOS && !standalone) {
      setTimeout(() => {
        setShowPrompt(true)
      }, 5000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setShowPrompt(false)
      }
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Não mostrar novamente por 24 horas
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
  }

  // Não mostrar se já está instalado ou foi dispensado recentemente
  if (isStandalone || !showPrompt) {
    return null
  }

  // Verificar se foi dispensado nas últimas 24 horas
  const dismissed = localStorage.getItem('pwa-prompt-dismissed')
  if (dismissed && Date.now() - parseInt(dismissed) < 24 * 60 * 60 * 1000) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm mx-auto">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#C02C33] rounded-xl flex items-center justify-center flex-shrink-0">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/b926537c-4ac1-40b9-90f2-a4a516b8859a.png" 
                alt="Wippel Logo" 
                className="w-8 h-8" 
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                Instalar Wippel App
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Acesso rápido e offline
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isIOS ? (
          // Instruções para iOS (Safari)
          <div className="space-y-3">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Para instalar no seu iPhone/iPad:
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span className="text-gray-700 dark:text-gray-300">Toque no botão de compartilhar</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span className="text-gray-700 dark:text-gray-300">Selecione "Adicionar à Tela de Início"</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span className="text-gray-700 dark:text-gray-300">Confirme tocando em "Adicionar"</span>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Entendi
            </button>
          </div>
        ) : (
          // Botão de instalação para Chrome/Edge
          <div className="space-y-3">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Instale o app para acesso rápido e funcionalidade offline
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-[#C02C33] text-white py-2 rounded-xl text-sm font-medium hover:bg-[#A02329] transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Instalar</span>
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 text-sm hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Agora não
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}