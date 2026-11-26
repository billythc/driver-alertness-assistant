import { useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import './App.css'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const translations = {
  en: {
    title: 'Driver Alertness Assistant',
    subtitle: 'Your shift. Your breaks. Your wellbeing.',
    welcome: 'Welcome, Driver',
    welcomeText: 'Monitor your work shift and keep track of your rest.',
    shiftStatus: 'Shift Status',
    shiftId: 'Shift ID',
    workedHours: 'Worked Hours',
    breakTime: 'Break Time',
    waterIntake: 'Water Intake',
    caffeine: 'Caffeine',
    minutes: 'minutes',
    shiftControls: 'Shift Controls',
    checking: 'Checking...',
    notStarted: 'Not started',
    restoring: 'Restoring your session...',
    startShift: 'Start Shift',
    startBreak: 'Start Break',
    endBreak: 'End Break',
    endShift: 'End Shift',
    refreshData: 'Refresh Data',
    safetySummary: 'Driver Safety Summary',
    overallStats: 'Your overall work and break statistics.',
    exportPDF: 'Export Weekly Report as PDF',
    completedShifts: 'Completed Shifts',
    totalHours: 'Total Hours Worked',
    totalBreaks: 'Total Breaks',
    averageHours: 'Average Hours / Shift',
    weeklyReport: 'Weekly Driver Report',
    weeklyDescription: 'Your recorded activity over the last seven days.',
    hoursWorked: 'Hours worked',
    breaks: 'Breaks',
    performance: 'Performance Overview',
    performanceDescription: 'Your recorded shift and wellbeing data.',
    noChartData: 'No chart data available yet. Record some shift activity to see your charts.',
    shiftDuration: 'Shift Duration',
    hoursWorkedChart: 'Hours worked',
    caffeineConsumption: 'Caffeine Consumption',
    caffeineMg: 'Caffeine (mg)',
    waterChart: 'Water Intake',
    waterMl: 'Water (ml)',
    refreshCharts: 'Refresh Charts',
    insights: 'Driver Insights Dashboard',
    insightsDescription: 'An overview of your recorded driving and wellbeing information.',
    averageAlertness: 'Average Alertness',
    checksRecorded: 'checks recorded',
    averageSleep: 'Average Sleep',
    records: 'records',
    recordedBreaks: 'Recorded Breaks',
    statisticsNote: 'These statistics describe recorded activity and self-reported information. They do not predict fatigue or determine fitness to drive.',
    recommendations: 'Driver Rest Recommendations',
    recommendationsDescription: 'Supportive reminders based on your recorded shift and alertness data.',
    monitorRest: 'Monitor your rest',
    monitorRestMessage: 'Keep monitoring how you feel and take breaks when needed.',
    stopRest: 'Stop and rest',
    stopRestMessage: 'Your latest check reported sleepiness or difficulty focusing. Stop in a safe place and rest before considering driving again.',
    considerBreak: 'Consider taking a break',
    considerBreakMessage: 'Your latest alertness check suggests reduced alertness. Take a break and reassess.',
    breakReminder: 'Break reminder',
    breakReminderMessage: 'It has been at least two hours since your last recorded completed break. Consider taking a break.',
    timeSinceBreak: 'Time since last completed break:',
    noCompletedBreak: 'No completed break recorded',
    latestAlertness: 'Latest self-reported alertness:',
    noAlertnessCheck: 'No alertness check recorded',
    safetyReminder: 'These reminders are based on recorded information and are not a medical assessment or a determination of fitness to drive. If you feel sleepy, stop in a safe place and rest.',
    refreshRecommendations: 'Refresh Rest Recommendations',
    fatigueTrends: 'Driver Fatigue Trends',
    fatigueDescription: 'Your recorded self-reported alertness levels over time.',
    noAlertnessRecords: 'No alertness records available yet.',
    selfReportedAlertness: 'Self-reported alertness',
    fatigueNote: 'These scores reflect your own reports. This chart is not a medical assessment or a prediction of driving safety.',
    refreshTrends: 'Refresh Alertness Trends',
    caffeineTimeline: 'Caffeine Consumption Timeline',
    caffeineDescription: 'Caffeine entries recorded during your current shift.',
    startShiftTimeline: 'Start a shift to view its caffeine timeline.',
    noCaffeine: 'No caffeine has been recorded during this shift yet.',
    shiftHistory: 'Shift History',
    shifts: 'shifts',
    previousShifts: 'Your previous and current work shifts.',
    noShifts: 'No shifts recorded yet.',
    status: 'Status',
    active: 'Active',
    completed: 'Completed',
    started: 'Started',
    ended: 'Ended',
    duration: 'Duration',
    hideDetails: 'Hide Details',
    viewDetails: 'View Details',
    shiftDetails: 'Shift Details',
    loadingDetails: 'Loading shift details...',
    workingHours: 'Working Hours',
    breakHistory: 'Break History',
    noBreaks: 'No breaks recorded for this shift.',
    currentlyActive: 'Currently active',
    recordedActivities: 'Recorded Activities',
    noActivitiesForShift: 'No activities recorded for this shift.',
    refreshHistory: 'Refresh Shift History',
    activityHistory: 'Activity History',
    recentActivities: 'Your recent shift activities.',
    startToTrack: 'Start a shift to begin tracking activity.',
    noActivities: 'No activities recorded yet.',
    refreshActivity: 'Refresh Activity',
    healthTracking: 'Driver Health Tracking',
    logCaffeine: 'Log Caffeine',
    amountMg: 'Amount in mg',
    saveCaffeine: 'Save Caffeine',
    logWater: 'Log Water',
    amountMl: 'Amount in ml',
    saveWater: 'Save Water',
    sleepTracking: 'Sleep Tracking',
    recordSleep: 'Record Your Sleep',
    sleepHours: 'Hours slept (e.g. 7.5)',
    sleepNotes: 'Sleep notes (optional)',
    saveSleep: 'Save Sleep Record',
    recentSleep: 'Recent Sleep Records',
    noSleep: 'No sleep records yet.',
    refreshSleep: 'Refresh Sleep Records',
    alertnessCheck: 'Alertness Check',
    howAlert: 'How alert do you feel?',
    verySleepy: 'Very sleepy',
    sleepy: 'Sleepy',
    moderatelyAlert: 'Moderately alert',
    alert: 'Alert',
    veryAlert: 'Very alert',
    feelingSleepy: 'I am feeling sleepy',
    difficultyFocusing: 'I am having difficulty concentrating',
    submitAlertness: 'Submit Alertness Check',
    alertnessWarning: 'Alertness Warning',
    alertnessResult: 'Alertness Check Result',
    alertnessLevel: 'Alertness level:',
    yes: 'Yes',
    no: 'No',
    recommendation: 'Recommendation:',
    processing: 'Processing...',
    restoringSession: 'Restoring your active session...',
    language: 'Language',
  },

  es: {
    title: 'Asistente de Alerta del Conductor',
    subtitle: 'Tu turno. Tus descansos. Tu bienestar.',
    welcome: 'Bienvenido, conductor',
    welcomeText: 'Controla tu jornada laboral y registra tus descansos.',
    shiftStatus: 'Estado del turno',
    shiftId: 'ID del turno',
    workedHours: 'Horas trabajadas',
    breakTime: 'Tiempo de descanso',
    waterIntake: 'Consumo de agua',
    caffeine: 'Cafeína',
    minutes: 'minutos',
    shiftControls: 'Controles del turno',
    checking: 'Comprobando...',
    notStarted: 'No iniciado',
    restoring: 'Restaurando tu sesión...',
    startShift: 'Iniciar turno',
    startBreak: 'Iniciar descanso',
    endBreak: 'Finalizar descanso',
    endShift: 'Finalizar turno',
    refreshData: 'Actualizar datos',
    safetySummary: 'Resumen de seguridad del conductor',
    overallStats: 'Estadísticas generales de tu trabajo y descansos.',
    exportPDF: 'Exportar informe semanal en PDF',
    completedShifts: 'Turnos completados',
    totalHours: 'Total de horas trabajadas',
    totalBreaks: 'Total de descansos',
    averageHours: 'Media de horas por turno',
    weeklyReport: 'Informe semanal del conductor',
    weeklyDescription: 'Tu actividad registrada durante los últimos siete días.',
    hoursWorked: 'Horas trabajadas',
    breaks: 'Descansos',
    performance: 'Resumen del rendimiento',
    performanceDescription: 'Tus datos registrados de trabajo y bienestar.',
    noChartData: 'Todavía no hay datos para los gráficos. Registra actividad para verlos.',
    shiftDuration: 'Duración del turno',
    hoursWorkedChart: 'Horas trabajadas',
    caffeineConsumption: 'Consumo de cafeína',
    caffeineMg: 'Cafeína (mg)',
    waterChart: 'Consumo de agua',
    waterMl: 'Agua (ml)',
    refreshCharts: 'Actualizar gráficos',
    insights: 'Panel de estadísticas del conductor',
    insightsDescription: 'Resumen de tus datos registrados de conducción y bienestar.',
    averageAlertness: 'Estado de alerta medio',
    checksRecorded: 'evaluaciones registradas',
    averageSleep: 'Media de sueño',
    records: 'registros',
    recordedBreaks: 'Descansos registrados',
    statisticsNote: 'Estas estadísticas describen la actividad registrada y la información que has comunicado. No predicen la fatiga ni determinan si estás en condiciones de conducir.',
    recommendations: 'Recomendaciones de descanso',
    recommendationsDescription: 'Recordatorios basados en tus turnos y datos de alerta registrados.',
    monitorRest: 'Controla tu descanso',
    monitorRestMessage: 'Sigue observando cómo te encuentras y descansa cuando sea necesario.',
    stopRest: 'Detente y descansa',
    stopRestMessage: 'Tu última evaluación indica somnolencia o dificultad para concentrarte. Detente en un lugar seguro y descansa antes de volver a conducir.',
    considerBreak: 'Considera hacer un descanso',
    considerBreakMessage: 'Tu última evaluación indica una posible disminución del estado de alerta. Descansa y vuelve a evaluarte.',
    breakReminder: 'Recordatorio de descanso',
    breakReminderMessage: 'Han pasado al menos dos horas desde tu último descanso completado y registrado. Considera hacer una pausa.',
    timeSinceBreak: 'Tiempo desde el último descanso completado:',
    noCompletedBreak: 'No hay descansos completados registrados',
    latestAlertness: 'Último nivel de alerta comunicado:',
    noAlertnessCheck: 'No hay evaluaciones de alerta registradas',
    safetyReminder: 'Estos recordatorios se basan en información registrada y no constituyen una evaluación médica ni determinan si estás en condiciones de conducir. Si tienes sueño, detente en un lugar seguro y descansa.',
    refreshRecommendations: 'Actualizar recomendaciones',
    fatigueTrends: 'Tendencias de fatiga del conductor',
    fatigueDescription: 'Evolución de tus niveles de alerta comunicados.',
    noAlertnessRecords: 'Todavía no hay evaluaciones de alerta registradas.',
    selfReportedAlertness: 'Nivel de alerta comunicado',
    fatigueNote: 'Estas puntuaciones reflejan tus propias respuestas. Este gráfico no es una evaluación médica ni una predicción de seguridad al conducir.',
    refreshTrends: 'Actualizar tendencias de alerta',
    caffeineTimeline: 'Registro de consumo de cafeína',
    caffeineDescription: 'Consumo de cafeína registrado durante tu turno actual.',
    startShiftTimeline: 'Inicia un turno para consultar el registro de cafeína.',
    noCaffeine: 'Todavía no se ha registrado cafeína durante este turno.',
    shiftHistory: 'Historial de turnos',
    shifts: 'turnos',
    previousShifts: 'Tus turnos de trabajo anteriores y actuales.',
    noShifts: 'Todavía no hay turnos registrados.',
    status: 'Estado',
    active: 'Activo',
    completed: 'Completado',
    started: 'Inicio',
    ended: 'Fin',
    duration: 'Duración',
    hideDetails: 'Ocultar detalles',
    viewDetails: 'Ver detalles',
    shiftDetails: 'Detalles del turno',
    loadingDetails: 'Cargando detalles del turno...',
    workingHours: 'Horas trabajadas',
    breakHistory: 'Historial de descansos',
    noBreaks: 'No hay descansos registrados para este turno.',
    currentlyActive: 'Actualmente activo',
    recordedActivities: 'Actividades registradas',
    noActivitiesForShift: 'No hay actividades registradas para este turno.',
    refreshHistory: 'Actualizar historial de turnos',
    activityHistory: 'Historial de actividad',
    recentActivities: 'Tus actividades recientes del turno.',
    startToTrack: 'Inicia un turno para empezar a registrar actividad.',
    noActivities: 'Todavía no hay actividades registradas.',
    refreshActivity: 'Actualizar actividad',
    healthTracking: 'Seguimiento de la salud del conductor',
    logCaffeine: 'Registrar cafeína',
    amountMg: 'Cantidad en mg',
    saveCaffeine: 'Guardar cafeína',
    logWater: 'Registrar agua',
    amountMl: 'Cantidad en ml',
    saveWater: 'Guardar agua',
    sleepTracking: 'Seguimiento del sueño',
    recordSleep: 'Registrar tu sueño',
    sleepHours: 'Horas dormidas (p. ej. 7,5)',
    sleepNotes: 'Notas sobre el sueño (opcional)',
    saveSleep: 'Guardar registro de sueño',
    recentSleep: 'Registros recientes de sueño',
    noSleep: 'Todavía no hay registros de sueño.',
    refreshSleep: 'Actualizar registros de sueño',
    alertnessCheck: 'Evaluación del estado de alerta',
    howAlert: '¿Qué nivel de alerta tienes?',
    verySleepy: 'Mucho sueño',
    sleepy: 'Con sueño',
    moderatelyAlert: 'Moderadamente alerta',
    alert: 'Alerta',
    veryAlert: 'Muy alerta',
    feelingSleepy: 'Tengo sueño',
    difficultyFocusing: 'Tengo dificultades para concentrarme',
    submitAlertness: 'Enviar evaluación de alerta',
    alertnessWarning: 'Advertencia sobre el estado de alerta',
    alertnessResult: 'Resultado de la evaluación',
    alertnessLevel: 'Nivel de alerta:',
    yes: 'Sí',
    no: 'No',
    recommendation: 'Recomendación:',
    processing: 'Procesando...',
    restoringSession: 'Restaurando tu sesión activa...',
    language: 'Idioma',
  },
}

function getLocalDateTime() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

async function apiRequest(url, method = 'GET') {
  const response = await fetch(url, { method })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Something went wrong')
  }

  return data
}

