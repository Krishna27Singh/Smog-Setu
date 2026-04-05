import { useState, useEffect, useCallback } from "react";
import { Package, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { api, type InventoryItem } from "@/services/api";
import InventoryModal from "@/components/InventoryModal";
import { toast } from "sonner";

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | undefined>();
  const [saving, setSaving] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const data = await api.getInventory();
      setItems(data);
    } catch {
      // Fallback to static data if backend is not running
      setItems([
        { _id: "1", itemName: "N95 Masks", totalStock: 2400, deployed: 1800, available: 600, category: "masks" },
        { _id: "2", itemName: "Surgical Masks", totalStock: 5000, deployed: 3200, available: 1800, category: "masks" },
        { _id: "3", itemName: "Portable Air Purifiers", totalStock: 120, deployed: 85, available: 35, category: "purifiers" },
        { _id: "4", itemName: "Oxygen Cylinders", totalStock: 60, deployed: 42, available: 18, category: "oxygen" },
        { _id: "5", itemName: "Eye Drops (Saline)", totalStock: 800, deployed: 350, available: 450, category: "medical" },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSubmit = async (data: { itemName: string; totalStock: number; deployed: number; category: string }) => {
    setSaving(true);
    try {
      if (editItem) {
        await api.updateInventory(editItem._id, data);
        toast.success("Item updated");
      } else {
        await api.createInventory(data);
        toast.success("Item added");
      }
      setModalOpen(false);
      setEditItem(undefined);
      fetchItems();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteInventory(id);
      toast.success("Item deleted");
      fetchItems();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Inventory</h2>
        <button
          onClick={() => { setEditItem(undefined); setModalOpen(true); }}
          className="flex items-center gap-1.5 rounded-sm bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Plus className="h-3.5 w-3.5" />
          Update Stock
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="border border-border rounded-md bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-4 py-3 text-left text-xs font-bold text-foreground">Item</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-foreground">Total Stock</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-foreground">Deployed</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-foreground">Available</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((row) => {
                const low = row.available / row.totalStock < 0.2;
                return (
                  <tr key={row._id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-4 py-3 flex items-center gap-2 text-foreground font-medium">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      {row.itemName}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {row.totalStock.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">
                      {row.deployed.toLocaleString()}
                    </td>
                    <td className={`px-4 py-3 text-right font-medium ${low ? "text-destructive" : "text-foreground"}`}>
                      {row.available.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditItem(row); setModalOpen(true); }}
                          className="rounded-sm p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(row._id)}
                          className="rounded-sm p-1.5 text-muted-foreground hover:text-destructive hover:bg-accent transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <InventoryModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditItem(undefined); }}
        onSubmit={handleSubmit}
        initialData={editItem}
        loading={saving}
      />
    </div>
  );
}
