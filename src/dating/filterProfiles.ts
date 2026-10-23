import type {Filters,Person} from './api';
export function filterScore(p:Person,f:Filters){return Number(p.age<f.min||p.age>f.max)+Number(!!f.interests?.length&&!f.interests.some(x=>p.interests.includes(x)))+Number(!!f.goals?.length&&!f.goals.includes(p.goal??''))+Number((f.heightMin??100)>Number(p.height??0)||Number(p.height??251)>(f.heightMax??250))}
export function matchesFilters(p:Person,f:Filters){
 if(p.distance>f.distance||(f.gender!=='Все'&&p.gender!==f.gender))return false;
 if(!f.ageOutside&&(p.age<f.min||p.age>f.max))return false;
 if(f.interests?.length&&!f.interestsOutside&&!f.interests.some(x=>p.interests.includes(x)))return false;
 if(f.verifiedOnly&&!p.verified)return false;
 if(f.languages?.length&&!f.languages.some(x=>p.languages?.includes(x)))return false;
 if(!f.heightOutside&&((f.heightMin??100)>100||(f.heightMax??250)<250)&&(!p.height||Number(p.height)<(f.heightMin??100)||Number(p.height)>(f.heightMax??250)))return false;
 const goals=f.goals??(f.goal==='Любая'?[]:[f.goal]);
 if(goals.length&&!f.goalsOutside&&!goals.includes(p.goal??''))return false;
 for(const key of ['kids','hasKids','religion'] as const)if(f[key]&&f[key]!==p[key])return false;
 return true;
}
