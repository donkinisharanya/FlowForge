import { useEffect, useState } from "react"
import { createProject, getProjects } from "../services/projects"

function Projects() {
  const [projects, setProjects] = useState<any[]>([])
  const [name, setName] = useState("")
  const [organizationId, setOrganizationId] = useState("")

  async function loadProjects() {
    try {
      const data = await getProjects()
      setProjects(data.projects || data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  async function handleCreate() {
    if (!name.trim() || !organizationId.trim()) {
      alert("Enter project name and organization ID")
      return
    }

    try {
      await createProject(name, organizationId)
      setName("")
      await loadProjects()
    } catch (error) {
      console.error(error)
      alert("Failed to create project")
    }
  }

  return (
    <main>
      <h1>Projects</h1>

      <input
        placeholder="Project name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Organization ID"
        value={organizationId}
        onChange={(e) => setOrganizationId(e.target.value)}
      />

      <button onClick={handleCreate}>Create Project</button>

      {projects.map((project) => (
        <div key={project.id}>
          <h2>{project.name}</h2>
          <p>{project.id}</p>
        </div>
      ))}
    </main>
  )
}

export default Projects
