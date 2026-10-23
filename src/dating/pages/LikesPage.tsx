import { useNavigate, useLocation } from 'react-router-dom';
import { useDating } from '../state/useDating';
import { api } from '../api';
import type { Person } from '../api';
import PersonCard from '../components/cards/PersonCard';
import EmptyState from '../components/EmptyState';
export default function LikesPage() {
    const { people, state, busy, update } = useDating();
    const liked = people.filter(p => state.likes.includes(p.id));
    const navigate = useNavigate(), location = useLocation();
    const setDetail = (p: Person) => navigate('/people/' + p.id, { state: { from: location.pathname } });
    return (<>
            <div className="d-heading">
              <h1>
                {"Вы сделали первый шаг"}
              </h1>
              <p>
                Анкеты, которые вам понравились
              </p>
            </div>
            {liked.length === 0 ? (<EmptyState text="Пока нет лайков"/>) : (<div className="d-grid">
                {liked.map((p) => (<PersonCard key={p.id} p={p} busy={busy} onOpen={() => setDetail(p)} onRemove={() => update(() => api.swipe(p.id, false), "Лайк удалён")}/>))}
              </div>)}

          </>);
}
