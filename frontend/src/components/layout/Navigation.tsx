import { NavLink, useNavigate } from "react-router-dom"

function Navigation() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem("flowforge_token")
    navigate("/login")
  }

  return (
    <header className="navbar">
      <div className="brand">FlowForge</div>

      <nav className="nav-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/organizations">Organizations</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
        <NavLink to="/comments">Comments</NavLink>
        <NavLink to="/members">Members</NavLink>
        <NavLink to="/settings">Settings</NavLink>
        <button onClick={logout}>Logout</button>
      </nav>
    </header>
  )
}

export default Navigation
