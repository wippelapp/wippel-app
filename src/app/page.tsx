'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  User, 
  Building2, 
  Calendar, 
  FileText, 
  Image, 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  Check, 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Upload,
  Clock,
  DollarSign,
  Eye,
  LogOut,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Calculator,
  Paperclip,
  Home,
  ClipboardList,
  Receipt,
  Users,
  FileCheck
} from 'lucide-react'

// Tipos de dados
interface Client {
  id: string
  username: string
  password: string
  approved: boolean
  createdAt: string
}

interface DiaryEntry {
  id: string
  clientId: string
  date: string
  description: string
  image: string
  createdAt: string
  createdBy: 'engineer' | 'client'
}

interface ScheduleItem {
  id: string
  clientId: string
  task: string
  startDate: string
  endDate: string
  progress: number
  status: 'pending' | 'in-progress' | 'completed'
}

interface Invoice {
  id: string
  clientId: string
  number: string
  description: string
  attachment: string
  photo: string
  issueDate: string
  status: 'pending' | 'paid' | 'overdue'
}

interface FinancialEntry {
  id: string
  clientId: string
  type: 'income' | 'expense'
  date: string
  description: string
  amount: number
}

interface Collaborator {
  id: string
  clientId: string
  name: string
  role: string
  startDate: string
  endDate: string
}

interface Voucher {
  id: string
  clientId: string
  title: string
  attachment: string
  photo: string
  createdAt: string
}