function formatDate(value, language = 'en') {
  if (!value) return '—'
  return new Date(value).toLocaleString(
    language === 'es' ? 'es-ES' : 'en-GB'
  )
}

function calculateDuration(startedAt, endedAt, language = 'en') {
  if (!startedAt) return '—'

  const start = new Date(startedAt)
  const end = endedAt ? new Date(endedAt) : new Date()
  const minutes = Math.max(0, Math.floor((end - start) / 60000))
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  return language === 'es'
    ? `${hours} h ${remainingMinutes} min`
    : `${hours}h ${remainingMinutes}m`
}

function App() {
  const [language, setLanguage] = useState(
    localStorage.getItem('driverAppLanguage') || 'en'
  )

  const t = translations[language]

  function changeLanguage(newLanguage) {
    setLanguage(newLanguage)
    localStorage.setItem('driverAppLanguage', newLanguage)
  }

  const [shiftId, setShiftId] = useState(null)
  const [breakId, setBreakId] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [shiftHistory, setShiftHistory] = useState([])
  const [chartData, setChartData] = useState([])

  const [selectedShiftId, setSelectedShiftId] = useState(null)
  const [selectedShiftDashboard, setSelectedShiftDashboard] = useState(null)
  const [selectedShiftActivities, setSelectedShiftActivities] = useState([])
  const [selectedShiftBreaks, setSelectedShiftBreaks] = useState([])

  const [loading, setLoading] = useState(false)
  const [restoringSession, setRestoringSession] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [caffeineAmount, setCaffeineAmount] = useState('')
  const [waterAmount, setWaterAmount] = useState('')
  const [sleepHours, setSleepHours] = useState('')
  const [sleepNotes, setSleepNotes] = useState('')
  const [sleepRecords, setSleepRecords] = useState([])

  const [alertnessLevel, setAlertnessLevel] = useState('3')
  const [feelingSleepy, setFeelingSleepy] = useState(false)
  const [difficultyFocusing, setDifficultyFocusing] = useState(false)
  const [alertnessResult, setAlertnessResult] = useState(null)
  const [alertnessHistory, setAlertnessHistory] = useState([])

  const [currentShiftBreaks, setCurrentShiftBreaks] = useState([])
  const [activities, setActivities] = useState([])
  const [weeklyReport, setWeeklyReport] = useState([])

  const [safetySummary, setSafetySummary] = useState({
    completedShifts: 0,
    totalHours: 0,
    totalBreaks: 0,
    averageHours: 0,
  })

  function exportWeeklyReport() {
    window.print()
  }

  async function refreshDashboard(id = shiftId) {
    if (!id) return
    const data = await apiRequest(`${API}/dashboard/${id}`)
    setDashboard(data)
  }

  async function refreshActivities(id = shiftId) {
    if (!id) {
      setActivities([])
      return
    }

    const data = await apiRequest(`${API}/shifts/${id}/activity`)
    setActivities(data.activities || [])
  }

  async function refreshSleepRecords() {
    const data = await apiRequest(`${API}/sleep`)
    setSleepRecords(data.sleep_records || [])
  }

  async function refreshCurrentShiftBreaks(id = shiftId) {
    if (!id) {
      setCurrentShiftBreaks([])
      return
    }

    const data = await apiRequest(`${API}/shifts/${id}/breaks`)
    setCurrentShiftBreaks(data.breaks || [])
  }

  async function refreshAlertnessHistory() {
    const data = await apiRequest(`${API}/alertness-history`)
    setAlertnessHistory(data)
  }

  async function refreshShiftHistory() {
    const data = await apiRequest(`${API}/shifts`)
    const shifts = data.shifts || []

    setShiftHistory(shifts)

    const results = await Promise.all(
      shifts.map(async shift => {
        try {
          const id = shift[0]
          const dashboardData = await apiRequest(`${API}/dashboard/${id}`)
          const breakData = await apiRequest(`${API}/shifts/${id}/breaks`)

          return {
            shift: `#${id}`,
            date: shift[1].slice(0, 10),
            hours: Number(dashboardData.hours_worked) || 0,
            caffeine: Number(dashboardData.total_caffeine_mg) || 0,
            water: Number(dashboardData.total_water_ml) || 0,
            breaks: (breakData.breaks || []).length,
            completed: Boolean(shift[2]),
          }
        } catch {
          return null
        }
      })
    )

    const validResults = results.filter(Boolean)
    const completedShifts = validResults.filter(item => item.completed)

    const totalHours = completedShifts.reduce(
      (total, item) => total + item.hours, 0
    )

    const totalBreaks = completedShifts.reduce(
      (total, item) => total + item.breaks, 0
    )

    setSafetySummary({
      completedShifts: completedShifts.length,
      totalHours: Number(totalHours.toFixed(2)),
      totalBreaks,
      averageHours: completedShifts.length
        ? Number((totalHours / completedShifts.length).toFixed(2))
        : 0,
    })

    setChartData(validResults.slice().reverse())

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 6)

    const dailyData = {}

    for (let i = 0; i < 7; i++) {
      const day = new Date(sevenDaysAgo)
      day.setDate(sevenDaysAgo.getDate() + i)

      const dateKey = [
        day.getFullYear(),
        String(day.getMonth() + 1).padStart(2, '0'),
        String(day.getDate()).padStart(2, '0'),
      ].join('-')

      dailyData[dateKey] = {
        date: dateKey,
        hours: 0,
        breaks: 0,
        caffeine: 0,
        water: 0,
      }
    }

    validResults.forEach(item => {
      if (dailyData[item.date]) {
        dailyData[item.date].hours += item.hours
        dailyData[item.date].breaks += item.breaks
        dailyData[item.date].caffeine += item.caffeine
        dailyData[item.date].water += item.water
      }
    })

    setWeeklyReport(Object.values(dailyData))
  }

  async function viewShiftDetails(id) {
    setError('')
    setMessage(
      language === 'es'
        ? `Cargando detalles del turno #${id}...`
        : `Loading details for Shift #${id}...`
    )

    setSelectedShiftId(id)
    setSelectedShiftDashboard(null)
    setSelectedShiftActivities([])
    setSelectedShiftBreaks([])
    setLoading(true)

    try {
      const dashboardData = await apiRequest(`${API}/dashboard/${id}`)
      const activityData = await apiRequest(`${API}/shifts/${id}/activity`)
      const breakData = await apiRequest(`${API}/shifts/${id}/breaks`)

      setSelectedShiftDashboard(dashboardData)
      setSelectedShiftActivities(activityData.activities || [])
      setSelectedShiftBreaks(breakData.breaks || [])

      setMessage(
        language === 'es'
          ? `Detalles del turno #${id} cargados correctamente.`
          : `Shift #${id} details loaded successfully.`
      )
    } catch (err) {
      setError(err.message)
      setMessage('')
    } finally {
      setLoading(false)
    }
  }

  function closeShiftDetails() {
    setSelectedShiftId(null)
    setSelectedShiftDashboard(null)
    setSelectedShiftActivities([])
    setSelectedShiftBreaks([])
  }

  useEffect(() => {
    async function initializeApp() {
      setRestoringSession(true)

      try {
        const session = await apiRequest(`${API}/active-session`)

        if (session.active && session.shift) {
          const id = session.shift.shift_id

          setShiftId(id)
          setBreakId(session.break?.break_id ?? null)

          await Promise.all([
            refreshDashboard(id),
            refreshActivities(id),
            refreshCurrentShiftBreaks(id),
          ])
        } else {
          setShiftId(null)
          setBreakId(null)
          setDashboard(null)
          setActivities([])
          setCurrentShiftBreaks([])
        }

        await Promise.all([
          refreshShiftHistory(),
          refreshSleepRecords(),
          refreshAlertnessHistory(),
        ])
      } catch (err) {
        setError(err.message)
      } finally {
        setRestoringSession(false)
      }
    }

    initializeApp()
  }, [])

  async function handleAction(action) {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      await action()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function startShift() {
    return handleAction(async () => {
      const startedAt = getLocalDateTime()

      const data = await apiRequest(
        `${API}/shifts?started_at=${encodeURIComponent(startedAt)}`,
        'POST'
      )

      const id = data.shift_id

      setShiftId(id)
      setBreakId(null)
      setMessage(data.message)

      await Promise.all([
        refreshDashboard(id),
        refreshActivities(id),
        refreshCurrentShiftBreaks(id),
        refreshShiftHistory(),
      ])
    })
  }

  function startBreak() {
    return handleAction(async () => {
      const startedAt = getLocalDateTime()

      const data = await apiRequest(
        `${API}/shifts/${shiftId}/breaks?started_at=${encodeURIComponent(startedAt)}`,
        'POST'
      )

      setBreakId(data.break_id)
      setMessage(data.message)

      await refreshDashboard()
      await refreshActivities()
      await refreshCurrentShiftBreaks()
    })
  }

  function endBreak() {
    return handleAction(async () => {
      const endedAt = getLocalDateTime()

      const data = await apiRequest(
        `${API}/breaks/${breakId}/end?ended_at=${encodeURIComponent(endedAt)}`,
        'PUT'
      )

      setBreakId(null)
      setMessage(data.message)

      await refreshDashboard()
      await refreshActivities()
      await refreshCurrentShiftBreaks()
    })
  }

  function endShift() {
    return handleAction(async () => {
      const endedAt = getLocalDateTime()

      const data = await apiRequest(
        `${API}/shifts/${shiftId}/end?ended_at=${encodeURIComponent(endedAt)}`,
        'PUT'
      )

      setShiftId(null)
      setBreakId(null)
      setDashboard(null)
      setActivities([])
      setCurrentShiftBreaks([])
      setMessage(data.message)

      await refreshShiftHistory()
    })
  }

  function logCaffeine() {
    return handleAction(async () => {
      const loggedAt = getLocalDateTime()

      const data = await apiRequest(
        `${API}/shifts/${shiftId}/caffeine?amount_mg=${caffeineAmount}&logged_at=${encodeURIComponent(loggedAt)}`,
        'POST'
      )

      setCaffeineAmount('')
      setMessage(data.message)

      await refreshDashboard()
      await refreshActivities()
      await refreshShiftHistory()
    })
  }

  function logWater() {
    return handleAction(async () => {
      const loggedAt = getLocalDateTime()

      const data = await apiRequest(
        `${API}/shifts/${shiftId}/hydration?amount_ml=${waterAmount}&logged_at=${encodeURIComponent(loggedAt)}`,
        'POST'
      )

      setWaterAmount('')
      setMessage(data.message)

      await refreshDashboard()
      await refreshActivities()
      await refreshShiftHistory()
    })
  }

  function logSleep() {
    return handleAction(async () => {
      const loggedAt = getLocalDateTime()

      const url = `${API}/sleep?sleep_hours=${sleepHours}&logged_at=${encodeURIComponent(loggedAt)}&notes=${encodeURIComponent(sleepNotes)}`

      const data = await apiRequest(url, 'POST')

      setSleepHours('')
      setSleepNotes('')
      setMessage(data.message)

      await refreshSleepRecords()
    })
  }

  function submitAlertnessCheck() {
    return handleAction(async () => {
      const params = new URLSearchParams({
        alertness_level: alertnessLevel,
        feeling_sleepy: String(feelingSleepy),
        difficulty_focusing: String(difficultyFocusing),
        checked_at: getLocalDateTime(),
      })

      const data = await apiRequest(
        `${API}/alertness-check?${params.toString()}`,
        'POST'
      )

      setAlertnessResult(data)
      setMessage(
        language === 'es'
          ? 'Evaluación del estado de alerta guardada correctamente.'
          : 'Alertness check saved successfully.'
      )

      await refreshAlertnessHistory()
    })
  }

  const active = dashboard?.shift_status === 'active'
  const onBreak = Boolean(breakId)

  const averageAlertness = alertnessHistory.length
    ? (
        alertnessHistory.reduce(
          (total, record) => total + Number(record.alertness_level), 0
        ) / alertnessHistory.length
      ).toFixed(1)
    : '—'

  const averageSleep = sleepRecords.length
    ? (
        sleepRecords.reduce(
          (total, record) => total + Number(record[1]), 0
        ) / sleepRecords.length
      ).toFixed(1)
    : '—'

  const totalCaffeine = chartData.reduce(
    (total, shift) => total + Number(shift.caffeine || 0), 0
  )

  const totalWater = chartData.reduce(
    (total, shift) => total + Number(shift.water || 0), 0
  )

  const latestAlertness = alertnessHistory[0]

  const lastCompletedBreak = currentShiftBreaks
    .filter(record => record[3])
    .sort((a, b) => new Date(b[3]) - new Date(a[3]))[0]

  const minutesSinceBreak = lastCompletedBreak
    ? Math.floor((Date.now() - new Date(lastCompletedBreak[3])) / 60000)
    : 0

  let restRecommendation = {
    status: 'info',
    title: t.monitorRest,
    message: t.monitorRestMessage,
  }

  if (latestAlertness?.status === 'warning') {
    restRecommendation = {
      status: 'warning',
      title: t.stopRest,
      message: t.stopRestMessage,
    }
  } else if (latestAlertness?.status === 'caution') {
    restRecommendation = {
      status: 'caution',
      title: t.considerBreak,
      message: t.considerBreakMessage,
    }
  } else if (shiftId && active && minutesSinceBreak >= 120) {
    restRecommendation = {
      status: 'caution',
      title: t.breakReminder,
      message: t.breakReminderMessage,
    }
  }

  const locale = language === 'es' ? 'es-ES' : 'en-GB'

  return (
    <div className="app">
      <header>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
          marginBottom: '15px',
        }}>
          <button
            onClick={() => changeLanguage('en')}
            disabled={language === 'en'}
          >
            English
          </button>

          <button
            onClick={() => changeLanguage('es')}
            disabled={language === 'es'}
          >
            Español
          </button>
        </div>

        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </header>

      <main>
        <section className="welcome">
          <h2>{t.welcome}</h2>
          <p>{t.welcomeText}</p>
        </section>

        <section className="dashboard">
          <div className="card">
            <h3>{t.shiftStatus}</h3>
            <p>
              {restoringSession
                ? t.checking
                : dashboard?.shift_status
                  ? dashboard.shift_status === 'active' ? t.active : dashboard.shift_status
                  : t.notStarted}
            </p>
          </div>

          <div className="card">
            <h3>{t.shiftId}</h3>
            <p>{shiftId ? `#${shiftId}` : '—'}</p>
          </div>

          <div className="card">
            <h3>{t.workedHours}</h3>
            <p>{dashboard?.hours_worked ?? 0}</p>
          </div>

          <div className="card">
            <h3>{t.breakTime}</h3>
            <p>{dashboard?.completed_break_time_minutes ?? 0} {t.minutes}</p>
          </div>

          <div className="card">
            <h3>{t.waterIntake}</h3>
            <p>{dashboard?.total_water_ml ?? 0} ml</p>
          </div>

          <div className="card">
            <h3>{t.caffeine}</h3>
            <p>{dashboard?.total_caffeine_mg ?? 0} mg</p>
          </div>
        </section>

        <section className="actions">
          <h2>{t.shiftControls}</h2>

          {restoringSession ? (
            <p>{t.restoring}</p>
          ) : !shiftId ? (
            <button onClick={startShift} disabled={loading}>
              {t.startShift}
            </button>
          ) : !active ? (
            <p>
              {language === 'es'
                ? 'No se pudo confirmar el estado del turno. Actualiza la página.'
                : 'Shift status could not be confirmed. Try refreshing the page.'}
            </p>
          ) : onBreak ? (
            <button onClick={endBreak} disabled={loading}>
              {t.endBreak}
            </button>
          ) : (
            <>
              <button onClick={startBreak} disabled={loading}>
                {t.startBreak}
              </button>

              <button onClick={endShift} disabled={loading}>
                {t.endShift}
              </button>
            </>
          )}

          {shiftId && (
            <button
              onClick={() => handleAction(async () => {
                await refreshDashboard()
                await refreshActivities()
                await refreshCurrentShiftBreaks()
                await refreshShiftHistory()
              })}
              disabled={loading || restoringSession}
            >
              {t.refreshData}
            </button>
          )}
        </section>

        <section className="card">
          <h2>{t.safetySummary}</h2>
          <p className="section-description">{t.overallStats}</p>

          <button className="no-print" onClick={exportWeeklyReport}>
            {t.exportPDF}
          </button>

          <div className="dashboard">
            <div className="card">
              <h3>{t.completedShifts}</h3>
              <p>{safetySummary.completedShifts}</p>
            </div>
            <div className="card">
              <h3>{t.totalHours}</h3>
              <p>{safetySummary.totalHours}</p>
            </div>
            <div className="card">
              <h3>{t.totalBreaks}</h3>
              <p>{safetySummary.totalBreaks}</p>
            </div>
            <div className="card">
              <h3>{t.averageHours}</h3>
              <p>{safetySummary.averageHours}</p>
            </div>
          </div>
        </section>

        <section className="card" id="weekly-report-print">
          <h2>{t.weeklyReport}</h2>
          <p className="section-description">{t.weeklyDescription}</p>

          <div className="weekly-report">
            {weeklyReport.map(day => (
              <div className="activity-item" key={day.date}>
                <h3>
                  {new Date(`${day.date}T12:00:00`).toLocaleDateString(
                    locale,
                    { weekday: 'long', day: 'numeric', month: 'short' }
                  )}
                </h3>
                <p><strong>{t.hoursWorked}:</strong> {day.hours.toFixed(2)}</p>
                <p><strong>{t.breaks}:</strong> {day.breaks}</p>
                <p><strong>{t.caffeine}:</strong> {day.caffeine} mg</p>
                <p><strong>{t.waterIntake}:</strong> {day.water} ml</p>
              </div>
            ))}
          </div>
        </section>

        <section className="charts-section">
          <h2>{t.performance}</h2>
          <p className="section-description">{t.performanceDescription}</p>

          {chartData.length === 0 ? (
            <div className="card">
              <p>{t.noChartData}</p>
            </div>
          ) : (
            <div className="charts-grid">
              <div className="card chart-card">
                <h3>{t.shiftDuration}</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="shift" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hours" name={t.hoursWorkedChart} fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card chart-card">
                <h3>{t.caffeineConsumption}</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="shift" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="caffeine" name={t.caffeineMg} fill="#9333ea" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card chart-card">
                <h3>{t.waterChart}</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="shift" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="water" name={t.waterMl} fill="#0891b2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <button
            onClick={() => handleAction(refreshShiftHistory)}
            disabled={loading || restoringSession}
          >
            {t.refreshCharts}
          </button>
        </section>

        <section className="card">
          <h2>{t.insights}</h2>
          <p className="section-description">{t.insightsDescription}</p>

          <div className="dashboard">
            <div className="card">
              <h3>{t.averageAlertness}</h3>
              <p>{averageAlertness}/5</p>
              <small>{alertnessHistory.length} {t.checksRecorded}</small>
            </div>
            <div className="card">
              <h3>{t.averageSleep}</h3>
              <p>{averageSleep} {language === 'es' ? 'horas' : 'hours'}</p>
              <small>{sleepRecords.length} {t.records}</small>
            </div>
            <div className="card">
              <h3>{t.totalHours.replace('Hours Worked', 'Hours Worked') === t.totalHours ? t.caffeine : t.caffeine}</h3>
              <p>{totalCaffeine} mg</p>
            </div>
            <div className="card">
              <h3>{t.waterIntake}</h3>
              <p>{totalWater} ml</p>
            </div>
            <div className="card">
              <h3>{t.completedShifts}</h3>
              <p>{safetySummary.completedShifts}</p>
            </div>
            <div className="card">
              <h3>{t.recordedBreaks}</h3>
              <p>{safetySummary.totalBreaks}</p>
            </div>
          </div>

          <p className="safety-note">
            {language === 'es'
              ? 'Estas estadísticas describen la actividad registrada y la información que has comunicado. No predicen la fatiga ni determinan si estás en condiciones de conducir.'
              : 'These statistics describe recorded activity and self-reported information. They do not predict fatigue or determine fitness to drive.'}
          </p>
        </section>

        <section className="card">
          <h2>{t.recommendations}</h2>
          <p className="section-description">{t.recommendationsDescription}</p>

          <div className={`alertness-result ${restRecommendation.status}`}>
            <h3>{restRecommendation.title}</h3>
            <p>{restRecommendation.message}</p>
          </div>

          <div className="activity-item">
            <p>
              <strong>{t.timeSinceBreak}</strong>{' '}
              {lastCompletedBreak
                ? calculateDuration(lastCompletedBreak[3], null, language)
                : t.noCompletedBreak}
            </p>
            <p>
              <strong>{t.latestAlertness}</strong>{' '}
              {latestAlertness
                ? `${latestAlertness.alertness_level}/5`
                : t.noAlertnessCheck}
            </p>
          </div>

          <p className="safety-note">{t.safetyReminder}</p>

          <button
            onClick={() => handleAction(async () => {
              await refreshAlertnessHistory()
              await refreshCurrentShiftBreaks()
              if (shiftId) await refreshDashboard()
            })}
            disabled={loading}
          >
            {t.refreshRecommendations}
          </button>
        </section>

        <section className="card">
          <h2>{t.fatigueTrends}</h2>
          <p className="section-description">{t.fatigueDescription}</p>

          {alertnessHistory.length === 0 ? (
            <p>{t.noAlertnessRecords}</p>
          ) : (
            <div className="chart-card">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[...alertnessHistory].reverse().map(record => ({
                    ...record,
                    time: new Date(record.checked_at).toLocaleString(locale),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="alertness_level"
                    name={t.selfReportedAlertness}
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <p className="safety-note">{t.fatigueNote}</p>

          <button
            onClick={() => handleAction(refreshAlertnessHistory)}
            disabled={loading}
          >
            {t.refreshTrends}
          </button>
        </section>

        <section className="card">
          <h2>{t.caffeineTimeline}</h2>
          <p className="section-description">{t.caffeineDescription}</p>

          {!shiftId ? (
            <p>{t.startShiftTimeline}</p>
          ) : activities.filter(activity =>
              String(activity.type).toLowerCase().includes('caffeine')
            ).length === 0 ? (
            <p>{t.noCaffeine}</p>
          ) : (
            <div className="activity-list">
              {activities
                .filter(activity =>
                  String(activity.type).toLowerCase().includes('caffeine')
                )
                .map(activity => (
                  <div className="activity-item" key={activity.id}>
                    <strong>{activity.type}</strong>
                    <p>{activity.details}</p>
                    <small>{formatDate(activity.time, language)}</small>
                  </div>
                ))}
            </div>
          )}
        </section>

        <section className="card activity-history">
          <details className="shift-history-dropdown">
            <summary>
              {t.shiftHistory} ({shiftHistory.length} {t.shifts})
            </summary>

            <p>{t.previousShifts}</p>

            {shiftHistory.length === 0 ? (
              <p>{t.noShifts}</p>
            ) : (
              <div>
                {shiftHistory.map(shift => {
                  const id = shift[0]
                  const startedAt = shift[1]
                  const endedAt = shift[2]
                  const isActive = !endedAt
                  const isSelected = selectedShiftId === id

                  return (
                    <div className="activity-item" key={id}>
                      <strong>Shift #{id}</strong>
                      <p><strong>{t.status}:</strong> {isActive ? t.active : t.completed}</p>
                      <p><strong>{t.started}:</strong> {formatDate(startedAt, language)}</p>
                      <p><strong>{t.ended}:</strong> {formatDate(endedAt, language)}</p>
                      <p><strong>{t.duration}:</strong> {calculateDuration(startedAt, endedAt, language)}</p>

                      <button
                        onClick={() =>
                          isSelected ? closeShiftDetails() : viewShiftDetails(id)
                        }
                        disabled={loading}
                      >
                        {isSelected ? t.hideDetails : t.viewDetails}
                      </button>

                      {isSelected && (
                        <div className="shift-details">
                          <h3>{t.shiftDetails} #{id}</h3>

                          {!selectedShiftDashboard ? (
                            <p>{t.loadingDetails}</p>
                          ) : (
                            <>
                              <div className="dashboard">
                                <div className="card">
                                  <h3>{t.workingHours}</h3>
                                  <p>{selectedShiftDashboard.hours_worked ?? 0}</p>
                                </div>
                                <div className="card">
                                  <h3>{t.breakTime}</h3>
                                  <p>{selectedShiftDashboard.completed_break_time_minutes ?? 0} {t.minutes}</p>
                                </div>
                                <div className="card">
                                  <h3>{t.caffeine}</h3>
                                  <p>{selectedShiftDashboard.total_caffeine_mg ?? 0} mg</p>
                                </div>
                                <div className="card">
                                  <h3>{t.waterIntake}</h3>
                                  <p>{selectedShiftDashboard.total_water_ml ?? 0} ml</p>
                                </div>
                              </div>

                              <h3>{t.breakHistory}</h3>

                              {selectedShiftBreaks.length === 0 ? (
                                <p>{t.noBreaks}</p>
                              ) : (
                                <div className="activity-list">
                                  {selectedShiftBreaks.map(record => (
                                    <div className="activity-item" key={record[0]}>
                                      <strong>Break #{record[0]}</strong>
                                      <p>{t.started}: {formatDate(record[2], language)}</p>
                                      <p>
                                        {t.ended}: {record[3]
                                          ? formatDate(record[3], language)
                                          : t.currentlyActive}
                                      </p>
                                      <p>
                                        {t.duration}: {calculateDuration(record[2], record[3], language)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <h3>{t.recordedActivities}</h3>

                              {selectedShiftActivities.length === 0 ? (
                                <p>{t.noActivitiesForShift}</p>
                              ) : (
                                selectedShiftActivities.map(activity => (
                                  <div
                                    className="activity-item"
                                    key={`${activity.type}-${activity.id}`}
                                  >
                                    <strong>{activity.type}</strong>
                                    <p>{activity.details}</p>
                                    <small>{activity.time || '—'}</small>
                                  </div>
                                ))
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <button
              onClick={() => handleAction(refreshShiftHistory)}
              disabled={loading || restoringSession}
            >
              {t.refreshHistory}
            </button>
          </details>
        </section>

        <section className="card activity-history">
          <h2>{t.activityHistory}</h2>
          <p>{t.recentActivities}</p>

          {!shiftId ? (
            <p>{t.startToTrack}</p>
          ) : activities.length === 0 ? (
            <p>{t.noActivities}</p>
          ) : (
            <div>
              {activities.map(activity => (
                <div
                  className="activity-item"
                  key={`${activity.type}-${activity.id}`}
                >
                  <strong>{activity.type}</strong>
                  <p>{activity.details}</p>
                  <small>{activity.time || '—'}</small>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => handleAction(refreshActivities)}
            disabled={loading || restoringSession || !shiftId}
          >
            {t.refreshActivity}
          </button>
        </section>

        {shiftId && active && (
          <section className="logging-section">
            <h2>{t.healthTracking}</h2>

            <div className="card">
              <h3>{t.logCaffeine}</h3>
              <input
                type="number"
                min="1"
                placeholder={t.amountMg}
                value={caffeineAmount}
                onChange={e => setCaffeineAmount(e.target.value)}
              />
              <button
                onClick={logCaffeine}
                disabled={loading || !caffeineAmount || Number(caffeineAmount) <= 0}
              >
                {t.saveCaffeine}
              </button>
            </div>

            <div className="card">
              <h3>{t.logWater}</h3>
              <input
                type="number"
                min="1"
                placeholder={t.amountMl}
                value={waterAmount}
                onChange={e => setWaterAmount(e.target.value)}
              />
              <button
                onClick={logWater}
                disabled={loading || !waterAmount || Number(waterAmount) <= 0}
              >
                {t.saveWater}
              </button>
            </div>
          </section>
        )}

        <section className="logging-section">
          <h2>{t.sleepTracking}</h2>

          <div className="card">
            <h3>{t.recordSleep}</h3>

            <input
              type="number"
              min="0.1"
              max="24"
              step="0.1"
              placeholder={t.sleepHours}
              value={sleepHours}
              onChange={e => setSleepHours(e.target.value)}
            />

            <input
              type="text"
              placeholder={t.sleepNotes}
              value={sleepNotes}
              onChange={e => setSleepNotes(e.target.value)}
            />

            <button
              onClick={logSleep}
              disabled={loading || !sleepHours || Number(sleepHours) <= 0 || Number(sleepHours) > 24}
            >
              {t.saveSleep}
            </button>
          </div>

          <div className="card">
            <h3>{t.recentSleep}</h3>

            {sleepRecords.length === 0 ? (
              <p>{t.noSleep}</p>
            ) : (
              sleepRecords.slice(0, 5).map(record => (
                <p key={record[0]}>
                  {record[1]} {language === 'es' ? 'horas' : 'hours'} — {formatDate(record[2], language)}
                  {record[3] ? ` (${record[3]})` : ''}
                </p>
              ))
            )}

            <button
              onClick={() => handleAction(refreshSleepRecords)}
              disabled={loading}
            >
              {t.refreshSleep}
            </button>
          </div>
        </section>

        <section className="logging-section">
          <h2>{t.alertnessCheck}</h2>

          <div className="card">
            <h3>{t.howAlert}</h3>

            <select
              value={alertnessLevel}
              onChange={e => setAlertnessLevel(e.target.value)}
            >
              <option value="1">1 - {t.verySleepy}</option>
              <option value="2">2 - {t.sleepy}</option>
              <option value="3">3 - {t.moderatelyAlert}</option>
              <option value="4">4 - {t.alert}</option>
              <option value="5">5 - {t.veryAlert}</option>
            </select>

            <label>
              <input
                type="checkbox"
                checked={feelingSleepy}
                onChange={e => setFeelingSleepy(e.target.checked)}
              />
              {t.feelingSleepy}
            </label>

            <label>
              <input
                type="checkbox"
                checked={difficultyFocusing}
                onChange={e => setDifficultyFocusing(e.target.checked)}
              />
              {t.difficultyFocusing}
            </label>

            <button onClick={submitAlertnessCheck} disabled={loading}>
              {t.submitAlertness}
            </button>

            {alertnessResult && (
              <div className={`alertness-result ${alertnessResult.status}`}>
                <h3>
                  {alertnessResult.status === 'warning'
                    ? `⚠️ ${t.alertnessWarning}`
                    : t.alertnessResult}
                </h3>

                <p><strong>{t.alertnessLevel}</strong> {alertnessResult.alertness_level}/5</p>
                <p><strong>{t.feelingSleepy}:</strong> {alertnessResult.feeling_sleepy ? t.yes : t.no}</p>
                <p><strong>{t.difficultyFocusing}:</strong> {alertnessResult.difficulty_focusing ? t.yes : t.no}</p>
                <p><strong>{t.recommendation}</strong> {alertnessResult.recommendation}</p>

                <p className="safety-note">
                  {alertnessResult.safety_note}
                </p>
              </div>
            )}
          </div>
        </section>

        {loading && <p>{t.processing}</p>}
        {restoringSession && <p>{t.restoringSession}</p>}
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
      </main>
    </div>
  )
}

export default App