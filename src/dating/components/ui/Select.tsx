import {useEffect,useId,useLayoutEffect,useRef,useState} from 'react';
import {Check,ChevronDown} from 'lucide-react';
import type {KeyboardEvent} from 'react';
export type SelectOption={value:string;label:string};
type Props={value:string;options:SelectOption[];onChange:(value:string)=>void;label:string;disabled?:boolean;placeholder?:string};
export default function Select({value,options,onChange,label,disabled=false,placeholder='Выбрать'}:Props){
 const id=useId();const trigger=useRef<HTMLButtonElement>(null);const menu=useRef<HTMLDivElement>(null);const [open,setOpen]=useState(false);const [active,setActive]=useState(0);const search=useRef({text:'',time:0});
 const selected=options.findIndex(x=>x.value===value);
 function close(){setOpen(false)}
 function choose(index:number){const option=options[index];if(!option)return;onChange(option.value);close();trigger.current?.focus()}
 function expand(){if(disabled||!options.length)return;setActive(Math.max(0,selected));setOpen(true)}
 useLayoutEffect(()=>{
  if(!open||!trigger.current||!menu.current)return;
  const element=menu.current; element.showPopover?.();
  const rect=trigger.current.getBoundingClientRect();const viewport=window.visualViewport;const top=viewport?.offsetTop??0;const height=viewport?.height??window.innerHeight;const width=viewport?.width??window.innerWidth;const bottom=top+height;
  const below=bottom-rect.bottom-8,above=rect.top-top-8;const upward=below<Math.min(240,options.length*44+8)&&above>below;const available=Math.max(44,upward?above:below);const maxHeight=Math.min(272,available);
  Object.assign(element.style,{position:'fixed',margin:'0',width:Math.min(rect.width,width-16)+'px',maxHeight:maxHeight+'px',left:Math.max(8,Math.min(rect.left,width-rect.width-8))+'px',top:(upward?Math.max(top+8,rect.top-6-Math.min(maxHeight,element.scrollHeight)):rect.bottom+6)+'px'});
  return()=>{if(element.matches(':popover-open'))element.hidePopover?.()};
 },[open,options.length]);
 useEffect(()=>{if(!open)return;const outside=(event:PointerEvent)=>{if(!trigger.current?.contains(event.target as Node)&&!menu.current?.contains(event.target as Node))close()};const scroll=(event:Event)=>{if(!menu.current?.contains(event.target as Node))close()};const escape=(event:globalThis.KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();trigger.current?.focus()}};document.addEventListener('pointerdown',outside,true);document.addEventListener('keydown',escape,true);window.addEventListener('resize',close);document.addEventListener('scroll',scroll,true);return()=>{document.removeEventListener('pointerdown',outside,true);document.removeEventListener('keydown',escape,true);window.removeEventListener('resize',close);document.removeEventListener('scroll',scroll,true)}},[open]);
 useEffect(()=>{const list=menu.current;const item=list?.querySelector<HTMLElement>(`[data-index="${active}"]`);if(open&&list&&item){if(item.offsetTop<list.scrollTop)list.scrollTop=item.offsetTop;else if(item.offsetTop+item.offsetHeight>list.scrollTop+list.clientHeight)list.scrollTop=item.offsetTop+item.offsetHeight-list.clientHeight}},[active,open]);
 function keyboard(e:KeyboardEvent<HTMLButtonElement>){
  if(e.key==='Tab'){close();return}
  if(['ArrowDown','ArrowUp','Home','End','Enter',' '].includes(e.key)){e.preventDefault();if(!open){expand();return}if(e.key==='Enter'||e.key===' '){choose(active);return}setActive(index=>e.key==='Home'?0:e.key==='End'?options.length-1:Math.max(0,Math.min(options.length-1,index+(e.key==='ArrowDown'?1:-1))));return}
  if(e.key.length===1&&!e.ctrlKey&&!e.metaKey){const now=Date.now();search.current={text:(now-search.current.time<700?search.current.text:'')+e.key.toLocaleLowerCase(),time:now};const index=options.findIndex(x=>x.label.toLocaleLowerCase().startsWith(search.current.text));if(index>=0){if(!open)expand();setActive(index)}}
 }
 return <span className="d-custom-select"><button ref={trigger} type="button" className="d-select-trigger" role="combobox" aria-label={label} aria-haspopup="listbox" aria-expanded={open} aria-controls={open?id:undefined} aria-activedescendant={open?`${id}-${active}`:undefined} disabled={disabled||!options.length} onClick={()=>open?close():expand()} onKeyDown={keyboard} onBlur={event=>{if(!menu.current?.contains(event.relatedTarget))close()}}><span>{options[selected]?.label??placeholder}</span><ChevronDown size={18} aria-hidden="true"/></button>{open&&<div ref={menu} id={id} className="d-select-menu" role="listbox" aria-label={label} popover="manual">{options.map((option,index)=><div key={option.value} id={`${id}-${index}`} data-index={index} role="option" aria-selected={option.value===value} className={active===index?'is-active':''} onPointerDown={e=>e.preventDefault()} onPointerMove={()=>setActive(index)} onClick={e=>{e.preventDefault();choose(index)}}><span>{option.label}</span>{option.value===value&&<Check size={17} aria-hidden="true"/>}</div>)}</div>}</span>
}
