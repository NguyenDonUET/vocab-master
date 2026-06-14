import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { DashboardPage } from '@/app/pages/DashboardPage'
import { StudyPage } from '@/app/pages/StudyPage'
import { AppLayout } from '@/components/layout/AppLayout'

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<StudyPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
