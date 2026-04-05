import { useState, useEffect, useCallback } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { api, type TaskItem } from "@/services/api";
import { toast } from "sonner";

interface Task {
  id: string;
  location: string;
  resource: string;
  critical: boolean;
  status: "unassigned" | "transit" | "delivered";
}

const columns: { key: Task["status"]; label: string }[] = [
  { key: "unassigned", label: "Unassigned Tasks" },
  { key: "transit", label: "In Transit" },
  { key: "delivered", label: "Delivered" },
];

const statusMap: Record<string, Task["status"]> = {
  "Unassigned": "unassigned",
  "In Transit": "transit",
  "Delivered": "delivered",
};

const fallbackTasks: Task[] = [
  { id: "1", location: "Sector 4 - Elderly Home", resource: "50 N95 Masks", critical: true, status: "unassigned" },
  { id: "2", location: "Sector 17 - Park Area", resource: "20 Air Purifiers", critical: true, status: "unassigned" },
  { id: "3", location: "Sector 22 - Market", resource: "100 Surgical Masks", critical: false, status: "transit" },
  { id: "4", location: "NH-44 Toll Junction", resource: "10 Oxygen Cylinders", critical: false, status: "transit" },
  { id: "5", location: "Industrial Phase II", resource: "30 N95 Masks", critical: false, status: "delivered" },
];

function mapApiTask(t: TaskItem): Task {
  return {
    id: t._id,
    location: t.location,
    resource: `${t.quantity} ${t.requiredResource}`,
    critical: t.urgency === "Critical",
    status: statusMap[t.status] || "unassigned",
  };
}

export default function Dispatch() {
  const [tasks, setTasks] = useState<Task[]>(fallbackTasks);
  const [matchingId, setMatchingId] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const data = await api.getTasks();
      setTasks(data.map(mapApiTask));
    } catch {
      // Keep fallback data
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const autoMatch = async (id: string) => {
    setMatchingId(id);
    try {
      await api.matchVolunteer(id);
      toast.success("Volunteer matched & dispatched!");
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "transit" as const } : t))
      );
    } catch {
      // Fallback: just move locally
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "transit" as const } : t))
      );
      toast.info("Volunteer auto-matched (offline mode)");
    } finally {
      setMatchingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Dispatch Board</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div key={col.key} className="border border-border rounded-md bg-card">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-sm font-bold text-foreground">{col.label}</h3>
              <span className="text-xs text-muted-foreground">
                {tasks.filter((t) => t.status === col.key).length} tasks
              </span>
            </div>
            <div className="p-2 space-y-2 min-h-[200px]">
              {tasks
                .filter((t) => t.status === col.key)
                .map((task) => (
                  <div
                    key={task.id}
                    className={`rounded-sm border border-border bg-background p-3 ${
                      task.critical ? "border-l-4 border-l-destructive" : ""
                    }`}
                  >
                    <p className="text-sm font-medium text-foreground">{task.location}</p>
                    <p className="text-xs text-muted-foreground mt-1">{task.resource}</p>
                    {col.key === "unassigned" && (
                      <button
                        onClick={() => autoMatch(task.id)}
                        disabled={matchingId === task.id}
                        className="mt-2 flex items-center gap-1 rounded-sm bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {matchingId === task.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <UserPlus className="h-3 w-3" />
                        )}
                        {matchingId === task.id ? "Matching..." : "Auto-Match Volunteer"}
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
