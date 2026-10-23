import {BadgeCheck,Languages,Heart,MessageCircleHeart,MapPin,Star} from 'lucide-react';
import type {Person,Profile} from '../../api';
import {detailFields,detailValue} from '../../profileDetails';
export default function ProfileContent({person,own=false,goal,showVerification=true}:{person:Person;own?:boolean;goal?:string;showVerification?:boolean}){
 const details:Profile={...person,interests:person.interests.join(', '),goal:goal||person.goal||'',telegram:''};
 const facts=detailFields.filter(f=>!['goal','city'].includes(f.key)&&!!person[f.key]);
 const extraPhotos=[...new Set(person.photos??[])].filter(photo=>photo!==person.photo);
 const photo=(index:number)=>extraPhotos[index]?<figure className="d-profile-photo"><img src={extraPhotos[index]} loading="lazy" draggable={false} alt={`${person.name} — фото ${index+2}`}/></figure>:null;
 return <>
 {showVerification&&person.verified&&<section className="d-panel"><span className="d-verification"><BadgeCheck size={18}/>Анкета подтверждена · демо</span></section>}
 {!!person.languages?.length&&<section className="d-panel d-profile-section"><h2>Языки общения</h2><div className="d-profile-chips">{person.languages.map(x=><span key={x}><Languages size={15}/>{x}</span>)}</div></section>}
  {(person.bio||facts.length>0)&&<section className="d-panel d-profile-section"><h2>Обо мне</h2>{person.bio&&<p>{person.bio}</p>}<div className="d-profile-chips">{facts.map(field=>{const Icon=field.icon;return <span key={field.key} title={field.label}><Icon size={15}/>{detailValue(details,field)}</span>})}</div></section>}
  {photo(0)}
  {(details.goal||!!person.qualities?.length)&&<section className="d-panel d-profile-section"><h2>Я ищу</h2><div className="d-profile-chips">{details.goal&&<span><Heart size={15}/>{details.goal}</span>}{person.qualities?.map(x=><span key={x}>{x}</span>)}</div></section>}
  {person.interests.length>0&&<section className="d-panel d-profile-section"><h2>Мои интересы</h2>{person.favoriteInterest&&<div className="d-favorite-interest"><span><small>Любимый интерес</small>{person.favoriteInterest}</span><MessageCircleHeart size={26}/></div>}<div className="d-profile-chips">{person.interests.map(x=><span key={x}>{person.favoriteInterest===x&&<Star size={14}/>} {x}</span>)}</div></section>}
  {photo(1)}
  {!!person.causes?.length&&<section className="d-panel d-profile-section"><h2>Ценности и сообщества</h2><div className="d-profile-chips">{person.causes.map(x=><span key={x}>{x}</span>)}</div></section>}
  {extraPhotos.slice(2).map((_,i)=><div key={i}>{photo(i+2)}</div>)}
  {person.city&&<section className="d-panel d-profile-section"><h2>Местоположение</h2><p><MapPin size={16}/> {person.city}{!own&&` · ${person.distance} км от вас`}</p></section>}
 </>;
}
