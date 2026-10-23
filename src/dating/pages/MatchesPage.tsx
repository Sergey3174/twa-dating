import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDating } from "../state/useDating";
import { api } from "../api";
import { telegram } from "../telegram";
import MatchRow from "../components/cards/MatchRow";
import EmptyState from "../components/EmptyState";
import type { Person } from "../api";
export default function MatchesPage() {
  const { matches, busy, update } = useDating();
  const [openMatch, setOpenMatch] = useState<number | null>(null);
  const navigate = useNavigate(),
    location = useLocation();
  const setDetail = (p: Person) =>
    navigate("/people/" + p.id, { state: { from: location.pathname } });
  return (
    <>
      {matches.length === 0 ? (
        <EmptyState text="Всё ещё впереди" />
      ) : (
        <div className="d-match-list">
          {matches.map((p) => (
            <MatchRow
              key={p.id}
              person={p}
              busy={busy}
              open={openMatch === p.id}
              onToggle={(open) => setOpenMatch(open ? p.id : null)}
              onProfile={() => setDetail(p)}
              onTelegram={telegram}
              onUnmatch={() => {
                if (window.confirm(`Убрать взаимную симпатию с ${p.name}?`))
                  void update(
                    () => api.unmatch(p.id),
                    "Взаимная симпатия удалена",
                  );
              }}
              onReport={() => {
                const reason = window.prompt(
                  "Причина жалобы на анкету " + p.name,
                );
                if (reason?.trim())
                  void update(
                    () => api.report(p.id, reason.trim()),
                    "Жалоба сохранена в демо-режиме",
                  );
              }}
            />
          ))}
        </div>
      )}
      {matches.length > 0 && (
        <p className="d-muted d-note">
          Демо-анкеты: «Написать в ТГ» открывает выбор получателя в Telegram.
        </p>
      )}
    </>
  );
}
