import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "./services/auth";
import {
  getOrganizations,
  createOrganization,
  type Organization,
} from "./services/organizations";
import {
  getProjects,
  createProject,
  deleteProject,
  type Project,
} from "./services/projects";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  type Task,
  type TaskStatus,
} from "./services/tasks";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("flowforge_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      const token =
        data?.token ??
        data?.accessToken ??
        data?.data?.token ??
        data?.data?.accessToken;

      if (!token) {
        throw new Error("Login succeeded but no token was returned.");
      }

      localStorage.setItem("flowforge_token", token);

      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.authCard}>
        <div style={styles.logo}>F</div>

        <h1 style={styles.title}>FlowForge</h1>
        <p style={styles.subtitle}>
          Project Management Platform
        </p>

        <form onSubmit={handleLogin}>
          <label style={styles.label}>Email</label>

          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label style={styles.label}>Password</label>

          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          {error && <div style={styles.error}>{error}</div>}

          <button
            style={styles.primaryButton}
            disabled={loading}
            type="submit"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account?{" "}
          <button
            style={styles.linkButton}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await registerUser(name, email, password);

      navigate("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.authCard}>
        <div style={styles.logo}>F</div>

        <h1 style={styles.title}>Create Account</h1>

        <p style={styles.subtitle}>
          Start using FlowForge
        </p>

        <form onSubmit={handleRegister}>
          <label style={styles.label}>Name</label>

          <input
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />

          <label style={styles.label}>Email</label>

          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label style={styles.label}>Password</label>

          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create password"
            required
          />

          {error && <div style={styles.error}>{error}</div>}

          <button
            style={styles.primaryButton}
            disabled={loading}
            type="submit"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <button
            style={styles.linkButton}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const [orgName, setOrgName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadOrganizations() {
    try {
      const data = await getOrganizations();

      setOrganizations(data);

      if (data.length > 0) {
        setSelectedOrganization(data[0]);
      }
    } catch (error) {
      console.error(error);
      setMessage("Could not load organizations.");
    } finally {
      setLoading(false);
    }
  }

  async function loadProjects(organizationId: string) {
    try {
      const data = await getProjects(organizationId);

      setProjects(data);

      if (data.length > 0) {
        setSelectedProject(data[0]);
      } else {
        setSelectedProject(null);
      }
    } catch (error) {
      console.error(error);
      setMessage("Could not load projects.");
    }
  }

  async function loadTasks(projectId: string) {
    try {
      const data = await getTasks(projectId);

      setTasks(data);
    } catch (error) {
      console.error(error);
      setMessage("Could not load tasks.");
    }
  }

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    if (selectedOrganization) {
      loadProjects(selectedOrganization.id);
    }
  }, [selectedOrganization]);

  useEffect(() => {
    if (selectedProject) {
      loadTasks(selectedProject.id);
    } else {
      setTasks([]);
    }
  }, [selectedProject]);

  async function handleCreateOrganization() {
    if (!orgName.trim()) return;

    try {
      await createOrganization(orgName.trim());

      setOrgName("");
      await loadOrganizations();

      setMessage("Organization created.");
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ||
          "Could not create organization.",
      );
    }
  }

  async function handleCreateProject() {
    if (!projectName.trim() || !selectedOrganization) return;

    try {
      await createProject(
        projectName.trim(),
        "",
        selectedOrganization.id,
      );

      setProjectName("");

      await loadProjects(selectedOrganization.id);

      setMessage("Project created.");
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ||
          "Could not create project.",
      );
    }
  }

  async function handleCreateTask() {
    if (!taskTitle.trim() || !selectedProject) return;

    try {
      await createTask(
        taskTitle.trim(),
        selectedProject.id,
      );

      setTaskTitle("");

      await loadTasks(selectedProject.id);

      setMessage("Task created.");
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ||
          "Could not create task.",
      );
    }
  }

  async function handleStatusChange(
    taskId: string,
    status: TaskStatus,
  ) {
    try {
      await updateTask(taskId, { status });

      if (selectedProject) {
        await loadTasks(selectedProject.id);
      }
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ||
          "Could not update task.",
      );
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      await deleteTask(taskId);

      if (selectedProject) {
        await loadTasks(selectedProject.id);
      }

      setMessage("Task deleted.");
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ||
          "Could not delete task.",
      );
    }
  }

  async function handleDeleteProject(projectId: string) {
    try {
      await deleteProject(projectId);

      if (selectedOrganization) {
        await loadProjects(selectedOrganization.id);
      }

      setMessage("Project deleted.");
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ||
          "Could not delete project.",
      );
    }
  }

  function logout() {
    localStorage.removeItem("flowforge_token");
    navigate("/login");
  }

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        Loading FlowForge...
      </div>
    );
  }

  return (
    <div style={styles.dashboardPage}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.smallLogo}>F</div>

          <div>
            <div style={styles.brandName}>FlowForge</div>
            <div style={styles.brandSubtitle}>
              Project Management Platform
            </div>
          </div>
        </div>

        <button
          style={styles.logoutButton}
          onClick={logout}
        >
          Logout
        </button>
      </header>

      <main style={styles.dashboardContent}>
        <div style={styles.welcome}>
          <div>
            <h1 style={styles.dashboardTitle}>
              Dashboard
            </h1>

            <p style={styles.dashboardSubtitle}>
              Manage your organizations, projects and tasks.
            </p>
          </div>
        </div>

        {message && (
          <div style={styles.message}>
            {message}
          </div>
        )}

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              Organizations
            </h2>
          </div>

          <div style={styles.createRow}>
            <input
              style={styles.smallInput}
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="New organization name"
            />

            <button
              style={styles.primaryButtonSmall}
              onClick={handleCreateOrganization}
            >
              + Create
            </button>
          </div>

          <div style={styles.cardGrid}>
            {organizations.map((organization) => (
              <button
                key={organization.id}
                onClick={() =>
                  setSelectedOrganization(organization)
                }
                style={{
                  ...styles.organizationCard,
                  ...(selectedOrganization?.id ===
                  organization.id
                    ? styles.selectedCard
                    : {}),
                }}
              >
                <strong>{organization.name}</strong>

                <span style={styles.cardId}>
                  {organization.id}
                </span>
              </button>
            ))}

            {organizations.length === 0 && (
              <div style={styles.empty}>
                No organizations yet.
              </div>
            )}
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              Projects
            </h2>

            {selectedOrganization && (
              <span style={styles.context}>
                {selectedOrganization.name}
              </span>
            )}
          </div>

          {selectedOrganization ? (
            <>
              <div style={styles.createRow}>
                <input
                  style={styles.smallInput}
                  value={projectName}
                  onChange={(e) =>
                    setProjectName(e.target.value)
                  }
                  placeholder="New project name"
                />

                <button
                  style={styles.primaryButtonSmall}
                  onClick={handleCreateProject}
                >
                  + Create
                </button>
              </div>

              <div style={styles.cardGrid}>
                {projects.map((project) => (
                  <div
                    key={project.id}
                    style={{
                      ...styles.projectCard,
                      ...(selectedProject?.id ===
                      project.id
                        ? styles.selectedCard
                        : {}),
                    }}
                  >
                    <button
                      style={styles.projectSelect}
                      onClick={() =>
                        setSelectedProject(project)
                      }
                    >
                      <strong>{project.name}</strong>

                      <span style={styles.cardId}>
                        {project.id}
                      </span>
                    </button>

                    <button
                      style={styles.deleteButton}
                      onClick={() =>
                        handleDeleteProject(project.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                ))}

                {projects.length === 0 && (
                  <div style={styles.empty}>
                    No projects yet.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={styles.empty}>
              Create or select an organization first.
            </div>
          )}
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              Tasks
            </h2>

            {selectedProject && (
              <span style={styles.context}>
                {selectedProject.name}
              </span>
            )}
          </div>

          {selectedProject ? (
            <>
              <div style={styles.createRow}>
                <input
                  style={styles.smallInput}
                  value={taskTitle}
                  onChange={(e) =>
                    setTaskTitle(e.target.value)
                  }
                  placeholder="New task title"
                />

                <button
                  style={styles.primaryButtonSmall}
                  onClick={handleCreateTask}
                >
                  + Create Task
                </button>
              </div>

              <div style={styles.taskList}>
                {tasks.map((task) => (
                  <div
                    className="taskCard"
                    key={task.id}
                    style={styles.taskCard}
                  >
                    <div style={styles.taskMain}>
                      <div
                        style={{
                          ...styles.taskTitle,
                          ...(task.status === "DONE"
                            ? styles.doneTask
                            : {}),
                        }}
                      >
                        {task.title}
                      </div>

                      <div style={styles.taskMeta}>
                        <span>{task.priority}</span>
                        <span>{task.status}</span>
                      </div>
                    </div>

                    <select
                      value={task.status}
                      onChange={(event) =>
                        handleStatusChange(
                          task.id,
                          event.target.value as TaskStatus,
                        )
                      }
                      style={styles.select}
                    >
                      <option value="TODO">
                        TODO
                      </option>

                      <option value="IN_PROGRESS">
                        IN PROGRESS
                      </option>

                      <option value="IN_REVIEW">
                        IN REVIEW
                      </option>

                      <option value="DONE">
                        DONE
                      </option>
                    </select>

                    <button
                      style={styles.deleteButton}
                      onClick={() =>
                        handleDeleteTask(task.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div style={styles.empty}>
                    No tasks yet.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={styles.empty}>
              Create or select a project first.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb",
    fontFamily: "Inter, Arial, sans-serif",
    padding: "24px",
    boxSizing: "border-box",
  },

  authCard: {
    width: "100%",
    maxWidth: "430px",
    background: "#ffffff",
    borderRadius: "20px",
    padding: "40px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
    boxSizing: "border-box",
  },

  logo: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    background: "#111827",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "28px",
    fontWeight: 800,
    marginBottom: "20px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    color: "#111827",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "8px",
    marginBottom: "30px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "18px",
    fontWeight: 600,
    color: "#374151",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
  },

  primaryButton: {
    width: "100%",
    marginTop: "22px",
    padding: "14px",
    border: 0,
    borderRadius: "10px",
    background: "#111827",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
  },

  primaryButtonSmall: {
    padding: "12px 18px",
    border: 0,
    borderRadius: "9px",
    background: "#111827",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
  },

  linkButton: {
    border: 0,
    background: "none",
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: 700,
  },

  switchText: {
    textAlign: "center",
    marginTop: "22px",
    color: "#6b7280",
  },

  error: {
    marginTop: "15px",
    padding: "11px",
    background: "#fef2f2",
    color: "#b91c1c",
    borderRadius: "8px",
    fontSize: "14px",
  },

  loadingPage: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    fontSize: "20px",
  },

  dashboardPage: {
    minHeight: "100vh",
    background: "#f5f7fb",
    fontFamily: "Inter, Arial, sans-serif",
  },

  header: {
    height: "72px",
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
    boxSizing: "border-box",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  smallLogo: {
    width: "40px",
    height: "40px",
    borderRadius: "11px",
    background: "#111827",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 800,
    fontSize: "20px",
  },

  brandName: {
    fontWeight: 800,
    color: "#111827",
  },

  brandSubtitle: {
    fontSize: "12px",
    color: "#6b7280",
  },

  logoutButton: {
    padding: "9px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#ffffff",
    cursor: "pointer",
    fontWeight: 600,
  },

  dashboardContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "35px 24px 70px",
  },

  welcome: {
    marginBottom: "28px",
  },

  dashboardTitle: {
    margin: 0,
    fontSize: "32px",
    color: "#111827",
  },

  dashboardSubtitle: {
    color: "#6b7280",
    marginTop: "7px",
  },

  message: {
    background: "#eff6ff",
    color: "#1d4ed8",
    padding: "12px 15px",
    borderRadius: "9px",
    marginBottom: "20px",
  },

  section: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "22px",
    boxShadow: "0 5px 25px rgba(0,0,0,0.04)",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "18px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "21px",
    color: "#111827",
  },

  context: {
    fontSize: "13px",
    color: "#6b7280",
    background: "#f3f4f6",
    padding: "6px 10px",
    borderRadius: "7px",
  },

  createRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "18px",
  },

  smallInput: {
    flex: 1,
    padding: "12px 13px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "12px",
  },

  organizationCard: {
    textAlign: "left",
    border: "1px solid #e5e7eb",
    borderRadius: "11px",
    background: "#ffffff",
    padding: "16px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  projectCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "11px",
    background: "#ffffff",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  projectSelect: {
    flex: 1,
    border: 0,
    background: "transparent",
    textAlign: "left",
    cursor: "pointer",
    padding: "7px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  selectedCard: {
    border: "2px solid #111827",
  },

  cardId: {
    color: "#9ca3af",
    fontSize: "11px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  deleteButton: {
    border: "1px solid #fecaca",
    background: "#fff1f2",
    color: "#b91c1c",
    borderRadius: "8px",
    padding: "8px 11px",
    cursor: "pointer",
    fontWeight: 600,
  },

  empty: {
    padding: "25px",
    textAlign: "center",
    color: "#9ca3af",
    border: "1px dashed #d1d5db",
    borderRadius: "10px",
  },

  taskList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  taskCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    border: "1px solid #e5e7eb",
    borderRadius: "11px",
    padding: "14px",
  },

  taskMain: {
    flex: 1,
  },

  taskTitle: {
    fontWeight: 700,
    color: "#111827",
  },

  doneTask: {
    textDecoration: "line-through",
    color: "#9ca3af",
  },

  taskMeta: {
    display: "flex",
    gap: "8px",
    marginTop: "6px",
    fontSize: "12px",
    color: "#6b7280",
  },

  select: {
    padding: "8px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#ffffff",
  },
};

export default App;
