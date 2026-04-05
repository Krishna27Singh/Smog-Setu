import { MapPin, AlertTriangle } from "lucide-react";

const urgentZones = [
  { id: 1, location: "Sector 4 - Elderly Home", aqi: 450, level: "Severe+" },
  { id: 2, location: "Sector 17 - Children's Park", aqi: 380, level: "Severe" },
  { id: 3, location: "Industrial Area Phase II", aqi: 320, level: "Very Poor" },
  { id: 4, location: "Sector 22 - Market Complex", aqi: 250, level: "Very Poor" },
  { id: 5, location: "NH-44 Toll Junction", aqi: 210, level: "Poor" },
];

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Predictive Heatmap</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map placeholder */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center rounded-md border border-border bg-secondary min-h-[400px]">
          <MapPin className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-muted-foreground">Google Maps Air Quality Component</p>
          <p className="text-xs text-muted-foreground mt-1">Map integration will be injected here</p>
        </div>

        {/* Urgency panel */}
        <div className="border border-border rounded-md bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h3 className="text-sm font-bold text-foreground">High Urgency Zones</h3>
          </div>
          <div className="divide-y divide-border">
            {urgentZones.map((z) => (
              <div key={z.id} className="px-4 py-3 flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{z.location}</p>
                  <p className="text-xs text-muted-foreground">{z.level}</p>
                </div>
                <span
                  className={`shrink-0 rounded-sm px-2 py-0.5 text-xs font-bold ${
                    z.aqi >= 400
                      ? "bg-destructive text-destructive-foreground"
                      : z.aqi >= 300
                      ? "bg-warning text-warning-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  AQI {z.aqi}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
