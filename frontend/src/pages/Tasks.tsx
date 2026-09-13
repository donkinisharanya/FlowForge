import { useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  type Task,
  type TaskStatus,
} from "../services/tasks";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadTasks() {
    if (!projectId.trim()) {
      setTasks([]);
      return;
    }

    try {
      setLoading(true);

      const data = await getTasks(projectId.trim());

      setTasks(data);
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load tasks",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!title.trim() || !projectId.trim()) {
      setMessage("Project ID and task title are required.");
      return;
    }

    try {
      await createTask(
        title.trim(),
        projectId.trim(),
      );

      setTitle("");
      setMessage("Task created successfully.");

      await loadTasks();
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create task",
      );
    }
  }

  async function handleStatusChange(
    id: string,
    value: string,
  ) {
    const status = value as TaskStatus;

    try {
      await updateTask(id, {
        status,
      });

      await loadTasks();
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update task",
      );
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Delete this task?",
    );

    if (!confirmed) return;

    try {
      await deleteTask(id);
      await loadTasks();
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete task",
      );
    }
  }

  useEffect(() => {
    loadTasks();
  }, [projectId]);

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1>Tasks</h1>
          <p>Manage project tasks and workflow status.</p>
        </div>
      </div>

      <div className="formPanel">
        <h2>Task setup</h2>

        <input
          value={projectId}
          onChange={(event) =>
            setProjectId(event.target.value)
          }
          placeholder="Project ID"
        />

        <input
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="Task title"
        />

        <button onClick={handleCreate}>
          Create task
        </button>

        <button
          className="secondaryButton"
          onClick={loadTasks}
        >
          Refresh tasks
        </button>

        {message && <p>{message}</p>}
      </div>

      {loading ? (
        <div className="emptyPage">
          <p>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="emptyPage">
          <div>
            <div className="emptyIcon">✓</div>
            <h2>No tasks found</h2>
            <p>
              Enter a project ID to load its tasks.
            </p>
          </div>
        </div>
      ) : (
        <div className="taskList">
          {tasks.map((task) => (
            <div className="taskCard" key={task.id}>
              <div className="taskMain">
                <div
                  className={`taskTitle ${
                    task.status === "DONE"
                      ? "done"
                      : ""
                  }`}
                >
                  {task.title}
                </div>

                <div className="taskMeta">
                  <span>{task.priority}</span>
                  <span>{task.status}</span>
                </div>
              </div>

              <select
                value={task.status}
                onChange={(event) =>
                  handleStatusChange(
                    task.id,
                    event.target.value,
                  )
                }
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">
                  IN PROGRESS
                </option>
                <option value="IN_REVIEW">
                  IN REVIEW
                </option>
                <option value="DONE">DONE</option>
              </select>

              <button
                className="dangerButton"
                onClick={() =>
                  handleDelete(task.id)
                }
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
