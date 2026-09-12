import { Link } from "react-router-dom"

function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/dashboard">Back to Dashboard</Link>
    </main>
  )
}

export default NotFound
