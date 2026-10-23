import {useState} from 'react';
import {ChevronRight} from 'lucide-react';
import type {Profile} from '../../api';
import {detailFields,detailValue} from '../../profileDetails';
import type {DetailField} from '../../profileDetails';
import DetailFieldSheet from './DetailFieldSheet';
export default function ProfileDetails({profile,onChange,disabled=false,readOnly=false}:{profile:Profile;onChange?:(key:DetailField['key'],value:string)=>void;disabled?:boolean;readOnly?:boolean}){
 const [editing,setEditing]=useState<DetailField|null>(null);
 return <>{(['about','more'] as const).map(group=>{const fields=detailFields.filter(f=>f.group===group&&(!readOnly||!!profile[f.key]));if(!fields.length)return null;return <section className="d-panel d-detail-section" key={group}><h2>{group==='about'?'О вас':'Подробнее о вас'}</h2>{group==='more'&&!readOnly&&<p className="d-muted">То, что помогает узнать друг друга лучше.</p>}<div className="d-detail-rows">{fields.map(field=>{const Icon=field.icon;const content=<><Icon size={19}/><span className="d-detail-label">{field.label}</span><span className="d-detail-value">{detailValue(profile,field)||'Добавить'}</span>{!readOnly&&<ChevronRight size={17}/>}</>;return readOnly?<div className="d-detail-row" key={field.key}>{content}</div>:<button type="button" className="d-detail-row" key={field.key} disabled={disabled} onClick={()=>setEditing(field)}>{content}</button>})}</div></section>})}{editing&&<DetailFieldSheet key={editing.key} field={editing} value={profile[editing.key]??''} onClose={()=>setEditing(null)} onSave={value=>{onChange?.(editing.key,value);setEditing(null)}}/>}</>
}
