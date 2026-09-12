import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../services/auth"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleLogin() {
    try {
      const data = await loginUser(email, password)

      localStorage.setItem("flowforge_token", data.token)

      alert("Login successful!")

      navigate("/dashboard")
    } catch (error) {
      console.error(error)
      alert("Login failed!")
    }
  }

  return (
    <div>
      <h1>Login to FlowForge</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login
