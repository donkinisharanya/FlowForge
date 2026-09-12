import { useEffect, useState } from "react"
import { getCurrentUser } from "../services/auth"

function Profile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then((data) => setUser(data.user || data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main>
        <h1>Profile</h1>
        <p>Loading profile...</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Profile</h1>

      <section>
        <h2>{user?.name || "User"}</h2>
        <p>Email: {user?.email || "Not available"}</p>
        <p>User ID: {user?.id || "Not available"}</p>
      </section>
    </main>
  )
}

export default Profile
