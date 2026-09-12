import { useState } from "react"
import { registerUser } from "../services/auth"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleRegister() {
    try {
      const data = await registerUser(name, email, password)
      console.log(data)
      alert("Registration successful!")
    } catch (error) {
      console.error(error)
      alert("Registration failed!")
    }
  }

  return (
    <div>
      <h1>Create your FlowForge account</h1>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

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

      <button onClick={handleRegister}>Register</button>
    </div>
  )
}

export default Register
