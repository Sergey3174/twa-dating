import type { Person } from '../../api';
export default function PersonCard({ p, busy, onOpen, onRemove }: {
    p: Person;
    busy: boolean;
    onOpen: () => void;
    onRemove: () => void;
}) {
    return (<article className="d-mini">
                    <button onClick={onOpen}>
                      <img src={p.photo} alt={p.name}/>
                      <strong>
                        {p.name}, {p.age}
                      </strong>
                      <small>
                        {p.incoming
            ? "♥ Взаимная симпатия"
            : p.city + " · " + p.distance + " км"}
                      </small>
                    </button>
                    <button disabled={busy} onClick={onRemove}>
                        Убрать лайк
                      </button>
                  </article>);
}
