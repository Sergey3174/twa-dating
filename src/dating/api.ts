export type Person = Partial<Pick<Profile,'photos'|'favoriteInterest'|'causes'|'qualities'|'work'|'education'|'hometown'|'height'|'exercise'|'educationLevel'|'drinking'|'smoking'|'kids'|'hasKids'|'goal'>> & {
    id: number;
    name: string;
    age: number;
    gender: string;
    distance: number;
    city: string;
    bio: string;
    interests: string[];
    photo: string;
    incoming: boolean;
    posts: string[];
};
export type Filters = {
    min: number;
    max: number;
    distance: number;
    gender: string;
    goal: string;
};
export type Profile = {
 work?:string; education?:string; hometown?:string; height?:string; exercise?:string; educationLevel?:string; drinking?:string; smoking?:string; kids?:string; hasKids?:string;
 photos?: string[]; favoriteInterest?: string; causes?: string[]; qualities?: string[];
    name: string;
    age: number;
    city: string;
    bio: string;
    gender: string;
    goal: string;
    interests: string;
    telegram: string;
};
export type Settings = {mode:string;visible:boolean;snooze:boolean;incognito:boolean;autoplay:boolean;notifications:boolean;city:string};
export type State = {
 settings?: Settings;
    reports?: {
        id: number;
        reason: string;
    }[];
    superlikes?: number[];
    likes: number[];
    skipped: number[];
    filters: Filters;
    profile: Profile;
};
export const defaults: Filters = { min: 18, max: 40, distance: 50, gender: 'Все', goal: 'Любая' };
const photos = ['photo-1534528741775-53994a69daeb', 'photo-1506794778202-cad84cf45f1d', 'photo-1524504388940-b1c1722653e1', 'photo-1500648767791-00dcc994a43e', 'photo-1524250502761-1ac6f2e30d43', 'photo-1517841905240-472988babdf9'];
export const people: Person[] = ['Аня', 'Марк', 'София', 'Александр', 'Алиса', 'Полина'].map((name, i) => ({ id: i + 1, name, age: [25, 28, 24, 30, 27, 23][i], gender: [1, 3].includes(i) ? 'Мужчины' : 'Женщины', distance: [3, 7, 5, 12, 18, 4][i], city: 'Москва', bio: ['Собираю маленькие приключения. Кофе, выставки и прогулки без маршрута — мой идеальный выходной.', 'Архитектор. Люблю горы, хороший кофе и разговоры, которые не хочется заканчивать.', 'Снимаю жизнь на плёнку. Покажешь своё любимое место в городе?'][i % 3], interests: [['Кофе', 'Искусство', 'Путешествия'], ['Горы', 'Музыка', 'Спорт'], ['Фотография', 'Кино', 'Прогулки']][i % 3], photo: `https://images.unsplash.com/${photos[i]}?auto=format&fit=crop&w=900&q=85`, incoming: i % 2 === 0, posts: ['Выходной без планов — иногда самый лучший план.', 'Маленькие моменты, ради которых хочется замедлиться.'] }));
// Additional demo details and photos; some profiles intentionally stay sparse.
people.forEach((person,index)=>{
 person.goal=index%2?'Общение':'Отношения';
 if(index%2===0){person.height=String(162+index*3);person.exercise='Иногда';person.smoking='Не курю';person.drinking='Иногда';person.qualities=['Доброта','Чувство юмора'];person.favoriteInterest=person.interests[0];person.causes=['Экология'];person.photos=[person.photo,'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=85','https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=85'];}
});
const initial: State = { likes: [], skipped: [], filters: { ...defaults }, profile: { name: 'Сергей', age: 27, city: 'Москва', bio: 'Люблю путешествия и новые знакомства.', gender: 'Мужчины', goal: 'Отношения', interests: 'Кофе, Путешествия, Музыка', telegram: '' } };
let state: State = structuredClone(initial);
try {
    const saved = JSON.parse(localStorage.getItem('twa-dating-v1') || 'null');
    if (saved?.profile && saved?.filters && Array.isArray(saved.likes) && Array.isArray(saved.skipped))
        state = saved;
}
catch { /* fresh demo */ }
async function reply<T>(value: T): Promise<T> { await new Promise(r => setTimeout(r, 180)); return structuredClone(value); }
function persist(next: State) { localStorage.setItem('twa-dating-v1', JSON.stringify(next)); state = next; return reply(state); }
// Replace this adapter with HTTP requests when a dating backend is available.
export const api = {
 saveSettings: (settings:Settings) => persist({...state,settings}),
    getState: () => reply(state),
    getPeople: () => reply(people),
    swipe: (id: number, like: boolean) => persist({ ...state, likes: like ? [...new Set([...state.likes, id])] : state.likes.filter(x => x !== id), skipped: [...new Set([...state.skipped, id])] }),
    superlike: (id: number) => persist({ ...state, likes: [...new Set([...state.likes, id])], skipped: [...new Set([...state.skipped, id])], superlikes: [...new Set([...(state.superlikes ?? []), id])] }),
    unmatch: (id: number) => persist({ ...state, likes: state.likes.filter(x => x !== id), superlikes: (state.superlikes ?? []).filter(x => x !== id) }),
    report: (id: number, reason: string) => persist({ ...state, reports: [...(state.reports ?? []), { id, reason }] }),
    saveProfile: (profile: Profile) => persist({ ...state, profile }),
    saveFilters: (filters: Filters) => persist({ ...state, filters }),
    restart: () => persist({ ...state, skipped: [] }),
};
