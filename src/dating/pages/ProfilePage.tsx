import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Pencil,
  Eye,
  SlidersHorizontal,
  Settings,
} from "lucide-react";
import { useDating } from "../state/useDating";
import { selfPhoto } from "../selfProfile";
import { profileCompletion } from "../profileOptions";
export default function ProfilePage() {
  const { state, setFilters } = useDating();
  const navigate = useNavigate();
  const p = state.profile;
  const complete = profileCompletion(p);
  return (
    <>
      <button
        className="d-profile-summary"
        onClick={() => navigate("/profile/me")}
      >
        <div className="d-profile-avatar">
          <img src={p.photos?.[0] || selfPhoto} alt="" />
          <span>{complete}%</span>
        </div>
        <div>
          <h1>
            {p.name}, {p.age}
          </h1>
          <p className="d-muted">Посмотреть мой профиль</p>
        </div>
        <ChevronRight size={20} />
      </button>
      <section className="d-panel">
        <h2>Ваше знакомство начинается здесь</h2>
        <p className="d-muted">Расскажите о себе и о том, что вам нравится.</p>
        <progress
          className="d-profile-progress"
          value={complete}
          max={100}
          aria-label="Заполненность профиля"
        />
        <button
          className="d-primary d-profile-edit"
          onClick={() => navigate("/profile/edit")}
        >
          <Pencil size={16} /> Заполнить профиль
        </button>
      </section>
      <div className="d-panel d-menu">
        <button onClick={() => navigate("/profile/me")}>
          <Eye size={20} /> Моя анкета
          <ChevronRight size={18} />
        </button>
        <button onClick={() => setFilters({ ...state.filters })}>
          <SlidersHorizontal size={20} /> Фильтры поиска
          <ChevronRight size={18} />
        </button>
        <button onClick={() => navigate("/settings")}>
          <Settings size={20} /> Настройки
          <ChevronRight size={18} />
        </button>
      </div>
    </>
  );
}
