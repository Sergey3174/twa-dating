import Select from "./ui/Select";
import {
  profileChoices,
  searchDetailFields,
  profileLimits,
} from "../profileSchema";
import { useEffect, useRef, useState } from "react";
import { X, Plus, Check, BadgeCheck } from "lucide-react";
import { api, defaults } from "../api";
import type { Filters } from "../api";
import { useDating } from "../state/useDating";
import { interestsOptions } from "../profileOptions";
import RangePair from "./filters/RangePair";
function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="d-setting-toggle d-filter-toggle">
      <span>{label}</span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
export default function FilterSheet() {
  const { filters, setFilters, busy, update, error } = useDating();
  const dialog = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState("basic");
  const opened = !!filters;
  useEffect(() => {
    if (opened) {
      dialog.current?.showModal();
      setTab("basic");
    } else dialog.current?.close();
  }, [opened]);
  if (!filters) return <dialog ref={dialog} className="d-dialog" />;
  const f = filters;
  const patch = (v: Partial<Filters>) => setFilters({ ...f, ...v });
  const choose = (key: "interests" | "languages" | "goals", value: string) => {
    const values =
      f[key] ?? (key === "goals" && f.goal !== "Любая" ? [f.goal] : []);
    patch({
      [key]: values.includes(value)
        ? values.filter((x) => x !== value)
        : [...values, value],
      ...(key === "goals" ? { goal: "Любая" } : {}),
    });
  };
  return (
    <dialog
      ref={dialog}
      className="d-dialog d-preferences"
      aria-labelledby="preferences-title"
      onCancel={() => setFilters(undefined)}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void update(() => api.saveFilters(f), "Фильтры применены").then(
            (saved) => {
              if (saved) setFilters(undefined);
            },
          );
        }}
      >
        <header className="d-pref-header">
          <button
            type="button"
            aria-label="Закрыть"
            onClick={() => setFilters(undefined)}
          >
            <X />
          </button>
          <h2 id="preferences-title">Фильтры поиска</h2>
        </header>
        <div className="d-pref-tabs" aria-label="Разделы фильтров">
          {[
            ["basic", "Основные"],
            ["advanced", "Расширенные"],
          ].map(([key, label]) => (
            <button
              type="button"
              key={key}
              aria-pressed={tab === key}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="d-pref-body">
          {tab === "basic" ? (
            <>
              <section>
                <h3>Кого хотите встретить?</h3>
                <div className="d-pref-box d-form">
                  <Select
                    label="Кого хотите встретить"
                    value={f.gender}
                    options={["Все", ...profileChoices.gender].map((value) => ({
                      value,
                      label: value,
                    }))}
                    onChange={(gender) => patch({ gender })}
                  />
                </div>
              </section>
              <section>
                <h3>Какого возраста?</h3>
                <div className="d-pref-box">
                  <RangePair
                    label="Возраст"
                    min={profileLimits.age.min}
                    max={profileLimits.age.max}
                    low={f.min}
                    high={f.max}
                    unit=" лет"
                    onChange={(min, max) => patch({ min, max })}
                  />
                  <Toggle
                    label="Показывать и за пределами диапазона"
                    checked={!!f.ageOutside}
                    onChange={(ageOutside) => patch({ ageOutside })}
                  />
                </div>
              </section>
              <section>
                <h3>Как далеко?</h3>
                <div className="d-pref-box">
                  <label className="d-distance-range">
                    <strong>До {f.distance} км</strong>
                    <span className="d-dual-range d-single-range">
                      <span className="d-range-track" />
                      <span
                        className="d-range-fill"
                        style={{
                          right: `${100 - ((f.distance - 1) / 99) * 100}%`,
                        }}
                      />
                      <input
                        aria-label="Расстояние"
                        type="range"
                        min={1}
                        max={100}
                        value={f.distance}
                        onChange={(e) =>
                          patch({ distance: Number(e.target.value) })
                        }
                      />
                    </span>
                  </label>
                </div>
              </section>
              <section>
                <h3>Есть ли у вас общие интересы?</h3>
                <div className="d-pref-box">
                  <div className="d-choice-chips">
                    {interestsOptions.map((x) => (
                      <button
                        key={x}
                        type="button"
                        aria-pressed={!!f.interests?.includes(x)}
                        onClick={() => choose("interests", x)}
                      >
                        {x}
                        {f.interests?.includes(x) ? (
                          <Check size={14} />
                        ) : (
                          <Plus size={14} />
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="d-pref-help">
                    Достаточно одного общего интереса из выбранных.
                  </p>
                  <Toggle
                    label="Показывать и без общих интересов"
                    checked={!!f.interestsOutside}
                    onChange={(interestsOutside) => patch({ interestsOutside })}
                  />
                </div>
              </section>
              <section>
                <h3>Верифицирована ли анкета?</h3>
                <div className="d-pref-box d-pref-verified">
                  <BadgeCheck size={18} />
                  <Toggle
                    label="Только верифицированные"
                    checked={!!f.verifiedOnly}
                    onChange={(verifiedOnly) => patch({ verifiedOnly })}
                  />
                </div>
              </section>
              <section>
                <h3>На каких языках общаются?</h3>
                <div className="d-pref-box d-choice-chips">
                  {profileChoices.languages.map((x) => (
                    <button
                      type="button"
                      key={x}
                      aria-pressed={!!f.languages?.includes(x)}
                      onClick={() => choose("languages", x)}
                    >
                      {x}
                      {f.languages?.includes(x) && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <>
              <section>
                <h3>Какого роста?</h3>
                <div className="d-pref-box">
                  <RangePair
                    label="Рост"
                    min={profileLimits.height.min}
                    max={profileLimits.height.max}
                    low={f.heightMin ?? 100}
                    high={f.heightMax ?? 210}
                    unit=" см"
                    onChange={(heightMin, heightMax) =>
                      patch({ heightMin, heightMax })
                    }
                  />
                  <Toggle
                    label="Показывать и за пределами диапазона"
                    checked={!!f.heightOutside}
                    onChange={(heightOutside) => patch({ heightOutside })}
                  />
                </div>
              </section>
              <section>
                <h3>Что они ищут?</h3>
                <div className="d-pref-box">
                  {profileChoices.goal.map((x) => (
                    <label className="d-pref-check" key={x}>
                      <span>{x}</span>
                      <input
                        type="checkbox"
                        checked={(
                          f.goals ?? (f.goal === "Любая" ? [] : [f.goal])
                        ).includes(x)}
                        onChange={() => choose("goals", x)}
                      />
                    </label>
                  ))}
                  <Toggle
                    label="Показывать и с другими целями"
                    checked={!!f.goalsOutside}
                    onChange={(goalsOutside) => patch({ goalsOutside })}
                  />
                </div>
              </section>
              {searchDetailFields.map((field) => (
                <section key={field.key}>
                  <h3>{field.title}</h3>
                  <div className="d-pref-box d-form">
                    <Select
                      label={field.title}
                      value={f[field.key] ?? ""}
                      options={[
                        { value: "", label: "Неважно" },
                        ...field.options.map((value) => ({
                          value,
                          label: value,
                        })),
                      ]}
                      onChange={(value) => patch({ [field.key]: value })}
                    />
                  </div>
                </section>
              ))}
            </>
          )}
        </div>
        <footer className="d-pref-footer">
          {error && (
            <p role="alert" className="d-error">
              {error}
            </p>
          )}
          <div className="d-sheet-actions">
            <button
              type="button"
              className="d-sheet-secondary"
              disabled={busy}
              onClick={() => setFilters({ ...defaults })}
            >
              Сбросить
            </button>
            <button className="d-primary" disabled={busy}>
              {busy ? "Сохраняем…" : "Показать анкеты"}
            </button>
          </div>
        </footer>
      </form>
    </dialog>
  );
}
