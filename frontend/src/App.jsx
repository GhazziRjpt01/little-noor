import { MotionConfig } from 'framer-motion'
import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LanguageProvider from './components/LanguageProvider.jsx'
import MainLayout from './layouts/MainLayout.jsx'

const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const KalimasPage = lazy(() => import('./pages/KalimasPage.jsx'))
const AzkarPage = lazy(() => import('./pages/AzkarPage.jsx'))
const TasbeehPage = lazy(() => import('./pages/TasbeehPage.jsx'))
const QuizPage = lazy(() => import('./pages/QuizPage.jsx'))
const GamesPage = lazy(() => import('./pages/GamesPage.jsx'))
const AiTeacherPage = lazy(() => import('./pages/AiTeacherPage.jsx'))
const ParentDashboardPage = lazy(() => import('./pages/ParentDashboardPage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="kalimas" element={<KalimasPage />} />
              <Route path="azkar" element={<AzkarPage />} />
              <Route path="tasbeeh" element={<TasbeehPage />} />
              <Route path="quiz" element={<QuizPage />} />
              <Route path="games" element={<GamesPage />} />
              <Route path="ai-teacher" element={<AiTeacherPage />} />
              <Route path="parent" element={<ParentDashboardPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </MotionConfig>
  )
}
