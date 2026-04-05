import { auth } from "@/lib/firebase";

const BASE_URL = "http://localhost:3003/api";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API Error: ${res.status}`);
  }
  return res.json();
}

export interface InventoryItem {
  _id: string;
  itemName: string;
  totalStock: number;
  deployed: number;
  available: number;
  category: string;
}

export interface TaskItem {
  _id: string;
  title: string;
  requiredResource: string;
  quantity: number;
  location: string;
  status: "Unassigned" | "In Transit" | "Delivered";
  urgency: "Critical" | "High" | "Medium";
  assignedVolunteer?: string;
}

export interface ScanResult {
  parsed: {
    location: string;
    needs: string;
    quantity: number;
    urgency: string;
    notes?: string;
  };
  task: TaskItem;
}

export const api = {
  // Inventory
  getInventory: () => request<InventoryItem[]>("/inventory"),
  createInventory: (data: Omit<InventoryItem, "_id" | "available">) =>
    request<InventoryItem>("/inventory", { method: "POST", body: JSON.stringify(data) }),
  updateInventory: (id: string, data: Partial<InventoryItem>) =>
    request<InventoryItem>(`/inventory/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteInventory: (id: string) =>
    request<{ message: string }>(`/inventory/${id}`, { method: "DELETE" }),

  // Tasks
  getTasks: () => request<TaskItem[]>("/tasks"),
  createTask: (data: Omit<TaskItem, "_id">) =>
    request<TaskItem>("/tasks", { method: "POST", body: JSON.stringify(data) }),
  matchVolunteer: (taskId: string) =>
    request<{ task: TaskItem; match: unknown }>("/tasks/match", {
      method: "POST",
      body: JSON.stringify({ taskId }),
    }),

  registerNgo: (name: string) =>
    request("/ngos/register", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  // Scanner
  uploadScan: (file: File) => {
    return new Promise<ScanResult>(async (resolve, reject) => {
      try {
        const headers: Record<string, string> = {};
        const user = auth.currentUser;
        if (user) {
          headers["Authorization"] = `Bearer ${await user.getIdToken()}`;
        }
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(`${BASE_URL}/scanner/upload`, {
          method: "POST",
          headers,
          body: formData,
        });
        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
        resolve(await res.json());
      } catch (err) {
        reject(err);
      }
    });
  },
};
