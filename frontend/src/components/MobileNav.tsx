import { Map, ClipboardList, Package, ScanLine, UserCircle } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { title: "Map", url: "/dashboard", icon: Map },
  { title: "Dispatch", url: "/dispatch", icon: ClipboardList },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Scanner", url: "/scanner", icon: ScanLine },
  { title: "Volunteer", url: "/volunteer", icon: UserCircle },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.url === "/dashboard"}
            className="flex flex-col items-center gap-0.5 px-2 py-1 text-muted-foreground text-[10px]"
            activeClassName="text-primary font-medium"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
