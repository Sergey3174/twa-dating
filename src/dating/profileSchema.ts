// Shared values for profile editing, display and search. Keep persisted labels stable.
export const profileChoices = {
  gender: ["Мужчины", "Женщины"],
  goal: ["Отношения", "Общение", "Дружба", "Пока не знаю"],
  kids: ["Хочу детей", "Не хочу детей", "Открыт(а) к детям", "Пока не знаю"],
  hasKids: ["Нет детей", "Есть дети", "Предпочитаю не указывать"],
  religion: [
    "Атеизм",
    "Агностицизм",
    "Христианство",
    "Ислам",
    "Буддизм",
    "Иудаизм",
    "Другое",
  ],
  languages: ["Русский", "Английский", "Испанский", "Французский"],
};
export const profileLimits = {
  age: { min: 18, max: 99 },
  height: { min: 100, max: 210 },
};
export const searchDetailFields = [
  { key: "kids", title: "Какие планы на детей?", options: profileChoices.kids },
  { key: "hasKids", title: "Есть ли дети?", options: profileChoices.hasKids },
  { key: "religion", title: "Религия", options: profileChoices.religion },
] as const;
