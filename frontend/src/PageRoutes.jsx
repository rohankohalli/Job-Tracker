import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import JobList from './pages/JobList'
import JobDetail from './pages/JobDetail'
import AddJob from './pages/AddJob'
import JobSearch from './pages/JobSearch'
import Login from './pages/Login'
import Register from './pages/Register'

export default function pageRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<JobList />} />
                <Route path="search" element={<JobSearch />} />
                <Route path="addjob" element={<AddJob />} />
                <Route path="jobs/:id" element={<JobDetail />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>

    )
}