// Componente principal
export default function WippelApp() {
  // Estados principais
  const [darkMode, setDarkMode] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ type: 'client' | 'engineer', id: string } | null>(null)
  const [currentView, setCurrentView] = useState<'login' | 'pending' | 'dashboard' | 'client-detail' | 'create-client'>('login')
  const [selectedClientId, setSelectedClientId] = useState<string>('')
  const [loginError, setLoginError] = useState<string>('')
  
  // Estados de dados
  const [clients, setClients] = useState<Client[]>([])
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>([])
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  
  // Estados de formulários
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' })
  const [clientForm, setClientForm] = useState({ username: '', password: '' })
  const [activeTab, setActiveTab] = useState<'diary' | 'schedule' | 'financial' | 'invoices' | 'collaborators' | 'vouchers'>('diary')
  const [financialTab, setFinancialTab] = useState<'entries' | 'summary'>('entries')
  
  // Estados de modais e formulários
  const [showDiaryForm, setShowDiaryForm] = useState(false)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)
  const [showFinancialForm, setShowFinancialForm] = useState(false)
  const [showCollaboratorForm, setShowCollaboratorForm] = useState(false)
  const [showVoucherForm, setShowVoucherForm] = useState(false)
  
  // Estados de edição
  const [editingDiary, setEditingDiary] = useState<string | null>(null)
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null)
  const [editingInvoice, setEditingInvoice] = useState<string | null>(null)
  const [editingFinancial, setEditingFinancial] = useState<string | null>(null)
  const [editingCollaborator, setEditingCollaborator] = useState<string | null>(null)
  const [editingVoucher, setEditingVoucher] = useState<string | null>(null)
  
  const [diaryForm, setDiaryForm] = useState({ date: '', description: '', image: '' })
  const [scheduleForm, setScheduleForm] = useState({ task: '', startDate: '', endDate: '', progress: 0 })
  const [invoiceForm, setInvoiceForm] = useState({ description: '', attachment: '', photo: '' })
  const [financialForm, setFinancialForm] = useState({ type: 'income' as 'income' | 'expense', date: '', description: '', amount: 0 })
  const [collaboratorForm, setCollaboratorForm] = useState({ name: '', role: '', startDate: '', endDate: '' })
  const [voucherForm, setVoucherForm] = useState({ title: '', attachment: '', photo: '' })

  // Refs para upload de arquivos
  const diaryImageInputRef = useRef<HTMLInputElement>(null)
  const invoiceFileInputRef = useRef<HTMLInputElement>(null)
  const invoicePhotoInputRef = useRef<HTMLInputElement>(null)
  const voucherFileInputRef = useRef<HTMLInputElement>(null)
  const voucherPhotoInputRef = useRef<HTMLInputElement>(null)

  // Carregar dados do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('wippel-app-data')
    if (savedData) {
      const data = JSON.parse(savedData)
      setClients(data.clients || [])
      setDiaryEntries(data.diaryEntries || [])
      setScheduleItems(data.scheduleItems || [])
      setInvoices(data.invoices || [])
      setFinancialEntries(data.financialEntries || [])
      setCollaborators(data.collaborators || [])
      setVouchers(data.vouchers || [])
    }
    
    const savedTheme = localStorage.getItem('wippel-theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
    }
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    const data = {
      clients,
      diaryEntries,
      scheduleItems,
      invoices,
      financialEntries,
      collaborators,
      vouchers
    }
    localStorage.setItem('wippel-app-data', JSON.stringify(data))
  }, [clients, diaryEntries, scheduleItems, invoices, financialEntries, collaborators, vouchers])

  // Salvar tema
  useEffect(() => {
    localStorage.setItem('wippel-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  // Função para converter arquivo para base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  // Funções de autenticação
  const handleLogin = () => {
    setLoginError('')

    // Login do engenheiro
    if (loginForm.identifier === 'wippel' && loginForm.password === 'bruno231095') {
      setCurrentUser({ type: 'engineer', id: 'engineer' })
      setCurrentView('dashboard')
      return
    }

    // Login do cliente (por usuário apenas)
    const client = clients.find(c => 
      c.username === loginForm.identifier
    )
    
    if (!client) {
      setLoginError('Usuário não encontrado')
      return
    }

    if (client.password !== loginForm.password) {
      setLoginError('Senha incorreta')
      return
    }
    
    setCurrentUser({ type: 'client', id: client.id })
    if (client.approved) {
      setSelectedClientId(client.id)
      setCurrentView('client-detail')
    } else {
      setCurrentView('pending')
    }
  }

  const createClient = () => {
    if (!clientForm.username.trim() || !clientForm.password.trim()) {
      alert('Por favor, preencha usuário e senha')
      return
    }

    // Verificar se usuário já existe
    const existingClient = clients.find(c => c.username === clientForm.username)
    if (existingClient) {
      alert('Este usuário já existe')
      return
    }

    const newClient: Client = {
      id: Date.now().toString(),
      username: clientForm.username,
      password: clientForm.password,
      approved: true, // Engenheiro cria já aprovado
      createdAt: new Date().toISOString()
    }
    setClients([...clients, newClient])
    setClientForm({ username: '', password: '' })
    setCurrentView('dashboard')
    alert('Cliente criado com sucesso!')
  }

  const approveClient = (clientId: string) => {
    setClients(clients.map(c => c.id === clientId ? { ...c, approved: true } : c))
  }

  const removeClient = (clientId: string) => {
    setClients(clients.filter(c => c.id !== clientId))
    setDiaryEntries(diaryEntries.filter(d => d.clientId !== clientId))
    setScheduleItems(scheduleItems.filter(s => s.clientId !== clientId))
    setInvoices(invoices.filter(i => i.clientId !== clientId))
    setFinancialEntries(financialEntries.filter(f => f.clientId !== clientId))
    setCollaborators(collaborators.filter(c => c.clientId !== clientId))
    setVouchers(vouchers.filter(v => v.clientId !== clientId))
  }

  // Funções do Diário da Obra
  const handleDiaryImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const imageBase64 = await fileToBase64(file)
    setDiaryForm({ ...diaryForm, image: imageBase64 })
  }

  const addDiaryEntry = () => {
    if (!diaryForm.date || !diaryForm.description.trim()) {
      alert('Por favor, preencha data e descrição')
      return
    }

    if (editingDiary) {
      setDiaryEntries(diaryEntries.map(entry => 
        entry.id === editingDiary 
          ? { ...entry, date: diaryForm.date, description: diaryForm.description, image: diaryForm.image }
          : entry
      ))
      setEditingDiary(null)
    } else {
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        clientId: selectedClientId,
        date: diaryForm.date,
        description: diaryForm.description,
        image: diaryForm.image,
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.type || 'engineer'
      }
      setDiaryEntries([...diaryEntries, newEntry])
    }
    
    setDiaryForm({ date: '', description: '', image: '' })
    setShowDiaryForm(false)
  }

  const editDiaryEntry = (entry: DiaryEntry) => {
    setDiaryForm({ date: entry.date, description: entry.description, image: entry.image })
    setEditingDiary(entry.id)
    setShowDiaryForm(true)
  }

  const deleteDiaryEntry = (entryId: string) => {
    setDiaryEntries(diaryEntries.filter(d => d.id !== entryId))
  }

  // Funções do Cronograma
  const addScheduleItem = () => {
    if (!scheduleForm.task.trim() || !scheduleForm.startDate || !scheduleForm.endDate) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    if (editingSchedule) {
      setScheduleItems(scheduleItems.map(item => 
        item.id === editingSchedule 
          ? { 
              ...item, 
              task: scheduleForm.task,
              startDate: scheduleForm.startDate,
              endDate: scheduleForm.endDate,
              progress: scheduleForm.progress,
              status: scheduleForm.progress === 100 ? 'completed' : scheduleForm.progress > 0 ? 'in-progress' : 'pending'
            }
          : item
      ))
      setEditingSchedule(null)
    } else {
      const newItem: ScheduleItem = {
        id: Date.now().toString(),
        clientId: selectedClientId,
        task: scheduleForm.task,
        startDate: scheduleForm.startDate,
        endDate: scheduleForm.endDate,
        progress: scheduleForm.progress,
        status: scheduleForm.progress === 100 ? 'completed' : scheduleForm.progress > 0 ? 'in-progress' : 'pending'
      }
      setScheduleItems([...scheduleItems, newItem])
    }
    
    setScheduleForm({ task: '', startDate: '', endDate: '', progress: 0 })
    setShowScheduleForm(false)
  }

  const editScheduleItem = (item: ScheduleItem) => {
    setScheduleForm({ task: item.task, startDate: item.startDate, endDate: item.endDate, progress: item.progress })
    setEditingSchedule(item.id)
    setShowScheduleForm(true)
  }

  const updateScheduleProgress = (itemId: string, progress: number) => {
    setScheduleItems(scheduleItems.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            progress, 
            status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'pending' 
          }
        : item
    ))
  }

  const deleteScheduleItem = (itemId: string) => {
    setScheduleItems(scheduleItems.filter(s => s.id !== itemId))
  }

  // Funções do Sistema Financeiro
  const addFinancialEntry = () => {
    if (!financialForm.date || !financialForm.description.trim() || financialForm.amount <= 0) {
      alert('Por favor, preencha todos os campos corretamente')
      return
    }

    if (editingFinancial) {
      setFinancialEntries(financialEntries.map(entry => 
        entry.id === editingFinancial 
          ? { 
              ...entry, 
              type: financialForm.type,
              date: financialForm.date,
              description: financialForm.description,
              amount: financialForm.amount
            }
          : entry
      ))
      setEditingFinancial(null)
    } else {
      const newEntry: FinancialEntry = {
        id: Date.now().toString(),
        clientId: selectedClientId,
        type: financialForm.type,
        date: financialForm.date,
        description: financialForm.description,
        amount: financialForm.amount
      }
      setFinancialEntries([...financialEntries, newEntry])
    }
    
    setFinancialForm({ type: 'income', date: '', description: '', amount: 0 })
    setShowFinancialForm(false)
  }

  const editFinancialEntry = (entry: FinancialEntry) => {
    setFinancialForm({ type: entry.type, date: entry.date, description: entry.description, amount: entry.amount })
    setEditingFinancial(entry.id)
    setShowFinancialForm(true)
  }

  const deleteFinancialEntry = (entryId: string) => {
    setFinancialEntries(financialEntries.filter(f => f.id !== entryId))
  }

  // Funções das Notas Fiscais
  const handleInvoiceFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const fileBase64 = await fileToBase64(file)
    setInvoiceForm({ ...invoiceForm, attachment: fileBase64 })
  }

  const handleInvoicePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const photoBase64 = await fileToBase64(file)
    setInvoiceForm({ ...invoiceForm, photo: photoBase64 })
  }

  const addInvoice = () => {
    if (!invoiceForm.description.trim() || (!invoiceForm.attachment && !invoiceForm.photo)) {
      alert('Por favor, preencha a descrição e adicione um arquivo OU uma foto')
      return
    }

    if (editingInvoice) {
      setInvoices(invoices.map(invoice => 
        invoice.id === editingInvoice 
          ? { 
              ...invoice, 
              description: invoiceForm.description,
              attachment: invoiceForm.attachment,
              photo: invoiceForm.photo
            }
          : invoice
      ))
      setEditingInvoice(null)
    } else {
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        clientId: selectedClientId,
        number: `NF-${Date.now()}`,
        description: invoiceForm.description,
        attachment: invoiceForm.attachment,
        photo: invoiceForm.photo,
        issueDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      }
      setInvoices([...invoices, newInvoice])
    }
    
    setInvoiceForm({ description: '', attachment: '', photo: '' })
    setShowInvoiceForm(false)
  }

  const editInvoice = (invoice: Invoice) => {
    setInvoiceForm({ description: invoice.description, attachment: invoice.attachment, photo: invoice.photo })
    setEditingInvoice(invoice.id)
    setShowInvoiceForm(true)
  }

  const updateInvoiceStatus = (invoiceId: string, status: 'pending' | 'paid' | 'overdue') => {
    setInvoices(invoices.map(inv => inv.id === invoiceId ? { ...inv, status } : inv))
  }

  const deleteInvoice = (invoiceId: string) => {
    setInvoices(invoices.filter(i => i.id !== invoiceId))
  }

  // Funções dos Colaboradores
  const addCollaborator = () => {
    if (!collaboratorForm.name.trim() || !collaboratorForm.role.trim() || !collaboratorForm.startDate) {
      alert('Por favor, preencha nome, função e data de entrada')
      return
    }

    if (editingCollaborator) {
      setCollaborators(collaborators.map(collab => 
        collab.id === editingCollaborator 
          ? { 
              ...collab, 
              name: collaboratorForm.name,
              role: collaboratorForm.role,
              startDate: collaboratorForm.startDate,
              endDate: collaboratorForm.endDate
            }
          : collab
      ))
      setEditingCollaborator(null)
    } else {
      const newCollaborator: Collaborator = {
        id: Date.now().toString(),
        clientId: selectedClientId,
        name: collaboratorForm.name,
        role: collaboratorForm.role,
        startDate: collaboratorForm.startDate,
        endDate: collaboratorForm.endDate
      }
      setCollaborators([...collaborators, newCollaborator])
    }
    
    setCollaboratorForm({ name: '', role: '', startDate: '', endDate: '' })
    setShowCollaboratorForm(false)
  }

  const editCollaborator = (collaborator: Collaborator) => {
    setCollaboratorForm({ name: collaborator.name, role: collaborator.role, startDate: collaborator.startDate, endDate: collaborator.endDate })
    setEditingCollaborator(collaborator.id)
    setShowCollaboratorForm(true)
  }

  const deleteCollaborator = (collaboratorId: string) => {
    setCollaborators(collaborators.filter(c => c.id !== collaboratorId))
  }

  // Funções dos Comprovantes
  const handleVoucherFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const fileBase64 = await fileToBase64(file)
    setVoucherForm({ ...voucherForm, attachment: fileBase64 })
  }

  const handleVoucherPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const photoBase64 = await fileToBase64(file)
    setVoucherForm({ ...voucherForm, photo: photoBase64 })
  }

  const addVoucher = () => {
    if (!voucherForm.title.trim()) {
      alert('Por favor, preencha o título')
      return
    }

    if (editingVoucher) {
      setVouchers(vouchers.map(voucher => 
        voucher.id === editingVoucher 
          ? { 
              ...voucher, 
              title: voucherForm.title,
              attachment: voucherForm.attachment,
              photo: voucherForm.photo
            }
          : voucher
      ))
      setEditingVoucher(null)
    } else {
      const newVoucher: Voucher = {
        id: Date.now().toString(),
        clientId: selectedClientId,
        title: voucherForm.title,
        attachment: voucherForm.attachment,
        photo: voucherForm.photo,
        createdAt: new Date().toISOString()
      }
      setVouchers([...vouchers, newVoucher])
    }
    
    setVoucherForm({ title: '', attachment: '', photo: '' })
    setShowVoucherForm(false)
  }

  const editVoucher = (voucher: Voucher) => {
    setVoucherForm({ title: voucher.title, attachment: voucher.attachment, photo: voucher.photo })
    setEditingVoucher(voucher.id)
    setShowVoucherForm(true)
  }

  const deleteVoucher = (voucherId: string) => {
    setVouchers(vouchers.filter(v => v.id !== voucherId))
  }

  // Dados filtrados por cliente
  const currentClient = clients.find(c => c.id === selectedClientId)
  const clientDiaryEntries = diaryEntries.filter(d => d.clientId === selectedClientId)
  const clientScheduleItems = scheduleItems.filter(s => s.clientId === selectedClientId)
  const clientInvoices = invoices.filter(i => i.clientId === selectedClientId)
  const clientFinancialEntries = financialEntries.filter(f => f.clientId === selectedClientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const clientCollaborators = collaborators.filter(c => c.clientId === selectedClientId)
  const clientVouchers = vouchers.filter(v => v.clientId === selectedClientId)

  // Cálculos financeiros - Dashboard usa TODOS os clientes, Sistema Financeiro usa apenas o cliente selecionado
  const allFinancialEntries = financialEntries
  const totalIncome = allFinancialEntries.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0)
  const totalExpenses = allFinancialEntries.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0)
  const balance = totalIncome - totalExpenses

  // Cálculos financeiros do cliente específico (para o sistema financeiro)
  const clientTotalIncome = clientFinancialEntries.filter(f => f.type === 'income').reduce((sum, f) => sum + f.amount, 0)
  const clientTotalExpenses = clientFinancialEntries.filter(f => f.type === 'expense').reduce((sum, f) => sum + f.amount, 0)
  const clientBalance = clientTotalIncome - clientTotalExpenses

  // Classes CSS baseadas no tema
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50'
  const cardClass = darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900'
  const textSecondaryClass = darkMode ? 'text-gray-300' : 'text-gray-600'
  const inputClass = darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} font-inter transition-colors duration-300`}>
      {/* Header Mobile-First */}
      <header className={`${cardClass} border-b px-3 py-2 sticky top-0 z-40`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/676f2575-5d35-4753-b050-29dc1c2bae17.png" 
              alt="Wippel Logo" 
              className="h-6 w-auto sm:h-8 sm:w-auto" 
            />
            <div>
              <h1 className="text-sm sm:text-lg font-bold text-black">Wippel Arquitetura & Engenharia</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
              }`}
            >
              {darkMode ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
            
            {currentUser && (
              <button
                onClick={() => {
                  setCurrentUser(null)
                  setCurrentView('login')
                  setSelectedClientId('')
                  setLoginError('')
                }}
                className={`p-2 rounded-full transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                    : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                }`}
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tela de Login - Mobile Optimized */}
      {currentView === 'login' && (
        <div className="flex items-center justify-center min-h-[calc(100vh-60px)] p-3">
          <div className={`${cardClass} rounded-2xl border p-6 w-full max-w-sm`}>
            <div className="text-center mb-6">
              <img 
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/676f2575-5d35-4753-b050-29dc1c2bae17.png" 
                alt="Wippel Logo" 
                className="h-12 w-auto mx-auto mb-3" 
              />
              <h2 className="text-xl font-bold">Entrar</h2>
              <p className={`${textSecondaryClass} text-sm`}>Acesse sua conta</p>
            </div>
            
            {loginError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                {loginError}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Usuário</label>
                <input
                  type="text"
                  value={loginForm.identifier}
                  onChange={(e) => {
                    setLoginForm({...loginForm, identifier: e.target.value})
                    setLoginError('')
                  }}
                  className={`w-full px-3 py-3 rounded-xl border ${inputClass} focus:ring-2 focus:ring-[#C02C33] focus:border-transparent text-base`}
                  placeholder="Digite seu usuário"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Senha</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => {
                    setLoginForm({...loginForm, password: e.target.value})
                    setLoginError('')
                  }}
                  className={`w-full px-3 py-3 rounded-xl border ${inputClass} focus:ring-2 focus:ring-[#C02C33] focus:border-transparent text-base`}
                  placeholder="••••••••"
                />
              </div>
              
              <button
                onClick={handleLogin}
                className="w-full bg-[#C02C33] text-white py-3 rounded-xl font-medium hover:bg-[#A02329] transition-colors text-base"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tela de Pendência */}
      {currentView === 'pending' && (
        <div className="flex items-center justify-center min-h-[calc(100vh-60px)] p-3">
          <div className={`${cardClass} rounded-2xl border p-6 w-full max-w-sm text-center`}>
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-3">Aguardando Aprovação</h2>
            <p className={`${textSecondaryClass} mb-4 text-sm`}>
              Sua solicitação está sendo analisada pelo engenheiro. 
              Você receberá uma notificação quando for aprovado.
            </p>
            <div className="animate-pulse">
              <div className="h-2 bg-yellow-200 rounded-full">
                <div className="h-2 bg-yellow-500 rounded-full w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard do Engenheiro - Mobile Optimized */}
      {currentView === 'dashboard' && currentUser?.type === 'engineer' && (
        <div className="p-3 sm:p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1">Dashboard</h2>
            <p className={`${textSecondaryClass} text-sm`}>Gerencie todos os seus clientes</p>
          </div>

          {/* Estatísticas - Mobile Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className={`${cardClass} rounded-xl border p-4`}>
              <div className="text-center">
                <User className="h-6 w-6 text-[#C02C33] mx-auto mb-2" />
                <p className={`${textSecondaryClass} text-xs`}>Total</p>
                <p className="text-lg font-bold">{clients.length}</p>
              </div>
            </div>
            
            <div className={`${cardClass} rounded-xl border p-4`}>
              <div className="text-center">
                <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className={`${textSecondaryClass} text-xs`}>Aprovados</p>
                <p className="text-lg font-bold">{clients.filter(c => c.approved).length}</p>
              </div>
            </div>
            
            <div className={`${cardClass} rounded-xl border p-4`}>
              <div className="text-center">
                <Clock className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                <p className={`${textSecondaryClass} text-xs`}>Pendentes</p>
                <p className="text-lg font-bold">{clients.filter(c => !c.approved).length}</p>
              </div>
            </div>
            
            <div className={`${cardClass} rounded-xl border p-4`}>
              <div className="text-center">
                <DollarSign className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className={`${textSecondaryClass} text-xs`}>Faturamento</p>
                <p className="text-sm font-bold">
                  R$ {balance.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>

          {/* Botão Criar Cliente */}
          <div className="mb-6">
            <button
              onClick={() => setCurrentView('create-client')}
              className="w-full bg-[#C02C33] text-white py-3 rounded-xl font-medium hover:bg-[#A02329] transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Criar Novo Cliente</span>
            </button>
          </div>

          {/* Lista de Clientes - Mobile Optimized */}
          <div className={`${cardClass} rounded-xl border`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold">Clientes</h3>
            </div>
            
            <div className="p-3">
              {clients.length === 0 ? (
                <p className={`${textSecondaryClass} text-center py-8 text-sm`}>Nenhum cliente cadastrado ainda.</p>
              ) : (
                <div className="space-y-3">
                  {clients.map(client => (
                    <div key={client.id} className={`p-3 rounded-xl border ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => {
                            setSelectedClientId(client.id)
                            setCurrentView('client-detail')
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${client.approved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                              {client.approved ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-sm truncate">{client.username}</h4>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          {!client.approved && (
                            <button
                              onClick={() => approveClient(client.id)}
                              className="px-2 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition-colors"
                            >
                              Aprovar
                            </button>
                          )}
                          <button
                            onClick={() => removeClient(client.id)}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tela de Criar Cliente */}
      {currentView === 'create-client' && currentUser?.type === 'engineer' && (
        <div className="flex items-center justify-center min-h-[calc(100vh-60px)] p-3">
          <div className={`${cardClass} rounded-2xl border p-6 w-full max-w-sm`}>
            <div className="text-center mb-6">
              <User className="h-10 w-10 text-[#C02C33] mx-auto mb-3" />
              <h2 className="text-xl font-bold">Criar Cliente</h2>
              <p className={`${textSecondaryClass} text-sm`}>Adicione um novo cliente ao sistema</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Usuário</label>
                <input
                  type="text"
                  value={clientForm.username}
                  onChange={(e) => setClientForm({...clientForm, username: e.target.value})}
                  className={`w-full px-3 py-3 rounded-xl border ${inputClass} focus:ring-2 focus:ring-[#C02C33] focus:border-transparent text-base`}
                  placeholder="Nome de usuário"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Senha</label>
                <input
                  type="password"
                  value={clientForm.password}
                  onChange={(e) => setClientForm({...clientForm, password: e.target.value})}
                  className={`w-full px-3 py-3 rounded-xl border ${inputClass} focus:ring-2 focus:ring-[#C02C33] focus:border-transparent text-base`}
                  placeholder="Senha do cliente"
                />
              </div>
              
              <button
                onClick={createClient}
                className="w-full bg-[#C02C33] text-white py-3 rounded-xl font-medium hover:bg-[#A02329] transition-colors text-base"
              >
                Criar Cliente
              </button>
              
              <button
                onClick={() => setCurrentView('dashboard')}
                className="w-full text-[#C02C33] py-3 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-base"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detalhes do Cliente - Mobile Optimized */}
      {currentView === 'client-detail' && currentClient && (
        <div className="pb-20">
          {/* Header do Cliente - Mobile */}
          <div className="p-3 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              {currentUser?.type === 'engineer' && (
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="text-[#C02C33] hover:underline text-sm"
                >
                  ← Voltar
                </button>
              )}
              {currentUser?.type === 'engineer' && (
                <h2 className="text-lg font-bold truncate">{currentClient.username}</h2>
              )}
              <div></div>
            </div>
          </div>

          {/* Navegação por Abas - Mobile Grid com Ícones */}
          <div className="px-3 mb-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'diary', label: 'Diário', icon: Home },
                { id: 'schedule', label: 'Cronograma', icon: Calendar },
                { id: 'financial', label: 'Financeiro', icon: Calculator },
                { id: 'invoices', label: 'Notas', icon: Receipt },
                { id: 'collaborators', label: 'Colaboradores', icon: Users },
                { id: 'vouchers', label: 'Comprovantes', icon: FileCheck }
              ].map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex flex-col items-center space-y-2 p-3 rounded-xl transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-[#C02C33] text-white' 
                        : `${cardClass} border hover:bg-gray-100 dark:hover:bg-gray-700`
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Conteúdo das Abas - Mobile Optimized */}
          <div className="px-3">
            <div className={`${cardClass} rounded-xl border`}>
              {/* Diário da Obra */}
              {activeTab === 'diary' && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Diário da Obra</h3>
                    {currentUser?.type === 'engineer' && (
                      <button
                        onClick={() => setShowDiaryForm(true)}
                        className="flex items-center space-x-1 bg-[#C02C33] text-white px-3 py-2 rounded-xl hover:bg-[#A02329] transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="text-sm">Nova</span>
                      </button>
                    )}
                  </div>

                  {clientDiaryEntries.length === 0 ? (
                    <p className={`${textSecondaryClass} text-center py-8 text-sm`}>Nenhuma entrada no diário ainda.</p>
                  ) : (
                    <div className="space-y-4">
                      {clientDiaryEntries.map(entry => (
                        <div key={entry.id} className={`p-3 rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs ${textSecondaryClass}`}>
                                {new Date(entry.date).toLocaleDateString('pt-BR')} - 
                                {entry.createdBy === 'engineer' ? ' Engenheiro' : ' Cliente'}
                              </p>
                            </div>
                            {currentUser?.type === 'engineer' && (
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => editDiaryEntry(entry)}
                                  className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 rounded"
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => deleteDiaryEntry(entry.id)}
                                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                          <p className="text-sm mb-3">{entry.description}</p>
                          {entry.image && (
                            <img src={entry.image} alt="" className="w-full h-40 object-cover rounded-lg" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Modal de Nova Entrada - Mobile */}
                  {showDiaryForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
                      <div className={`${cardClass} rounded-2xl p-4 w-full max-w-sm max-h-[90vh] overflow-y-auto`}>
                        <h4 className="text-lg font-bold mb-4">{editingDiary ? 'Editar Entrada' : 'Nova Entrada'}</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Data</label>
                            <input
                              type="date"
                              value={diaryForm.date}
                              onChange={(e) => setDiaryForm({...diaryForm, date: e.target.value})}
                              className={`w-full px-3 py-2 rounded-lg border ${inputClass} text-base`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Descrição</label>
                            <textarea
                              value={diaryForm.description}
                              onChange={(e) => setDiaryForm({...diaryForm, description: e.target.value})}
                              className={`w-full px-3 py-2 rounded-lg border ${inputClass} h-20 text-base`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Foto</label>
                            <input
                              ref={diaryImageInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleDiaryImageUpload}
                              className="hidden"
                            />
                            <button
                              onClick={() => diaryImageInputRef.current?.click()}
                              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-[#C02C33] transition-colors"
                            >
                              <Image className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                              <span className="text-sm text-gray-500">Adicionar foto</span>
                            </button>
                            {diaryForm.image && (
                              <img src={diaryForm.image} alt="" className="w-full h-32 object-cover rounded mt-2" />
                            )}
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <button
                              onClick={addDiaryEntry}
                              className="flex-1 bg-[#C02C33] text-white py-2 rounded-lg hover:bg-[#A02329] transition-colors text-base"
                            >
                              {editingDiary ? 'Salvar' : 'Adicionar'}
                            </button>
                            <button
                              onClick={() => {
                                setShowDiaryForm(false)
                                setEditingDiary(null)
                                setDiaryForm({ date: '', description: '', image: '' })
                              }}
                              className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-base"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cronograma */}
              {activeTab === 'schedule' && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Cronograma</h3>
                    {currentUser?.type === 'engineer' && (
                      <button
                        onClick={() => setShowScheduleForm(true)}
                        className="flex items-center space-x-1 bg-[#C02C33] text-white px-3 py-2 rounded-xl hover:bg-[#A02329] transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="text-sm">Nova</span>
                      </button>
                    )}
                  </div>

                  {clientScheduleItems.length === 0 ? (
                    <p className={`${textSecondaryClass} text-center py-8 text-sm`}>Nenhuma tarefa no cronograma ainda.</p>
                  ) : (
                    <div className="space-y-4">
                      {clientScheduleItems.map(item => (
                        <div key={item.id} className={`p-3 rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm">{item.task}</h4>
                              <p className={`text-xs ${textSecondaryClass}`}>
                                {new Date(item.startDate).toLocaleDateString('pt-BR')} - {new Date(item.endDate).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                item.status === 'completed' ? 'bg-green-100 text-green-800' :
                                item.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {item.status === 'completed' ? 'Concluída' :
                                 item.status === 'in-progress' ? 'Em andamento' : 'Pendente'}
                              </span>
                              {currentUser?.type === 'engineer' && (
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => editScheduleItem(item)}
                                    className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 rounded"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => deleteScheduleItem(item.id)}
                                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mb-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Progresso</span>
                              <span>{item.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#C02C33] h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          {currentUser?.type === 'engineer' && (
                            <div className="flex items-center space-x-2 mt-3">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={item.progress}
                                onChange={(e) => updateScheduleProgress(item.id, parseInt(e.target.value))}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
                              <span className="text-xs font-medium w-10">{item.progress}%</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Modal de Nova Tarefa - Mobile */}
                  {showScheduleForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
                      <div className={`${cardClass} rounded-2xl p-4 w-full max-w-sm max-h-[90vh] overflow-y-auto`}>
                        <h4 className="text-lg font-bold mb-4">{editingSchedule ? 'Editar Tarefa' : 'Nova Tarefa'}</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Tarefa</label>
                            <input
                              type="text"
                              value={scheduleForm.task}
                              onChange={(e) => setScheduleForm({...scheduleForm, task: e.target.value})}
                              className={`w-full px-3 py-2 rounded-lg border ${inputClass} text-base`}
                              placeholder="Descrição da tarefa"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Data de Início</label>
                            <input
                              type="date"
                              value={scheduleForm.startDate}
                              onChange={(e) => setScheduleForm({...scheduleForm, startDate: e.target.value})}
                              className={`w-full px-3 py-2 rounded-lg border ${inputClass} text-base`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Data de Término</label>
                            <input
                              type="date"
                              value={scheduleForm.endDate}
                              onChange={(e) => setScheduleForm({...scheduleForm, endDate: e.target.value})}
                              className={`w-full px-3 py-2 rounded-lg border ${inputClass} text-base`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Progresso Inicial (%)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={scheduleForm.progress}
                              onChange={(e) => setScheduleForm({...scheduleForm, progress: parseInt(e.target.value) || 0})}
                              className={`w-full px-3 py-2 rounded-lg border ${inputClass} text-base`}
                            />
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <button
                              onClick={addScheduleItem}
                              className="flex-1 bg-[#C02C33] text-white py-2 rounded-lg hover:bg-[#A02329] transition-colors text-base"
                            >
                              {editingSchedule ? 'Salvar' : 'Adicionar'}
                            </button>
                            <button
                              onClick={() => {
                                setShowScheduleForm(false)
                                setEditingSchedule(null)
                                setScheduleForm({ task: '', startDate: '', endDate: '', progress: 0 })
                              }}
                              className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-base"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sistema Financeiro */}
              {activeTab === 'financial' && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Sistema Financeiro</h3>
                    {currentUser?.type === 'engineer' && (
                      <button
                        onClick={() => setShowFinancialForm(true)}
                        className="flex items-center space-x-1 bg-[#C02C33] text-white px-3 py-2 rounded-xl hover:bg-[#A02329] transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="text-sm">Nova</span>
                      </button>
                    )}
                  </div>

                  {/* Abas do Sistema Financeiro */}
                  <div className="flex space-x-2 mb-4">
                    <button
                      onClick={() => setFinancialTab('entries')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        financialTab === 'entries' 
                          ? 'bg-[#C02C33] text-white' 
                          : `${textSecondaryClass} hover:bg-gray-100 dark:hover:bg-gray-700`
                      }`}
                    >
                      Lançamentos
                    </button>
                    <button
                      onClick={() => setFinancialTab('summary')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        financialTab === 'summary' 
                          ? 'bg-[#C02C33] text-white' 
                          : `${textSecondaryClass} hover:bg-gray-100 dark:hover:bg-gray-700`
                      }`}
                    >
                      Faturamento
                    </button>
                  </div>

                  {/* Lançamentos */}
                  {financialTab === 'entries' && (
                    <div>
                      {clientFinancialEntries.length === 0 ? (
                        <p className={`${textSecondaryClass} text-center py-8 text-sm`}>Nenhum lançamento ainda.</p>
                      ) : (
                        <div className="space-y-3">
                          {clientFinancialEntries.map(entry => (
                            <div key={entry.id} className={`p-3 rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${entry.type === 'income' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    {entry.type === 'income' ? (
                                      <TrendingUp className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <TrendingDown className="h-4 w-4 text-red-500" />
                                    )}
                                    <span className="text-xs text-gray-500">
                                      {new Date(entry.date).toLocaleDateString('pt-BR')}
                                    </span>
                                  </div>
                                  <h4 className="font-medium text-sm">{entry.description}</h4>
                                  <p className={`text-lg font-bold ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {entry.type === 'income' ? '+' : '-'} R$ {entry.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </p>
                                </div>
                                {currentUser?.type === 'engineer' && (
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={() => editFinancialEntry(entry)}
                                      className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 rounded"
                                    >
                                      <Edit className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => deleteFinancialEntry(entry.id)}
                                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Faturamento - Agora mostra dados APENAS do cliente selecionado */}
                  {financialTab === 'summary' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className={`p-4 rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/20`}>
                          <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <h4 className="font-medium text-green-800 dark:text-green-400">Total de Receitas</h4>
                          </div>
                          <p className="text-2xl font-bold text-green-600">
                            R$ {clientTotalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>

                        <div className={`p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20`}>
                          <div className="flex items-center space-x-2 mb-2">
                            <TrendingDown className="h-5 w-5 text-red-600" />
                            <h4 className="font-medium text-red-800 dark:text-red-400">Total de Despesas</h4>
                          </div>
                          <p className="text-2xl font-bold text-red-600">
                            R$ {clientTotalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>

                        <div className={`p-4 rounded-xl border ${clientBalance >= 0 ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20' : 'border-orange-200 bg-orange-50 dark:bg-orange-900/20'}`}>
                          <div className="flex items-center space-x-2 mb-2">
                            <Calculator className="h-5 w-5 text-blue-600" />
                            <h4 className="font-medium text-blue-800 dark:text-blue-400">Saldo Total</h4>
                          </div>
                          <p className={`text-2xl font-bold ${clientBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                            R$ {clientBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Modal de Novo Lançamento - Mobile */}
                  {showFinancialForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
                      <div className={`${cardClass} rounded-2xl p-4 w-full max-w-sm max-h-[90vh] overflow-y-auto`}>
                        <h4 className="text-lg font-bold mb-4">{editingFinancial ? 'Editar Lançamento' : 'Novo Lançamento'}</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Tipo</label>
                            <select
                              value={financialForm.type}
                              onChange={(e) => setFinancialForm({...financialForm, type: e.target.value as 'income' | 'expense'})}
                              className={`w-full px-3 py-2 rounded-lg border ${inputClass} text-base`}
                            >
                              <option value="income">Receita</option>
                              <option value="expense">Despesa</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Data</label>
                            <input
                              type="date"
                              value={financialForm.date}
                              onChange={(e) => setFinancialForm({...financialForm, date: e.target.value})}
                              className={`w-full px-3 py-2 rounded-lg border ${inputClass} text-base`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Descrição</label>
                            <input
                              type="text"
                              value={financialForm.description}
                              onChange={(e) => setFinancialForm({...financialForm, description: e.target.value})}
                              className={`w-full px-3 py-2 rounded-lg border ${inputClass} text-base`}
                              placeholder="Descrição do lançamento"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Valor (R$)</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={financialForm.amount}
                              onChange={(e) => setFinancialForm({...financialForm, amount: parseFloat(e.target.value) || 0})}
                              className={`w-full px-3 py-2 rounded-lg border ${inputClass} text-base`}
                              placeholder="0,00"
                            />
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <button
                              onClick={addFinancialEntry}
                              className="flex-1 bg-[#C02C33] text-white py-2 rounded-lg hover:bg-[#A02329] transition-colors text-base"
                            >
                              {editingFinancial ? 'Salvar' : 'Adicionar'}
                            </button>
                            <button
                              onClick={() => {
                                setShowFinancialForm(false)
                                setEditingFinancial(null)
                                setFinancialForm({ type: 'income', date: '', description: '', amount: 0 })
                              }}
                              className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-base"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notas Fiscais */}
              {activeTab === 'invoices' && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Notas Fiscais</h3>
                    {currentUser?.type === 'engineer' && (
                      <button
                        onClick={() => setShowInvoiceForm(true)}
                        className="flex items-center space-x-1 bg-[#C02C33] text-white px-3 py-2 rounded-xl hover:bg-[#A02329] transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="text-sm">Nova</span>
                      </button>
                    )}
                  </div>

                  {clientInvoices.length === 0 ? (
                    <p className={`${textSecondaryClass} text-center py-8 text-sm`}>Nenhuma nota fiscal ainda.</p>
                  ) : (
                    <div className="space-y-4">
                      {clientInvoices.map(invoice => (
                        <div key={invoice.id} className={`p-3 rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm">{invoice.number}</h4>
                              <p className="text-sm">{invoice.description}</p>
                              <p className={`text-xs ${textSecondaryClass}`}>
                                Emissão: {new Date(invoice.issueDate).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                                invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {invoice.status === 'paid' ? 'Paga' :
                                 invoice.status === 'overdue' ? 'Vencida' : 'Pendente'}
                              </span>
                              {currentUser?.type === 'engineer' && (
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => editInvoice(invoice)}
                                    className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 rounded"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => deleteInvoice(invoice.id)}
                                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {currentUser?.type === 'engineer' && invoice.status !== 'paid' && (
                            <div className="flex space-x-1 mb-2">
                              <button
                                onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                                className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                              >
                                Marcar Paga
                              </button>
                              <button
                                onClick={() => updateInvoiceStatus(invoice.id, 'overdue')}
                                className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                              >
                                Vencida
                              </button>
                            </div>
                          )}

                          {(invoice.attachment || invoice.photo) && (
                            <div className="space-y-2">
                              {invoice.attachment && (
                                <div className="flex items-center space-x-2 text-xs">
                                  <Paperclip className="h-3 w-3" />
                                  <span>Arquivo anexado</span>
                                  <button
                                    onClick={() => {
                                      const link = document.createElement('a')
                                      link.href = invoice.attachment
                                      link.download = `${invoice.number}-arquivo`
                                      link.click()
                                    }}
                                    className="text-blue-500 hover:underline"
                                  >
                                    <Download className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                              {invoice.photo && (
                                <img src={invoice.photo} alt="" className="w-full h-32 object-cover rounded-lg" />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Modal de Nova Nota Fiscal - Mobile */}
                  {showInvoiceForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
                      <div className={`${cardClass} rounded-2xl p-4 w-full max-w-sm max-h-[90vh] overflow-y-auto`}>
                        <h4 className="text-lg font-bold mb-4">{editingInvoice ? 'Editar Nota Fiscal' : 'Nova Nota Fiscal'}</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Descrição</label>
                            <input
                              type="text"
                              value={invoiceForm.description}
                              onChange={(e) => setInvoiceForm({...invoiceForm, description: e.target.value})}
                              className={`w-full px-3 py-2 rounded-lg border ${inputClass} text-base`}
                              placeholder="Descrição dos serviços"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Arquivo (obrigatório uma das opções)</label>
                            <input
                              ref={invoiceFileInputRef}
                              type="file"
                              onChange={handleInvoiceFileUpload}
                              className="hidden"
                            />
                            <button
                              onClick={() => invoiceFileInputRef.current?.click()}
                              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-[#C02C33] transition-colors"
                            >
                              <Paperclip className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                              <span className="text-sm text-gray-500">Adicionar arquivo</span>
                            </button>
                            {invoiceForm.attachment && (
                              <p className="text-xs text-green-600 mt-1">✓ Arquivo adicionado</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Foto (obrigatório uma das opções)</label>
                            <input
                              ref={invoicePhotoInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleInvoicePhotoUpload}
                              className="hidden"
                            />
                            <button
                              onClick={() => invoicePhotoInputRef.current?.click()}
                              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-[#C02C33] transition-colors"
                            >
                              <Image className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                              <span className="text-sm text-gray-500">Adicionar foto</span>
                            </button>
                            {invoiceForm.photo && (
                              <img src={invoiceForm.photo} alt="" className="w-full h-32 object-cover rounded mt-2" />
                            )}
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <button
                              onClick={addInvoice}
                              className="flex-1 bg-[#C02C33] text-white py-2 rounded-lg hover:bg-[#A02329] transition-colors text-base"
                            >
                              {editingInvoice ? 'Salvar' : 'Criar'}
                            </button>
                            <button
                              onClick={() => {
                                setShowInvoiceForm(false)
                                setEditingInvoice(null)
                                setInvoiceForm({ description: '', attachment: '', photo: '' })
                              }}
                              className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-base"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Colaboradores */}
              {activeTab === 'collaborators' && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Colaboradores</h3>
                    {currentUser?.type === 'engineer' && (
                      <button
                        onClick={() => setShowCollaboratorForm(true)}
                        className="flex items-center space-x-1 bg-[#C02C33] text-white px-3 py-2 rounded-xl hover:bg-[#A02329] transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="text-sm">Novo</span>
                      </button>
                    )}
                  </div>

                  {clientCollaborators.length === 0 ? (
                    <p className={`${textSecondaryClass} text-center py-8 text-sm`}>Nenhum colaborador cadastrado ainda.</p>
                  ) : (
                    <div className="space-y-4">
                      {clientCollaborators.map(collaborator => (
                        <div key={collaborator.id} className={`p-3 rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm">{collaborator.name}</h4>
                              <p className="text-sm text-gray-600">{collaborator.role}</p>
                              <p className={`text-xs ${textSecondaryClass}`}>
                                Entrada: {new Date(collaborator.startDate).toLocaleDateString('pt-BR')}
                                {collaborator.endDate && ` | Saída: ${new Date(collaborator.endDate).toLocaleDateString('pt-BR')}`}
                              </p>
                            </div>
                            {currentUser?.type === 'engineer' && (
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => editCollaborator(collaborator)}
                                  className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 rounded"
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => deleteCollaborator(collaborator.id)}
                                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Modal de Novo Colaborador - Mobile */}
                  {showCollaboratorForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
                      <div className={`${cardClass} rounded-2xl p-4 w-full max-w-sm max-h-[90vh] overflow-y-auto`}>
                        <h4 className="text-lg font-bold mb-4">{editingCollaborator ? 'Editar Colaborador' : 'Novo Colaborador'}</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Nome</label>
                            <input
                              type="text"
                              value={collaboratorForm.name}
                              onChange={(e) => setCollaboratorForm({...collaboratorForm, name: e.target.value})}
                              className={`w-full px-3 py-2 rounded-lg border ${inputClass} text-base`}
                              placeholder="Nome do colaborador"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Função</label>
                            <input
                              type="text"
                              value={collaboratorForm.role}
                              onChange={(e) => setCollaboratorForm({...collaboratorForm, role: e.target.value})}
                              className={`w-full px-3 py-2 rounded-lg border ${inputClass} text-base`}
                              placeholder="Função do colaborador"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Data de Entrada</label>
                            <input
                              type="date"
                              value={collaboratorForm.startDate}
                              onChange={(e) => setCollaboratorForm({...collaboratorForm, startDate: e.target.value})}
                              className={`w-full px-3 py-2 rounded-lg border ${inputClass} text-base`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Data de Saída (opcional)</label>
                            <input
                              type="date"
                              value={collaboratorForm.endDate}
                              onChange={(e) => setCollaboratorForm({...collaboratorForm, endDate: e.target.value})}
                              className={`w-full px-3 py-2 rounded-lg border ${inputClass} text-base`}
                            />
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <button
                              onClick={addCollaborator}
                              className="flex-1 bg-[#C02C33] text-white py-2 rounded-lg hover:bg-[#A02329] transition-colors text-base"
                            >
                              {editingCollaborator ? 'Salvar' : 'Adicionar'}
                            </button>
                            <button
                              onClick={() => {
                                setShowCollaboratorForm(false)
                                setEditingCollaborator(null)
                                setCollaboratorForm({ name: '', role: '', startDate: '', endDate: '' })
                              }}
                              className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-base"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Comprovantes */}
              {activeTab === 'vouchers' && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Comprovantes</h3>
                    {currentUser?.type === 'engineer' && (
                      <button
                        onClick={() => setShowVoucherForm(true)}
                        className="flex items-center space-x-1 bg-[#C02C33] text-white px-3 py-2 rounded-xl hover:bg-[#A02329] transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span className="text-sm">Novo</span>
                      </button>
                    )}
                  </div>

                  {clientVouchers.length === 0 ? (
                    <p className={`${textSecondaryClass} text-center py-8 text-sm`}>Nenhum comprovante ainda.</p>
                  ) : (
                    <div className="space-y-4">
                      {clientVouchers.map(voucher => (
                        <div key={voucher.id} className={`p-3 rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm">{voucher.title}</h4>
                              <p className={`text-xs ${textSecondaryClass}`}>
                                {new Date(voucher.createdAt).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                            {currentUser?.type === 'engineer' && (
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => editVoucher(voucher)}
                                  className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1 rounded"
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => deleteVoucher(voucher.id)}
                                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>

                          {(voucher.attachment || voucher.photo) && (
                            <div className="space-y-2">
                              {voucher.attachment && (
                                <div className="flex items-center space-x-2 text-xs">
                                  <Paperclip className="h-3 w-3" />
                                  <span>Arquivo anexado</span>
                                  <button
                                    onClick={() => {
                                      const link = document.createElement('a')
                                      link.href = voucher.attachment
                                      link.download = `${voucher.title}-arquivo`
                                      link.click()
                                    }}
                                    className="text-blue-500 hover:underline"
                                  >
                                    <Download className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                              {voucher.photo && (
                                <img src={voucher.photo} alt="" className="w-full h-32 object-cover rounded-lg" />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Modal de Novo Comprovante - Mobile */}
                  {showVoucherForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
                      <div className={`${cardClass} rounded-2xl p-4 w-full max-w-sm max-h-[90vh] overflow-y-auto`}>
                        <h4 className="text-lg font-bold mb-4">{editingVoucher ? 'Editar Comprovante' : 'Novo Comprovante'}</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Título</label>
                            <input
                              type="text"
                              value={voucherForm.title}
                              onChange={(e) => setVoucherForm({...voucherForm, title: e.target.value})}
                              className={`w-full px-3 py-2 rounded-lg border ${inputClass} text-base`}
                              placeholder="Título do comprovante"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Arquivo</label>
                            <input
                              ref={voucherFileInputRef}
                              type="file"
                              onChange={handleVoucherFileUpload}
                              className="hidden"
                            />
                            <button
                              onClick={() => voucherFileInputRef.current?.click()}
                              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-[#C02C33] transition-colors"
                            >
                              <Paperclip className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                              <span className="text-sm text-gray-500">Adicionar arquivo</span>
                            </button>
                            {voucherForm.attachment && (
                              <p className="text-xs text-green-600 mt-1">✓ Arquivo adicionado</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Foto</label>
                            <input
                              ref={voucherPhotoInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleVoucherPhotoUpload}
                              className="hidden"
                            />
                            <button
                              onClick={() => voucherPhotoInputRef.current?.click()}
                              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-[#C02C33] transition-colors"
                            >
                              <Image className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                              <span className="text-sm text-gray-500">Adicionar foto</span>
                            </button>
                            {voucherForm.photo && (
                              <img src={voucherForm.photo} alt="" className="w-full h-32 object-cover rounded mt-2" />
                            )}
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <button
                              onClick={addVoucher}
                              className="flex-1 bg-[#C02C33] text-white py-2 rounded-lg hover:bg-[#A02329] transition-colors text-base"
                            >
                              {editingVoucher ? 'Salvar' : 'Adicionar'}
                            </button>
                            <button
                              onClick={() => {
                                setShowVoucherForm(false)
                                setEditingVoucher(null)
                                setVoucherForm({ title: '', attachment: '', photo: '' })
                              }}
                              className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-base"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}