import PageRoutes from "./PageRoutes"
import "./App.css"
import { Analytics } from "@vercel/analytics/next"

function App() {
  return (
    <>
      <Analytics />
      <PageRoutes />
    </>
  )
}

export default App
