import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ProjectPage from './pages/ProjectPage'
import TimelinePage from './pages/TimelinePage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"          element={<HomePage />} />
        <Route path="/sobre"     element={<AboutPage />} />
        <Route path="/projeto"   element={<ProjectPage />} />
        <Route path="/timeline"  element={<TimelinePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
    </Routes>
  )
}
