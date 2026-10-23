import { useLocation, useNavigate } from "react-router-dom";
import { tabs } from "./navigation";
import { useDating } from "../state/useDating";
export default function BottomNav() {
  const { matches } = useDating();
  const location = useLocation(),
    navigate = useNavigate();
  const active =
    location.pathname.startsWith("/profile") ||
    location.pathname === "/settings"
      ? "/profile"
      : location.pathname.startsWith("/people/")
        ? location.state?.from || "/"
        : location.pathname;
  return (
    <nav className="d-nav" aria-label="Основная навигация">
      {tabs.map((t) => (
        <button
          key={t.path}
          aria-current={active === t.path ? "page" : undefined}
          onClick={() => navigate(t.path)}
        >
          <span>
            <t.icon size={22} />
            {t.path === "/matches" && matches.length > 0 && (
              <b>{matches.length}</b>
            )}
          </span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
