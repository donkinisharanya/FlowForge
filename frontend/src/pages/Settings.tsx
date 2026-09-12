import { useNavigate } from "react-router-dom"

function Settings() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem("flowforge_token")
    navigate("/login")
  }

  return (
    <main>
      <h1>Settings</h1>

      <section>
        <h2>Account</h2>
        <p>Manage your FlowForge account and security.</p>
      </section>

      <section>
        <h2>Security</h2>
        <button onClick={logout}>Logout</button>
      </section>
    </main>
  )
}

export default Settings
