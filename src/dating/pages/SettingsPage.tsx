import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { api } from "../api";
import { useDating } from "../state/useDating";
export default function SettingsPage() {
  const { state, update, busy } = useDating();
  const [values, setValues] = useState({
    mode: "Знакомства",
    visible: true,
    snooze: false,
    incognito: false,
    autoplay: false,
    notifications: true,
    city: state.profile.city,
    ...state.settings,
  });
  const toggles = [
    [
      "visible",
      "Показывать мою анкету",
      "Разрешить показывать анкету в подборке.",
    ],
    [
      "snooze",
      "Режим паузы",
      "Временно скрыть анкету, сохранив взаимные симпатии.",
    ],
    [
      "incognito",
      "Режим инкогнито",
      "Показывать анкету только тем, кому вы поставили лайк.",
    ],
    [
      "autoplay",
      "Автовоспроизведение видео",
      "Автоматически воспроизводить видео в анкетах.",
    ],
    ["notifications", "Уведомления", "Получать уведомления о новых симпатиях."],
  ] as const;
  return (
    <form
      className="d-settings"
      onSubmit={(e) => {
        e.preventDefault();
        void update(() => api.saveSettings(values), "Настройки сохранены");
      }}
    >
      <p className="d-muted d-note">
        Демо-настройки: сохраняются на устройстве, на выдачу анкет и уведомления
        пока не влияют.
      </p>
      <section className="d-panel d-form">
        <label>
          Тип знакомства
          <span className="d-select">
            <select
              value={values.mode}
              onChange={(e) => setValues({ ...values, mode: e.target.value })}
            >
              <option>Знакомства</option>
              <option>Дружба</option>
            </select>
            <ChevronDown size={18} />
          </span>
        </label>
      </section>
      {toggles.map(([key, label, hint]) => (
        <section className="d-panel" key={key}>
          <label className="d-setting-toggle">
            <span>{label}</span>
            <input
              type="checkbox"
              role="switch"
              checked={values[key]}
              onChange={(e) =>
                setValues({ ...values, [key]: e.target.checked })
              }
            />
          </label>
          <p className="d-muted">{hint}</p>
        </section>
      ))}
      <section className="d-panel d-form">
        <label>
          Текущее местоположение
          <input
            required
            value={values.city}
            onChange={(e) => setValues({ ...values, city: e.target.value })}
          />
        </label>
        <small className="d-muted">
          Демонстрационный город, без определения геопозиции.
        </small>
      </section>
      <button className="d-primary d-wide" disabled={busy}>
        {busy ? "Сохраняем…" : "Сохранить настройки"}
      </button>
    </form>
  );
}
