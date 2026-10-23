import type {Person,Profile} from './api';
export const selfPhoto='https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85';
export function toSelfPerson(profile:Profile):Person {return {...profile,id:0,name:profile.name,age:profile.age,gender:profile.gender,city:profile.city,bio:profile.bio,interests:profile.interests.split(',').map(x=>x.trim()).filter(Boolean),distance:0,photo:profile.photos?.[0]||selfPhoto,incoming:false,posts:[]};}
