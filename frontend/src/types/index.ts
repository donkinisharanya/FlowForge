export interface Organization {
  id: string
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface Project {
  id: string
  name: string
  organizationId: string
  createdAt?: string
  updatedAt?: string
}

export interface Task {
  id: string
  title: string
  status: string
  priority: string
  projectId: string
  createdAt?: string
  updatedAt?: string
}
