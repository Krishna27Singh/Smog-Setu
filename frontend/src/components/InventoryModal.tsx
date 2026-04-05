import { useState } from "react";
import { X } from "lucide-react";

interface InventoryFormData {
  itemName: string;
  totalStock: number;
  deployed: number;
  category: string;
}

interface InventoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InventoryFormData) => void;
  initialData?: InventoryFormData & { _id?: string };
  loading?: boolean;
}

const categories = ["masks", "purifiers", "oxygen", "medical", "other"];

export default function InventoryModal({ open, onClose, onSubmit, initialData, loading }: InventoryModalProps) {
  const [form, setForm] = useState<InventoryFormData>(
    initialData || { itemName: "", totalStock: 0, deployed: 0, category: "other" }
  );

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md border border-border rounded-md bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-bold text-foreground">
            {initialData?._id ? "Edit Item" : "Add Item"}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Item Name</label>
            <input
              type="text"
              required
              value={form.itemName}
              onChange={(e) => setForm({ ...form, itemName: e.target.value })}
              className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="e.g. N95 Masks"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Total Stock</label>
              <input
                type="number"
                required
                min={0}
                value={form.totalStock}
                onChange={(e) => setForm({ ...form, totalStock: Number(e.target.value) })}
                className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Deployed</label>
              <input
                type="number"
                required
                min={0}
                value={form.deployed}
                onChange={(e) => setForm({ ...form, deployed: Number(e.target.value) })}
                className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-sm bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
