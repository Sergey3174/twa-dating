import {profileChoices,profileLimits} from '../profileSchema';
import ProfileDetails from "../components/profile/ProfileDetails";
import { ChevronRight, SlidersHorizontal, Plus, Star } from "lucide-react";
import { useState } from "react";
import PhotoEditor from "../components/profile/PhotoEditor";
import ChoiceSheet from "../components/profile/ChoiceSheet";
import {
  profileCompletion,
  interestsOptions,
  causesOptions,
  qualitiesOptions,
} from "../profileOptions";
import { useDating } from "../state/useDating";
import { api } from "../api";
export default function EditProfilePage() {
  const { profile, setProfile, busy, update, setFilters, f } = useDating();
  const [uploading, setUploading] = useState(false);
  const [choice, setChoice] = useState<
    "interests" | "favorite" | "causes" | "qualities" | "languages" | null
  >(null);
  const selected = profile.interests
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  const completion = profileCompletion(profile);
  const choices = {
 languages:{title:"Языки общения",options:profileChoices.languages,value:profile.languages??[],limit:profileChoices.languages.length},
    interests: {
      title: "Ваши интересы",
      options: [...new Set([...interestsOptions, ...selected])],
      value: selected,
      limit: 5,
    },
    favorite: {
      title: "Любимый интерес",
      options: selected,
      value: profile.favoriteInterest ? [profile.favoriteInterest] : [],
      limit: 1,
    },
    causes: {
      title: "Ценности и сообщества",
      options: causesOptions,
      value: profile.causes ?? [],
      limit: 3,
    },
    qualities: {
      title: "Что я ценю в людях",
      options: qualitiesOptions,
      value: profile.qualities ?? [],
      limit: 3,
    },
  };
  return (
    <>
      <div className="d-heading">
        <h1>Больше о вас</h1>
        <p>Пусть знакомство начинается с настоящего</p>
      </div>
      <section className="d-panel">
        <div className="d-editor-progress">
          <strong>Заполненность профиля</strong>
          <span>{completion}%</span>
        </div>
        <progress className="d-profile-progress" value={completion} max={100} />
      </section>
      <section className="d-panel">
        <h2>Фотографии</h2>
        <p className="d-muted">Покажите себя настоящим.</p>
        <PhotoEditor
          photos={profile.photos ?? []}
          disabled={busy}
          onLoading={setUploading}
          onChange={(photos) =>
            setProfile((previous) =>
              previous ? { ...previous, photos } : previous,
            )
          }
        />
      </section>
      <section className="d-panel d-editor-section">
        <h2>Интересы</h2>
        <p className="d-muted">То, о чём вы можете говорить часами.</p>
        <button className="d-editor-row" onClick={() => setChoice("interests")}>
          Добавить интересы
          <Plus size={20} />
        </button>
        <div className="d-tags">
          {selected.map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
        <button
          className="d-editor-row"
          disabled={!selected.length}
          onClick={() => setChoice("favorite")}
        >
          <Star size={18} />
          {profile.favoriteInterest || "Выбрать любимый интерес"}
          <ChevronRight size={18} />
        </button>
      </section>
      <section className="d-panel d-editor-section">
        <h2>Ценности и сообщества</h2>
        <p className="d-muted">До трёх важных для вас направлений.</p>
        <button className="d-editor-row" onClick={() => setChoice("causes")}>
          <span>{profile.causes?.join(" · ") || "Выбрать ценности"}</span>
          <ChevronRight size={18} />
        </button>
      </section>
      <section className="d-panel d-editor-section">
        <h2>Что я ценю в людях</h2>
        <button className="d-editor-row" onClick={() => setChoice("qualities")}>
          <span>{profile.qualities?.join(" · ") || "Выбрать качества"}</span>
          <ChevronRight size={18} />
        </button>
      </section>
      <section className="d-panel"><h2>Языки общения</h2><button type="button" className="d-editor-row" onClick={()=>setChoice('languages')}>{profile.languages?.join(' · ')||'Добавить языки'}<ChevronRight size={18}/></button></section>
<section className="d-panel"><label className="d-setting-toggle"><span>Подтверждённая анкета · демо</span><input type="checkbox" role="switch" checked={!!profile.verified} onChange={e=>setProfile({...profile,verified:e.target.checked})}/></label><p className="d-muted d-photo-help">Тестовый статус для макета. Реальная проверка личности пока не подключена.</p></section>
<ProfileDetails
        profile={profile}
        disabled={busy}
        onChange={(key, value) =>
          setProfile((previous) =>
            previous ? { ...previous, [key]: value } : previous,
          )
        }
      />
      <form
        className="d-panel d-form"
        onSubmit={(e) => {
          e.preventDefault();
          void update(
            () => api.saveProfile({ ...profile, name: profile.name.trim() }),
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
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </label>
        <label>
          Возраст
          <input
            type="number"
            required
            min={profileLimits.age.min}
            max={profileLimits.age.max}
            value={profile.age}
            onChange={(e) =>
              setProfile({ ...profile, age: Number(e.target.value) })
            }
          />
        </label>

        <label>
          О себе
          <textarea
            maxLength={500}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
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
          disabled={busy || uploading || !profile.name.trim()}
        >
          {busy ? "Сохраняем…" : "Сохранить профиль"}
        </button>
      </form>
      <button className="d-filter" onClick={() => setFilters({ ...f })}>
        <SlidersHorizontal size={18} /> Фильтры поиска
        <ChevronRight size={18} />
      </button>
      <p className="d-muted d-note">TWA Dating · Знакомства для взрослых 18+</p>
      {choice && (
        <ChoiceSheet
          key={choice}
          {...choices[choice]}
          onClose={() => setChoice(null)}
          onSave={(values) => {
            if (choice === "interests")
              setProfile({
                ...profile,
                interests: values.join(", "),
                favoriteInterest: values.includes(
                  profile.favoriteInterest ?? "",
                )
                  ? profile.favoriteInterest
                  : undefined,
              });
            else if (choice === "favorite")
              setProfile({ ...profile, favoriteInterest: values[0] });
            else setProfile({ ...profile, [choice]: values });
            setChoice(null);
          }}
        />
      )}
    </>
  );
}
