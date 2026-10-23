import { Compass } from "lucide-react";
import { useDating } from "../state/useDating";
import { api } from "../api";
import SwipeProfileCard from "../components/cards/SwipeProfileCard";
export default function DiscoverPage() {
  const { current, setFilters, f, update, busy } = useDating();
  return (
    <>
      {current ? (
        <SwipeProfileCard key={current.id} current={current} />
      ) : (
        <div className="dating-empty">
          <Compass size={44} />
          <h2>Вы посмотрели все анкеты</h2>
          <p>Измените фильтры или посмотрите пропущенные снова.</p>
          <button className="d-primary" onClick={() => setFilters({ ...f })}>
            Изменить фильтры
          </button>
          <button onClick={() => update(api.restart)} disabled={busy}>
            Вернуть пропущенные
          </button>
        </div>
      )}
    </>
  );
}
