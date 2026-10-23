import type {Profile} from './api';
export const interestsOptions=['Искусство','Кофе','Путешествия','Музыка','Спорт','Фотография','Кино','Прогулки','Книги','Кулинария','Кошки','Собаки','Танцы','Горы','Игры','Письмо'];
export const causesOptions=['Волонтёрство','Защита животных','Экология','Права человека','Доступная среда','Образование','Наука','Помощь детям','Равные возможности'];
export const qualitiesOptions=['Доброта','Честность','Чувство юмора','Эмпатия','Любознательность','Надёжность','Открытость','Амбициозность'];
export function profileCompletion(p:Profile){return Math.round([p.name.trim(),p.age,p.city.trim(),p.bio.trim(),p.interests.trim(),p.telegram,(p.photos??[]).length,p.favoriteInterest,(p.causes??[]).length,(p.qualities??[]).length].filter(Boolean).length/10*100)}
