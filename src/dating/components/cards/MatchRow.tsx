import { useRef, useState } from "react";
import type { Person } from "../../api";
import { Flag, X } from "lucide-react";
type Props = {
  person: Person;
  busy: boolean;
  open: boolean;
  onToggle: (open: boolean) => void;
  onProfile: () => void;
  onTelegram: () => void;
  onUnmatch: () => void;
  onReport: () => void;
};
export default function MatchRow({
  person,
  busy,
  open,
  onToggle,
  onProfile,
  onTelegram,
  onUnmatch,
  onReport,
}: Props) {
  const gesture = useRef<{
    x: number;
    y: number;
    axis: string;
    offset: number;
  } | null>(null);
  const moved = useRef(false);
  const [offset, setOffset] = useState<number | null>(null);
  return (
    <article className="d-match">
      <div className="d-match-actions" aria-hidden={!open}>
        <button
          className="d-match-unmatch"
          disabled={busy}
          tabIndex={open ? 0 : -1}
          onClick={onUnmatch}
        >
          <Flag size={18} />
          <span>Анматч</span>
        </button>
        <button
          className="d-match-report"
          disabled={busy}
          tabIndex={open ? 0 : -1}
          onClick={onReport}
        >
          <X size={18} />
          <span>Репорт</span>
        </button>
        <button
          className="d-match-write"
          disabled={busy}
          tabIndex={open ? 0 : -1}
          aria-label="Написать в Telegram"
          onClick={onTelegram}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M21.4 3.7 18.2 20c-.24 1.15-.88 1.43-1.78.89l-4.9-3.61-2.36 2.28c-.26.26-.48.48-.98.48l.35-4.98L17.6 6.8c.4-.35-.09-.55-.62-.2L5.77 13.66.94 12.15c-1.05-.33-1.07-1.05.22-1.55L20.05 3.3c.88-.32 1.65.2 1.35.4Z" />
          </svg>
          <span>Написать</span>
        </button>
      </div>
      <div
        className="d-match-front"
        style={{
          transform: `translateX(${offset ?? (open ? -240 : 0)}px)`,
          transition: offset === null ? undefined : "none",
        }}
        onPointerDown={(e) => {
          if (
            busy ||
            !e.isPrimary ||
            (e.pointerType === "mouse" && e.button !== 0)
          )
            return;
          moved.current = false;
          gesture.current = {
            x: e.clientX,
            y: e.clientY,
            axis: "",
            offset: open ? -240 : 0,
          };
        }}
        onPointerMove={(e) => {
          const g = gesture.current;
          if (!g) return;
          const dx = e.clientX - g.x,
            dy = e.clientY - g.y;
          if (!g.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 10)
            g.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? "x" : "y";
          if (g.axis === "x") {
            moved.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            setOffset(Math.max(-240, Math.min(0, g.offset + dx)));
          }
        }}
        onPointerUp={(e) => {
          const g = gesture.current;
          if (g?.axis === "x") onToggle(g.offset + e.clientX - g.x < -60);
          gesture.current = null;
          setOffset(null);
        }}
        onPointerCancel={() => {
          gesture.current = null;
          setOffset(null);
        }}
        onClickCapture={(e) => {
          if (moved.current) {
            e.preventDefault();
            e.stopPropagation();
            moved.current = false;
          }
        }}
      >
        <button className="d-match-person" onClick={onProfile}>
          <img src={person.photo} alt="" draggable={false} />
          <span>
            <strong>
              {person.name}, {person.age}
            </strong>
            <small>{person.interests.join(" · ")}</small>
          </span>
        </button>
      </div>
    </article>
  );
}
