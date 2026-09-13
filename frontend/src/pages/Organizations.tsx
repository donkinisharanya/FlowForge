import { useEffect, useState } from "react";
import {
  createOrganization,
  getOrganizations,
  type Organization,
} from "../services/organizations";

export default function Organizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadOrganizations() {
    try {
      setLoading(true);
      const data = await getOrganizations();
      setOrganizations(data);
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load organizations",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrganizations();
  }, []);

  async function handleCreate() {
    if (!name.trim()) return;

    try {
      await createOrganization(name.trim());
      setName("");
      setMessage("Organization created successfully");
      await loadOrganizations();
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create organization",
      );
    }
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h1>Organizations</h1>
          <p>Manage your FlowForge organizations.</p>
        </div>
      </div>

      <div className="formPanel">
        <h2>Create organization</h2>

        <div className="inlineForm">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Organization name"
          />

          <button onClick={handleCreate}>
            Create
          </button>
        </div>

        {message && <p>{message}</p>}
      </div>

      {loading ? (
        <div className="emptyPage">
          <p>Loading organizations...</p>
        </div>
      ) : organizations.length === 0 ? (
        <div className="emptyPage">
          <div>
            <div className="emptyIcon">🏢</div>
            <h2>No organizations yet</h2>
            <p>Create your first organization above.</p>
          </div>
        </div>
      ) : (
        <div className="projectGrid">
          {organizations.map((organization) => (
            <div className="projectCard" key={organization.id}>
              <div className="projectCardTop">
                <span className="roleBadge">ORGANIZATION</span>
              </div>

              <h2>{organization.name}</h2>

              <p>
                Organization ID: {organization.id}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
