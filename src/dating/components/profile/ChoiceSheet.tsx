import {useEffect,useRef,useState} from 'react';
import {X,Check} from 'lucide-react';
export default function ChoiceSheet({title,options,value,limit,onSave,onClose}:{title:string;options:string[];value:string[];limit:number;onSave:(v:string[])=>void;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);const [draft,setDraft]=useState(value);
 useEffect(()=>{dialog.current?.showModal()},[]);
 return <dialog ref={dialog} className="d-dialog d-choice-sheet" onCancel={onClose}><div className="d-dialog-title"><h2>{title}</h2><button type="button" aria-label="Закрыть" onClick={onClose}><X/></button></div><p className="d-muted">Выбрано {draft.length} из {limit}</p><div className={limit===1?'d-choice-list':'d-choice-chips'}>{options.map(option=><button type="button" key={option} aria-pressed={draft.includes(option)} disabled={limit!==1&&!draft.includes(option)&&draft.length>=limit} onClick={()=>setDraft(draft.includes(option)?draft.filter(x=>x!==option):limit===1?[option]:[...draft,option])}>{option}{draft.includes(option)&&<Check size={16}/>}</button>)}</div><p className="d-muted">{limit===1?'Выберите один интерес, который выделим в анкете.':`Выберите до ${limit} вариантов, близких вам.`}</p><div className="d-sheet-actions"><button type="button" className="d-primary" onClick={()=>onSave(draft)}>Готово</button></div></dialog>
}
