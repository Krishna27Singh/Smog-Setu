import { useState, useRef, useCallback } from "react";
import { Upload, AlertTriangle, ShieldCheck, Send, Loader2, CheckCircle } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

export default function Scanner() {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [result, setResult] = useState<{ location: string; needs: string; quantity: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      return;
    }
    setUploading(true);
    setResult(null);
    try {
      const res = await api.uploadScan(file);
      setResult(res.parsed);
      toast.success(`Survey parsed! Task created for ${res.parsed.location}`);
    } catch {
      toast.error("Upload failed — backend may be offline");
    } finally {
      setUploading(false);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">Data Ingestion Portal</h2>

      {/* Upload dropzone */}
      <div className="border border-border rounded-md bg-card p-6">
        <h3 className="text-sm font-bold text-foreground mb-3">Paper-to-Digital Upload</h3>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`flex flex-col items-center justify-center rounded-sm border-2 border-dashed bg-secondary py-12 px-4 cursor-pointer transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
              <p className="text-sm font-medium text-foreground">Processing with Gemini AI...</p>
            </>
          ) : result ? (
            <>
              <CheckCircle className="h-10 w-10 text-primary mb-3" />
              <p className="text-sm font-medium text-foreground">Survey Parsed Successfully</p>
              <p className="text-xs text-muted-foreground mt-1">
                Location: {result.location} • Needs: {result.quantity} {result.needs}
              </p>
              <p className="text-xs text-primary mt-2 hover:underline">Click to upload another</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">Upload Field Survey Photo for AI Processing</p>
              <p className="text-xs text-muted-foreground mt-1">Drag & drop or click to browse — JPG, PNG up to 10MB</p>
              <p className="text-xs text-muted-foreground mt-3 italic">Powered by Gemini API (backend)</p>
            </>
          )}
        </div>
      </div>

      {/* Quick SOS */}
      <div className="border border-border rounded-md bg-card p-6">
        <h3 className="text-sm font-bold text-foreground mb-4">Quick SOS Form</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Sector 22, near bus stand"
              className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the situation..."
              className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="flex items-center gap-1.5 rounded-sm bg-destructive px-3 py-2 text-xs font-medium text-destructive-foreground hover:opacity-90 transition-opacity">
              <AlertTriangle className="h-3.5 w-3.5" />
              Report Smoke Spike
            </button>
            <button className="flex items-center gap-1.5 rounded-sm bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity">
              <ShieldCheck className="h-3.5 w-3.5" />
              Request Masks
            </button>
            <button className="flex items-center gap-1.5 rounded-sm border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors">
              <Send className="h-3.5 w-3.5" />
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
