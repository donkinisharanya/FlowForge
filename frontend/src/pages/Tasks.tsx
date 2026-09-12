import { useState } from "react"
import { createTask, deleteTask, getTasks, updateTask } from "../services/tasks"

function Tasks() {
  const [projectId, setProjectId] = useState("")
  const [tasks, setTasks] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState(false)

  async function load() {
    if (!projectId.trim()) return

    setLoading(true)

    try {
      const data = await getTasks(projectId)
      setTasks(data.tasks || [])
    } catch (error) {
      console.error(error)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  async function create() {
    if (!title.trim() || !projectId.trim()) {
      alert("Enter project ID and task title")
      return
    }

    try {
      await createTask(title, projectId)
      setTitle("")
      await load()
    } catch (error) {
      console.error(error)
      alert("Could not create task")
    }
  }

  async function status(id: string, value: string) {
    try {
      await updateTask(id, { status: value })
      await load()
    } catch (error) {
      console.error(error)
    }
  }

  async function remove(id: string) {
    try {
      await deleteTask(id)
      await load()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main>
      <h1>Tasks</h1>

      <section>
        <input
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />

        <button onClick={load}>Load Tasks</button>

        <input
          placeholder="New task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button onClick={create}>Create Task</button>
      </section>

      {loading && <p>Loading tasks...</p>}

      {tasks.map((task) => (
        <section key={task.id}>
          <h2>{task.title}</h2>

          <p>Priority: {task.priority}</p>

          <select
            value={task.status}
            onChange={(e) => status(task.id, e.target.value)}
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="IN_REVIEW">IN REVIEW</option>
            <option value="DONE">DONE</option>
          </select>

          <button onClick={() => remove(task.id)}>Delete</button>
        </section>
      ))}
    </main>
  )
}

export default Tasks
