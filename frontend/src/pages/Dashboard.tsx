import { Link } from "react-router-dom"
import Navigation from "../components/layout/Navigation"

function Dashboard() {
  return (
    <div>
      <Navigation />

      <main>
        <h1>FlowForge Dashboard</h1>

        <p>
          Your centralized workspace for organizations, projects,
          tasks and collaboration.
        </p>

        <section>
          <h2>Workspace</h2>

          <Link to="/organizations">
            <button>Organizations</button>
          </Link>

          <Link to="/projects">
            <button>Projects</button>
          </Link>

          <Link to="/tasks">
            <button>Tasks</button>
          </Link>
        </section>

        <section>
          <h2>Collaboration</h2>

          <Link to="/comments">
            <button>Comments</button>
          </Link>

          <Link to="/members">
            <button>Members</button>
          </Link>
        </section>

        <section>
          <h2>Account</h2>

          <Link to="/settings">
            <button>Settings</button>
          </Link>
        </section>
      </main>
    </div>
  )
}

export default Dashboard
