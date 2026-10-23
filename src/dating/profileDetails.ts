import {Briefcase,GraduationCap,User,MapPin,House,Ruler,Dumbbell,Wine,Cigarette,Heart,Baby,Users} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import type {Profile} from './api';
export type DetailField = {key:keyof Pick<Profile,'work'|'education'|'gender'|'city'|'hometown'|'height'|'exercise'|'educationLevel'|'drinking'|'smoking'|'goal'|'kids'|'hasKids'>;label:string;icon:LucideIcon;group:'about'|'more';options?:string[];number?:boolean;required?:boolean};
export const detailFields:DetailField[]=[
 {key:'work',label:'Работа',icon:Briefcase,group:'about'},
 {key:'education',label:'Образование',icon:GraduationCap,group:'about'},
 {key:'gender',label:'Пол',icon:User,group:'about',required:true,options:['Мужчины','Женщины']},
 {key:'city',label:'Местоположение',icon:MapPin,group:'about',required:true},
 {key:'hometown',label:'Родной город',icon:House,group:'about'},
 {key:'height',label:'Рост',icon:Ruler,group:'more',number:true},
 {key:'exercise',label:'Спорт',icon:Dumbbell,group:'more',options:['Активно занимаюсь','Иногда','Редко','Не занимаюсь']},
 {key:'educationLevel',label:'Уровень образования',icon:GraduationCap,group:'more',options:['Среднее','Среднее специальное','Учусь в вузе','Высшее','Магистратура','Учёная степень']},
 {key:'drinking',label:'Алкоголь',icon:Wine,group:'more',options:['Не пью','Иногда','В компании']},
 {key:'smoking',label:'Курение',icon:Cigarette,group:'more',options:['Не курю','Иногда','Курю','Бросаю']},
 {key:'goal',label:'Ищу',icon:Heart,group:'more',required:true,options:['Отношения','Общение','Дружба','Пока не знаю']},
 {key:'kids',label:'Планы на детей',icon:Baby,group:'more',options:['Хочу детей','Не хочу детей','Открыт(а) к детям','Пока не знаю']},
 {key:'hasKids',label:'Есть дети',icon:Users,group:'more',options:['Нет детей','Есть дети','Предпочитаю не указывать']}
];
export function detailValue(profile:Profile,field:DetailField){const value=profile[field.key];if(!value)return '';if(field.key==='height')return value+' см';if(field.key==='gender')return value==='Мужчины'?'Мужчина':value==='Женщины'?'Женщина':value;return value}
