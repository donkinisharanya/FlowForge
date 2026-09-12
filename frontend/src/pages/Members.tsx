import { useState } from "react"
import {
  addOrganizationMember,
  getOrganizationMembers,
  removeOrganizationMember,
} from "../services/members"

function Members() {
  const [organizationId, setOrganizationId] = useState("")
  const [userId, setUserId] = useState("")
  const [members, setMembers] = useState<any[]>([])

  async function load() {
    if (!organizationId.trim()) return

    try {
      const data = await getOrganizationMembers(organizationId)
      setMembers(data.members || [])
    } catch (error) {
      console.error(error)
    }
  }

  async function add() {
    if (!organizationId.trim() || !userId.trim()) {
      alert("Enter organization ID and user ID")
      return
    }

    try {
      await addOrganizationMember(organizationId, userId)
      setUserId("")
      await load()
    } catch (error) {
      console.error(error)
      alert("Could not add member")
    }
  }

  async function remove(userIdToRemove: string) {
    try {
      await removeOrganizationMember(
        organizationId,
        userIdToRemove,
      )
      await load()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main>
      <h1>Organization Members</h1>

      <section>
        <input
          placeholder="Organization ID"
          value={organizationId}
          onChange={(e) => setOrganizationId(e.target.value)}
        />

        <button onClick={load}>Load Members</button>

        <input
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <button onClick={add}>Add Member</button>
      </section>

      {members.map((member) => (
        <section key={member.userId}>
          <p>{member.user?.email || member.userId}</p>
          <p>Role: {member.role}</p>
          <button onClick={() => remove(member.userId)}>
            Remove
          </button>
        </section>
      ))}
    </main>
  )
}

export default Members
