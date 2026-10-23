import { HeartHandshake } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function EmptyState({ text }: { text: string }) {
  const navigate = useNavigate();
  return (
    <div className="dating-empty">
      <HeartHandshake size={44} />
      <h2>{text}</h2>
      <p>Новые знакомства начинаются с одного лайка.</p>
      <button className="d-primary" onClick={() => navigate("/")}>
        Смотреть анкеты
      </button>
    </div>
  );
}
