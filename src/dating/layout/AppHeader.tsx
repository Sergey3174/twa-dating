import { ArrowLeft, SlidersHorizontal, Settings } from "lucide-react";
import { useLocation, useNavigate, useMatch } from "react-router-dom";
import { useDating } from "../state/useDating";
import { tabs } from "./navigation";
export default function AppHeader() {
  const { people, state, setFilters } = useDating();
  const location = useLocation(),
    navigate = useNavigate(),
    match = useMatch("/people/:id");
  const detail = match
    ? people.find((p) => p.id === Number(match.params.id))
    : undefined;
  const path = location.pathname;
  const nested =
    !!match || path === "/settings" || path.startsWith("/profile/");
  const profileArea = path === "/profile";
  const title =
    path === "/settings"
      ? "Настройки"
      : path === "/profile/me"
        ? "Моя анкета"
        : path === "/profile/edit"
          ? "Редактирование профиля"
          : detail?.name ||
            tabs.find((t) => t.path === path)?.label ||
            "Анкета";
  const isHomePage = path === "/";
  return (
    <header className="d-header">
      <button
        aria-label={nested ? "Назад" : "Мой профиль"}
        onClick={() =>
          navigate(
            nested
              ? match
                ? location.state?.from || "/"
                : "/profile"
              : "/profile",
          )
        }
      >
        {nested ? (
          <ArrowLeft />
        ) : (
          <span className="d-avatar">{state.profile.name.slice(0, 1)}</span>
        )}
      </button>
      <div>
        <strong>{nested || profileArea ? title : "TWA Dating"}</strong>
        <small>
          {nested ? "TWA Dating" : title + " · " + state.profile.city}
        </small>
      </div>
      {profileArea ? (
        <button aria-label="Настройки">
          <Settings size={22} />
        </button>
      ) : (
        isHomePage && (
          <button
            aria-label="Фильтры поиска"
            onClick={() => setFilters({ ...state.filters })}
          >
            <SlidersHorizontal size={22} />
          </button>
        )
      )}
    </header>
  );
}
