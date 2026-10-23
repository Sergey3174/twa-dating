import ProfileContent from "../profile/ProfileContent";
import { useRef, useState } from "react";
import { Heart, MapPin, X } from "lucide-react";
import { useDating } from "../../state/useDating";

import type { Person } from "../../api";
export default function SwipeProfileCard({
  current,
  own = false,
  goal,
}: {
  current: Person;
  own?: boolean;
  goal?: string;
}) {
  const { busy, swipe } = useDating();
  const [drag, setDrag] = useState(0);
  const pivot = useRef(300);
  const start = useRef<{
    x: number;
    y: number;
    axis: string;
  } | null>(null);
  return (
    <article
      className="d-swipe-profile"
      key={current.id}
      style={{
        transform: `translateX(${drag}px) rotate(${Math.max(-12, Math.min(12, drag / 22))}deg)`,
        transformOrigin: `50% ${pivot.current}px`,
      }}
      onPointerDown={(e) => {
        if (
          own ||
          busy ||
          !e.isPrimary ||
          (e.target as HTMLElement).closest("button")
        )
          return;
        pivot.current =
          e.clientY - e.currentTarget.getBoundingClientRect().top + 120;
        start.current = { x: e.clientX, y: e.clientY, axis: "" };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const g = start.current;
        if (!g) return;
        const dx = e.clientX - g.x,
          dy = e.clientY - g.y;
        if (!g.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 10)
          g.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? "x" : "y";
        if (g.axis === "x") setDrag(dx);
      }}
      onPointerCancel={() => {
        start.current = null;
        setDrag(0);
      }}
      onPointerUp={(e) => {
        const g = start.current;
        start.current = null;
        setDrag(0);
        if (g?.axis === "x" && Math.abs(e.clientX - g.x) > 85)
          swipe(current, e.clientX > g.x);
      }}
    >
      <div className="d-card d-card--hero">
        <img draggable={false} src={current.photo} alt={current.name} />
        <span className="d-online">
          {own
            ? "Моя анкета"
            : `Открыт${current.gender === "Женщины" ? "а" : ""} к знакомству`}
        </span>
        <div className="d-card-info">
          <h1>
            {current.name}, {current.age}
          </h1>
          <p>
            <MapPin size={14} /> {current.city}
            {!own && ` · ${current.distance} км`}
          </p>
          {!own && (
            <div className="d-hero-actions">
              <button
                className="d-hero-skip"
                aria-label="Пропустить"
                title="Пропустить"
                disabled={busy}
                onClick={() => swipe(current, false)}
              >
                <X size={28} />
              </button>
              <button
                className="d-hero-like"
                aria-label="Нравится"
                title="Нравится"
                disabled={busy}
                onClick={() => swipe(current, true)}
              >
                <Heart size={28} />
              </button>
            </div>
          )}
          {current.interests.length > 0 && (
            <section className="d-hero-interests">
              <h2>О чём можем поговорить</h2>
              <div className="d-tags">
                {current.interests.map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <ProfileContent person={current} own={own} goal={goal} />
      {!own && (
        <div className="d-actions">
          <button
            aria-label="Пропустить"
            disabled={busy}
            onClick={() => swipe(current, false)}
          >
            <X size={28} />
          </button>
          <span>
            Влево — пропустить
            <br />
            Вправо — нравится
          </span>
          <button
            className="d-like"
            aria-label="Нравится"
            disabled={busy}
            onClick={() => swipe(current, true)}
          >
            <Heart size={28} />
          </button>
        </div>
      )}
    </article>
  );
}
