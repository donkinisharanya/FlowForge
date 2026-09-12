import { Link } from "react-router-dom"

function Sidebar() {
  return (
    <aside>
      <h2>FlowForge</h2>

      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <br />
        <Link to="/organizations">Organizations</Link>
        <br />
        <Link to="/projects">Projects</Link>
        <br />
        <Link to="/tasks">Tasks</Link>
        <br />
        <Link to="/settings">Settings</Link>
      </nav>
    </aside>
  )
}

export default Sidebar
