import {matchesFilters,filterScore} from '../filterProfiles';
import { createContext, useContext, useEffect, useRef, useState } from "react";

import { api } from "../api";
import type { State, Person, Profile, Filters } from "../api";
export function useDatingState() {
  const [state, setState] = useState<State>();
  const [people, setPeople] = useState<Person[]>([]);
  const [filters, setFilters] = useState<Filters>();
  const [profile, setProfile] = useState<Profile>();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const lock = useRef(false);
  useEffect(() => {
    Promise.all([api.getState(), api.getPeople()])
      .then(([s, p]) => {
        setState(s);
        setPeople(p);
        setProfile(s.profile);
      })
      .catch(() => setError("Не удалось загрузить анкеты. Обновите страницу."));
    const tg = (window as any).Telegram?.WebApp;
    tg?.ready();
    tg?.expand();
    tg?.setHeaderColor?.("#1a2026");
    tg?.setBackgroundColor?.("#1a2026");
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3200);
    return () => clearTimeout(timer);
  }, [notice]);
  async function update(action: () => Promise<State>, message = "") {
    if (lock.current) return false;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const s = await action();
      setState(s);
      if (message) setNotice(message);
      return true;
    } catch {
      setError("Не удалось сохранить изменения. Попробуйте ещё раз.");
      return false;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  const matches = people.filter(
    (p) => state?.likes.includes(p.id) && p.incoming,
  );
  const f = state?.filters;
  const candidates = state && f ? people.filter(p=>!state.skipped.includes(p.id)&&!state.likes.includes(p.id)&&matchesFilters(p,f)).sort((a,b)=>filterScore(a,f)-filterScore(b,f)) : [];
  const current = candidates[0];
  function swipe(p: Person, like: boolean) {
    void update(
      () => api.swipe(p.id, like),
      like
        ? p.incoming
          ? "Это взаимно! Откройте раздел «Взаимно»."
          : "Лайк отправлен"
        : "Анкета пропущена",
    );
  }
  return {
    state,
    people,
    profile,
    setProfile,
    filters,
    setFilters,
    busy,
    notice,
    error,
    update,
    matches,
    f,
    current,
    swipe,
  };
}
export const Context = createContext<ReturnType<typeof useDatingState> | null>(
  null,
);
export function useDating() {
  const value = useContext(Context);
  if (!value || !value.state || !value.profile || !value.f)
    throw new Error("DatingProvider is required");
  return { ...value, state: value.state, profile: value.profile, f: value.f };
}
