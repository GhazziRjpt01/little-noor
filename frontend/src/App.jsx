import { MotionConfig } from 'framer-motion'
import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthProvider from './auth/AuthProvider.jsx'
import ProgressSync from './auth/ProgressSync.jsx'
import RequireAuth from './auth/RequireAuth.jsx'
import LanguageProvider from './components/LanguageProvider.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import { getSupabase } from './services/supabaseClient.js'

const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const KalimasPage = lazy(() => import('./pages/KalimasPage.jsx'))
const KalimaLessonPage = lazy(() => import('./pages/KalimaLessonPage.jsx'))
const AzkarPage = lazy(() => import('./pages/AzkarPage.jsx'))
const TasbeehPage = lazy(() => import('./pages/TasbeehPage.jsx'))
const QuizPage = lazy(() => import('./pages/QuizPage.jsx'))
const GamesPage = lazy(() => import('./pages/GamesPage.jsx'))
const StoriesPage = lazy(() => import('./pages/StoriesPage.jsx'))
const LessonsPage = lazy(() => import('./pages/LessonsPage.jsx'))
const ActivitiesPage = lazy(() => import('./pages/ActivitiesPage.jsx'))
const ReviewPage = lazy(() => import('./pages/ReviewPage.jsx'))
const AiTeacherPage = lazy(() => import('./pages/AiTeacherPage.jsx'))
const ParentDashboardPage = lazy(() => import('./pages/ParentDashboardPage.jsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const SignupPage = lazy(() => import('./pages/SignupPage.jsx'))
const LogoutPage = lazy(() => import('./pages/LogoutPage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))
const LegalPage = lazy(() => import('./pages/LegalPage.jsx'))

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <AuthProvider client={getSupabase()}>
          <ProgressSync />
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="kalimas" element={<KalimasPage />} />
                <Route path="kalimas/:kalimaId" element={<KalimaLessonPage />} />
                <Route path="azkar" element={<AzkarPage />} />
                <Route path="tasbeeh" element={<TasbeehPage />} />
                <Route path="quiz" element={<QuizPage />} />
                <Route path="games" element={<GamesPage />} />
                <Route path="stories" element={<StoriesPage />} />
                <Route path="lessons" element={<LessonsPage />} />
                <Route path="activities" element={<ActivitiesPage />} />
                <Route path="review" element={<ReviewPage />} />
                <Route path="ai-teacher" element={<AiTeacherPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="logout" element={<LogoutPage />} />
                <Route path="privacy" element={<LegalPage kind="privacy" />} />
                <Route path="terms" element={<LegalPage kind="terms" />} />
                <Route path="parental-consent" element={<LegalPage kind="consent" />} />
                <Route element={<RequireAuth />}>
                  <Route path="parent" element={<ParentDashboardPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </MotionConfig>
  )
}
