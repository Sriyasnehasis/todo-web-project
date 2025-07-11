const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/todos';

export interface Task {
  _id: string;
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  completed: boolean;
  filePath?: string;
}

// Helper to get token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token || ""}`,
  };
};

// GET
export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(API_BASE, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

// POST
export async function createTask(data: {
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  tag: string;
}): Promise<Task> {
  const { title, category, priority, tag } = data;

  const res = await fetch(API_BASE, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      title,
      category,
      priority: priority.toLowerCase(), // Ensure lowercase for backend
      tags: [tag], // Send as array
    }),
  });

  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

// DELETE
export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete task");
}

// TOGGLE
export async function toggleTask(id: string, completed: boolean): Promise<Task> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ completed }),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}
export async function fetchTaskStats(): Promise<{ total: number; completed: number; pending: number }> {
  const res = await fetch(`${API_BASE}/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch task stats");
  return res.json();
}

export const fetchCategoryCounts = async () => {
  const res = await fetch("http://localhost:5000/api/todos/category-count");
  if (!res.ok) throw new Error("Failed to fetch category counts");
  return res.json();
};




export async function fetchTaskStatsByPriority() {
  const res = await fetch("http://localhost:5000/api/todos/stats/priority");
  if (!res.ok) throw new Error("Failed to load priority stats");
  return await res.json();
}





