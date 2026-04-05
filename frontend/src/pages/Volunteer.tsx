import { Navigation, MapPin, Clock, ChevronRight } from "lucide-react";
import { useState } from "react";

const missions = [
  { id: 1, location: "Sector 4 - Elderly Home", distance: "1.2 km", resource: "50 N95 Masks", urgency: "critical", eta: "8 min" },
  { id: 2, location: "Sector 17 - Park Area", distance: "2.5 km", resource: "20 Air Purifiers", urgency: "high", eta: "15 min" },
  { id: 3, location: "Sector 22 - Market", distance: "3.8 km", resource: "100 Surgical Masks", urgency: "medium", eta: "22 min" },
  { id: 4, location: "NH-44 Toll Junction", distance: "5.1 km", resource: "10 Oxygen Cylinders", urgency: "medium", eta: "30 min" },
];

export default function Volunteer() {
  const [activeRoute, setActiveRoute] = useState<number | null>(null);

  if (activeRoute !== null) {
    const mission = missions.find((m) => m.id === activeRoute);
    return (
      <div className="max-w-md mx-auto space-y-4">
        <button
          onClick={() => setActiveRoute(null)}
          className="text-sm text-primary hover:underline"
        >
          ← Back to tasks
        </button>
        <div className="border border-border rounded-md bg-card p-4">
          <h3 className="text-sm font-bold text-foreground mb-1">Routing to: {mission?.location}</h3>
          <p className="text-xs text-muted-foreground mb-4">{mission?.resource} • ETA {mission?.eta}</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-md border border-border bg-secondary min-h-[300px]">
          <Navigation className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-sm font-medium text-muted-foreground">Google Maps Clean Air Route</p>
          <p className="text-xs text-muted-foreground mt-1">Navigation will be rendered here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-lg font-bold text-foreground">Smart Task Feed</h2>
      <p className="text-xs text-muted-foreground">Nearby missions sorted by urgency & proximity</p>
      <div className="space-y-2">
        {missions.map((m) => (
          <div
            key={m.id}
            className={`rounded-sm border border-border bg-card p-4 ${
              m.urgency === "critical" ? "border-l-4 border-l-destructive" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-foreground">{m.location}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.resource}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {m.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    ETA {m.eta}
                  </span>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase ${
                  m.urgency === "critical"
                    ? "bg-destructive text-destructive-foreground"
                    : m.urgency === "high"
                    ? "bg-warning text-warning-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {m.urgency}
              </span>
            </div>
            <button
              onClick={() => setActiveRoute(m.id)}
              className="mt-3 flex w-full items-center justify-center gap-1 rounded-sm bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Accept & Route
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
