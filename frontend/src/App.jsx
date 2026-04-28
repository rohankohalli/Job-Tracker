import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import JobList from './pages/JobList'
import JobDetail from './pages/JobDetail'
import AddJob from './pages/AddJob'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<JobList />} />
        <Route path="add" element={<AddJob />} />
        <Route path="jobs/:id" element={<JobDetail />} />
      </Route>
    </Routes>
  )
}

export default App
