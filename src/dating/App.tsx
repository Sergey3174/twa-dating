import { useEffect, useRef, useState } from "react";
import {
  Heart,
  X,
  SlidersHorizontal,
  User,
  Compass,
  HeartHandshake,
  MapPin,
  ArrowLeft,
  Send,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { api, defaults } from "./api";
import type { Person, State, Profile, Filters } from "./api";
type Tab = "discover" | "likes" | "matches" | "profile";
export default function App() {
  const [state, setState] = useState<State>();
  const [people, setPeople] = useState<Person[]>([]);
  const [tab, setTab] = useState<Tab>("discover");
  const [detail, setDetail] = useState<Person>();
  const [filters, setFilters] = useState<Filters>();
  const [profile, setProfile] = useState<Profile>();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(0);
  const start = useRef<number | null>(null);
  const lock = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
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
    if (filters) dialog.current?.showModal();
    else dialog.current?.close();
  }, [filters]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3200);
    return () => clearTimeout(timer);
  }, [notice]);
  async function update(action: () => Promise<State>, message = "") {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const s = await action();
      setState(s);
      if (message) setNotice(message);
    } catch {
      setError("Не удалось сохранить изменения. Попробуйте ещё раз.");
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  if (!state || !profile)
    return (
      <main className="dating">
        <p role="status">{error || "Загружаем знакомства…"}</p>
      </main>
    );
  const matches = people.filter(
    (p) => state.likes.includes(p.id) && p.incoming,
  );
  const f = state.filters;
  const candidates = people.filter(
    (p) =>
      !state.skipped.includes(p.id) &&
      !state.likes.includes(p.id) &&
      p.age >= f.min &&
      p.age <= f.max &&
      p.distance <= f.distance &&
      (f.gender === "Все" || p.gender === f.gender) &&
      (f.goal === "Любая" || (p.id % 2 ? "Отношения" : "Общение") === f.goal),
  );
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
    setDrag(0);
    setDetail(undefined);
  }
  const tabs = [
    { id: "discover" as Tab, label: "Знакомства", icon: Compass },
    { id: "likes" as Tab, label: "Мои лайки", icon: Heart },
    { id: "matches" as Tab, label: "Взаимно", icon: HeartHandshake },
    { id: "profile" as Tab, label: "Профиль", icon: User },
  ];
  const title = detail ? detail.name : tabs.find((t) => t.id === tab)!.label;
  function telegram() {
    const url =
      "https://t.me/share/url?url=" +
      encodeURIComponent("https://t.me/") +
      "&text=" +
      encodeURIComponent("Привет! Давай познакомимся 👋");
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.openTelegramLink) tg.openTelegramLink(url);
    else window.open(url, "_blank", "noopener,noreferrer");
  }
  const empty = (text: string) => (
    <div className="dating-empty">
      <HeartHandshake size={44} />
      <h2>{text}</h2>
      <p>Новые знакомства начинаются с одного лайка.</p>
      <button className="d-primary" onClick={() => setTab("discover")}>
        Смотреть анкеты
      </button>
    </div>
  );
  return (
    <div className="dating">
      <header className="d-header">
        <button
          aria-label={detail ? "Назад" : "Мой профиль"}
          onClick={() => (detail ? setDetail(undefined) : setTab("profile"))}
        >
          {detail ? (
            <ArrowLeft />
          ) : (
            <span className="d-avatar">{profile.name.slice(0, 1)}</span>
          )}
        </button>
        <div>
          <strong>{detail ? title : "TWA Dating"}</strong>
          <small>
            {detail ? "Анкета и лента" : title + " · " + state.profile.city}
          </small>
        </div>
        <button
          aria-label="Фильтры поиска"
          onClick={() => setFilters({ ...state.filters })}
        >
          <SlidersHorizontal size={22} />
        </button>
      </header>
      <main>
        {error && (
          <p role="alert" className="d-error">
            {error}
          </p>
        )}
        {detail ? (
          <>
            <div className="d-detail-photo">
              <img src={detail.photo} alt={detail.name} />
            </div>
            <section className="d-panel">
              <h1>
                {detail.name}, {detail.age}
              </h1>
              <p className="d-muted">
                {detail.city} · {detail.distance} км от вас
              </p>
              <p>{detail.bio}</p>
              <div className="d-tags">
                {detail.interests.map((x) => (
                  <span key={x}>{x}</span>
                ))}
              </div>
            </section>
            <h2 className="d-section-title">Лента {detail.name}</h2>
            {detail.posts.map((post, i) => (
              <article className="d-panel" key={post}>
                <small className="d-muted">
                  {i ? "На прошлой неделе" : "Сегодня"}
                </small>
                <p>{post}</p>
              </article>
            ))}
            {matches.some((p) => p.id === detail.id) ? (
              <button className="d-primary d-wide" onClick={telegram}>
                <Send size={18} /> Написать в Telegram
              </button>
            ) : (
              <button
                className="d-primary d-wide"
                disabled={busy || state.likes.includes(detail.id)}
                onClick={() => swipe(detail, true)}
              >
                {state.likes.includes(detail.id)
                  ? "Вы уже поставили лайк"
                  : "Поставить лайк"}
              </button>
            )}
          </>
        ) : tab === "discover" ? (
          <>
            <div className="d-heading">
              <div>
                <h1>Кто-то особенный рядом</h1>
                <p>Знакомьтесь в своём ритме</p>
              </div>
            </div>
            <button className="d-filter" onClick={() => setFilters({ ...f })}>
              <SlidersHorizontal size={16} />
              {f.min}–{f.max} лет · до {f.distance} км
              <ChevronRight size={16} />
            </button>
            {current ? (
              <>
                <article
                  className="d-card"
                  style={{
                    transform: `translateX(${drag}px) rotate(${drag / 22}deg)`,
                  }}
                  onPointerDown={(e) => {
                    if (busy) return;
                    start.current = e.clientX;
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e) => {
                    if (start.current !== null)
                      setDrag(e.clientX - start.current);
                  }}
                  onPointerCancel={() => {
                    start.current = null;
                    setDrag(0);
                  }}
                  onPointerUp={(e) => {
                    if (start.current === null) return;
                    const dx = e.clientX - start.current;
                    start.current = null;
                    if (Math.abs(dx) > 85) swipe(current, dx > 0);
                    else {
                      setDrag(0);
                      if (Math.abs(dx) < 8) setDetail(current);
                    }
                  }}
                >
                  <img
                    draggable={false}
                    src={current.photo}
                    alt={current.name}
                  />
                  <span className="d-online">
                    Открыт{current.gender === "Женщины" ? "а" : ""} к знакомству
                  </span>
                  {Math.abs(drag) > 35 && (
                    <span className="d-swipe-label">
                      {drag > 0 ? "НРАВИТСЯ" : "ПРОПУСТИТЬ"}
                    </span>
                  )}
                  <div className="d-card-info">
                    <h1>
                      {current.name}, {current.age}
                    </h1>
                    <p>
                      <MapPin size={14} /> {current.city} · {current.distance}{" "}
                      км
                    </p>
                    <div className="d-tags">
                      {current.interests.map((x) => (
                        <span key={x}>{x}</span>
                      ))}
                    </div>
                    <button
                      onPointerDown={(e) => e.stopPropagation()}
                      onPointerUp={(e) => e.stopPropagation()}
                      onClick={() => setDetail(current)}
                    >
                      Посмотреть анкету и ленту <ChevronRight size={16} />
                    </button>
                  </div>
                </article>
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
              </>
            ) : (
              <div className="dating-empty">
                <Compass size={44} />
                <h2>Вы посмотрели все анкеты</h2>
                <p>Измените фильтры или посмотрите пропущенные снова.</p>
                <button
                  className="d-primary"
                  onClick={() => setFilters({ ...f })}
                >
                  Изменить фильтры
                </button>
                <button onClick={() => update(api.restart)} disabled={busy}>
                  Вернуть пропущенные
                </button>
              </div>
            )}
          </>
        ) : tab === "likes" || tab === "matches" ? (
          <>
            <div className="d-heading">
              <h1>
                {tab === "likes" ? "Вы сделали первый шаг" : "Симпатия взаимна"}
              </h1>
              <p>
                {tab === "likes"
                  ? "Анкеты, которые вам понравились"
                  : "Продолжите знакомство в Telegram"}
              </p>
            </div>
            {(tab === "likes"
              ? people.filter((p) => state.likes.includes(p.id))
              : matches
            ).length === 0 ? (
              empty(tab === "likes" ? "Пока нет лайков" : "Всё ещё впереди")
            ) : (
              <div className="d-grid">
                {(tab === "likes"
                  ? people.filter((p) => state.likes.includes(p.id))
                  : matches
                ).map((p) => (
                  <article key={p.id} className="d-mini">
                    <button onClick={() => setDetail(p)}>
                      <img src={p.photo} alt={p.name} />
                      <strong>
                        {p.name}, {p.age}
                      </strong>
                      <small>
                        {p.incoming
                          ? "♥ Взаимная симпатия"
                          : p.city + " · " + p.distance + " км"}
                      </small>
                    </button>
                    {tab === "matches" ? (
                      <button className="d-primary" onClick={telegram}>
                        <Send size={16} /> Написать в ТГ
                      </button>
                    ) : (
                      <button
                        disabled={busy}
                        onClick={() =>
                          update(() => api.swipe(p.id, false), "Лайк удалён")
                        }
                      >
                        Убрать лайк
                      </button>
                    )}
                  </article>
                ))}
              </div>
            )}
            {tab === "matches" && matches.length > 0 && (
              <p className="d-muted d-note">
                Демо-анкеты: кнопка открывает выбор собеседника в Telegram.
                Реальные контакты появятся после подключения API.
              </p>
            )}
          </>
        ) : (
          <>
            <div className="d-heading">
              <h1>Больше о вас</h1>
              <p>Пусть знакомство начинается с настоящего</p>
            </div>
            <form
              className="d-panel d-form"
              onSubmit={(e) => {
                e.preventDefault();
                void update(
                  () =>
                    api.saveProfile({ ...profile, name: profile.name.trim() }),
                  "Профиль сохранён",
                );
              }}
            >
              <label>
                Имя
                <input
                  required
                  maxLength={40}
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </label>
              <label>
                Возраст
                <input
                  type="number"
                  required
                  min={18}
                  max={99}
                  value={profile.age}
                  onChange={(e) =>
                    setProfile({ ...profile, age: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                Город
                <input
                  required
                  value={profile.city}
                  onChange={(e) =>
                    setProfile({ ...profile, city: e.target.value })
                  }
                />
              </label>
              <label>
                Пол
                <span className="d-select"><select
                  value={profile.gender}
                  onChange={(e) =>
                    setProfile({ ...profile, gender: e.target.value })
                  }
                >
                  <option>Мужчины</option>
                  <option>Женщины</option>
                </select><ChevronDown size={18} aria-hidden="true" /></span>
              </label>
              <label>
                Цель знакомства
                <span className="d-select"><select
                  value={profile.goal}
                  onChange={(e) =>
                    setProfile({ ...profile, goal: e.target.value })
                  }
                >
                  <option>Отношения</option>
                  <option>Общение</option>
                </select><ChevronDown size={18} aria-hidden="true" /></span>
              </label>
              <label>
                О себе
                <textarea
                  maxLength={500}
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                />
              </label>
              <label>
                Интересы через запятую
                <input
                  value={profile.interests}
                  onChange={(e) =>
                    setProfile({ ...profile, interests: e.target.value })
                  }
                />
              </label>
              <label>
                Telegram username
                <input
                  placeholder="username"
                  pattern="[A-Za-z0-9_]{5,32}"
                  value={profile.telegram}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      telegram: e.target.value.replace(/^@/, ""),
                    })
                  }
                />
              </label>
              <button
                className="d-primary"
                disabled={busy || !profile.name.trim()}
              >
                {busy ? "Сохраняем…" : "Сохранить профиль"}
              </button>
            </form>
            <button className="d-filter" onClick={() => setFilters({ ...f })}>
              <SlidersHorizontal size={18} /> Фильтры поиска
              <ChevronRight size={18} />
            </button>
            <p className="d-muted d-note">
              TWA Dating · Знакомства для взрослых 18+
            </p>
          </>
        )}
      </main>
      <nav className="d-nav" aria-label="Основная навигация">
        {tabs.map((t) => (
          <button
            key={t.id}
            aria-current={tab === t.id ? "page" : undefined}
            onClick={() => {
              setTab(t.id);
              setDetail(undefined);
              window.scrollTo(0, 0);
            }}
          >
            <span>
              <t.icon size={22} />
              {t.id === "matches" && matches.length > 0 && (
                <b>{matches.length}</b>
              )}
            </span>
            {t.label}
          </button>
        ))}
      </nav>
      <dialog
        ref={dialog}
        className="d-dialog"
        onCancel={() => setFilters(undefined)}
      >
        {filters && (
          <form
            className="d-form"
            onSubmit={(e) => {
              e.preventDefault();
              void update(
                () => api.saveFilters(filters),
                "Фильтры применены",
              ).then(() => setFilters(undefined));
            }}
          >
            <div className="d-dialog-title">
              <h2>Фильтры поиска</h2>
              <button
                type="button"
                aria-label="Закрыть"
                onClick={() => setFilters(undefined)}
              >
                <X />
              </button>
            </div>
            <label>
              Кого хотите встретить
              <span className="d-select"><select
                value={filters.gender}
                onChange={(e) =>
                  setFilters({ ...filters, gender: e.target.value })
                }
              >
                <option>Все</option>
                <option>Женщины</option>
                <option>Мужчины</option>
              </select><ChevronDown size={18} aria-hidden="true" /></span>
            </label>
            <div className="d-range">
              <label>
                Возраст от
                <input
                  type="number"
                  required
                  min={18}
                  max={filters.max}
                  value={filters.min}
                  onChange={(e) =>
                    setFilters({ ...filters, min: Number(e.target.value) })
                  }
                />
              </label>
              <label>
                До
                <input
                  type="number"
                  required
                  min={filters.min}
                  max={99}
                  value={filters.max}
                  onChange={(e) =>
                    setFilters({ ...filters, max: Number(e.target.value) })
                  }
                />
              </label>
            </div>
            <label>
              Расстояние: до {filters.distance} км
              <input
                type="range"
                min={1}
                max={100}
                value={filters.distance}
                onChange={(e) =>
                  setFilters({ ...filters, distance: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Цель знакомства
              <span className="d-select"><select
                value={filters.goal}
                onChange={(e) =>
                  setFilters({ ...filters, goal: e.target.value })
                }
              >
                <option>Любая</option>
                <option>Отношения</option>
                <option>Общение</option>
              </select><ChevronDown size={18} aria-hidden="true" /></span>
            </label>
            <button className="d-primary" disabled={busy}>
              Показать анкеты
            </button>
            <button type="button" onClick={() => setFilters({ ...defaults })}>
              Сбросить фильтры
            </button>
          </form>
        )}
      </dialog>
      {notice && (
        <div className="d-toast" role="status">
          {notice}
        </div>
      )}
    </div>
  );
}

