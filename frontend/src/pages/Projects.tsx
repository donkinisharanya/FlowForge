import { useEffect, useState } from "react";
import {
  createProject,
  deleteProject,
  getProjects,
  type Project,
} from "../services/projects";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [organizationId, setOrganizationId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadProjects() {
    if (!organizationId.trim()) {
      setProjects([]);
      return;
    }

    try {
      setLoading(true);

      const data = await getProjects(organizationId.trim());

      setProjects(data);
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load projects",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!name.trim() || !organizationId.trim()) {
      setMessage("Organization ID and project name are required.");
      return;
    }

    try {
      await createProject(
        name.trim(),
        description.trim(),
        organizationId.trim(),
      );

      setName("");
      setDescription("");
      setMessage("Project created successfully.");

      await loadProjects();
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create project",
      );
    }
  }

  async function handleDelete(projectId: string) {
    const confirmed = window.confirm(
      "Delete this project?",
    );

    if (!confirmed) return;

    try {
      await deleteProject(projectId);
      await loadProjects();
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete project",
      );
    }
  }

  useEffect(() => {
    loadProjects();
  }, [organizationId]);

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1>Projects</h1>
          <p>Create and manage projects inside an organization.</p>
        </div>
      </div>

      <div className="formPanel">
        <h2>Project setup</h2>

        <input
          value={organizationId}
          onChange={(event) =>
            setOrganizationId(event.target.value)
          }
          placeholder="Organization ID"
        />

        <input
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="Project name"
        />

        <input
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="Project description"
        />

        <button onClick={handleCreate}>
          Create project
        </button>

        <button
          className="secondaryButton"
          onClick={loadProjects}
        >
          Refresh projects
        </button>

        {message && <p>{message}</p>}
      </div>

      {loading ? (
        <div className="emptyPage">
          <p>Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="emptyPage">
          <div>
            <div className="emptyIcon">📁</div>
            <h2>No projects found</h2>
            <p>
              Enter an organization ID to load its projects.
            </p>
          </div>
        </div>
      ) : (
        <div className="projectGrid">
          {projects.map((project) => (
            <div className="projectCard" key={project.id}>
              <div className="projectCardTop">
                <span className="roleBadge">PROJECT</span>

                <button
                  className="dangerButton"
                  onClick={() =>
                    handleDelete(project.id)
                  }
                >
                  Delete
                </button>
              </div>

              <h2>{project.name}</h2>

              <p>
                {project.description ||
                  "No description provided."}
              </p>

              <div className="projectMeta">
                <span>
                  ID: {project.id.slice(0, 8)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
