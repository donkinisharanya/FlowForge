import { useEffect, useState } from "react"
import { createOrganization, getOrganizations } from "../services/organizations"

function Organizations() {
  const [organizations, setOrganizations] = useState<any[]>([])
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(true)

  async function loadOrganizations() {
    try {
      const data = await getOrganizations()
      setOrganizations(data.organizations || data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrganizations()
  }, [])

  async function handleCreate() {
    if (!name.trim()) return

    try {
      await createOrganization(name)
      setName("")
      await loadOrganizations()
    } catch (error) {
      console.error(error)
      alert("Failed to create organization")
    }
  }

  return (
    <div>
      <h1>Organizations</h1>

      <input
        value={name}
        placeholder="Organization name"
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={handleCreate}>Create Organization</button>

      {loading && <p>Loading...</p>}

      {!loading && organizations.length === 0 && (
        <p>No organizations yet.</p>
      )}

      {organizations.map((organization) => (
        <div key={organization.id}>
          <h2>{organization.name}</h2>
          <p>ID: {organization.id}</p>
        </div>
      ))}
    </div>
  )
}

export default Organizations
