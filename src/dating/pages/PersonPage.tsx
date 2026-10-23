import ProfileContent from '../components/profile/ProfileContent';
import { Send } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useDating } from '../state/useDating';
import { telegram } from '../telegram';
import EmptyState from '../components/EmptyState';
export default function PersonPage() {
    const { id } = useParams();
    const { people, matches, state, busy, swipe } = useDating();
    const detail = people.find(p => p.id === Number(id));
    if (!detail)
        return <EmptyState text="Анкета не найдена"/>;
    return (<>
            <div className="d-detail-photo">
              <img src={detail.photo} alt={detail.name}/>
            </div>
            <section className="d-panel">
              <h1>
                {detail.name}, {detail.age}
              </h1>
              <p className="d-muted">
                {detail.city} · {detail.distance} км от вас
              </p>
            </section>
            <ProfileContent person={detail}/>
            {matches.some((p) => p.id === detail.id) ? (<button className="d-primary d-wide" onClick={telegram}>
                <Send size={18}/> Написать в Telegram
              </button>) : (<button className="d-primary d-wide" disabled={busy || state.likes.includes(detail.id)} onClick={() => swipe(detail, true)}>
                {state.likes.includes(detail.id)
                ? "Вы уже поставили лайк"
                : "Поставить лайк"}
              </button>)}
          </>);
}
