import { useEffect, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { api, defaults } from '../api';
import { useDating } from '../state/useDating';
export default function FilterSheet() {
    const { filters, setFilters, busy, update } = useDating();
    const dialog = useRef<HTMLDialogElement>(null);
    useEffect(() => { if (filters)
        dialog.current?.showModal();
    else
        dialog.current?.close(); }, [filters]);
    return (<dialog ref={dialog} className="d-dialog" onCancel={() => setFilters(undefined)}>
        {filters && (<form className="d-form" onSubmit={(e) => {
                e.preventDefault();
                void update(() => api.saveFilters(filters), "Фильтры применены").then(saved => { if (saved)
                    setFilters(undefined); });
            }}>
            <div className="d-dialog-title">
              <h2>Фильтры поиска</h2>
              <button type="button" aria-label="Закрыть" onClick={() => setFilters(undefined)}>
                <X />
              </button>
            </div>
            <label>
              Кого хотите встретить
              <span className="d-select"><select value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })}>
                <option>Все</option>
                <option>Женщины</option>
                <option>Мужчины</option>
              </select><ChevronDown size={18} aria-hidden="true"/></span>
            </label>
            <div className="d-range">
              <label>
                Возраст от
                <input type="number" required min={18} max={filters.max} value={filters.min} onChange={(e) => setFilters({ ...filters, min: Number(e.target.value) })}/>
              </label>
              <label>
                До
                <input type="number" required min={filters.min} max={99} value={filters.max} onChange={(e) => setFilters({ ...filters, max: Number(e.target.value) })}/>
              </label>
            </div>
            <label>
              Расстояние: до {filters.distance} км
              <input type="range" min={1} max={100} value={filters.distance} onChange={(e) => setFilters({ ...filters, distance: Number(e.target.value) })}/>
            </label>
            <label>
              Цель знакомства
              <span className="d-select"><select value={filters.goal} onChange={(e) => setFilters({ ...filters, goal: e.target.value })}>
                <option>Любая</option>
                <option>Отношения</option>
                <option>Общение</option>
              </select><ChevronDown size={18} aria-hidden="true"/></span>
            </label>
            <button className="d-primary" disabled={busy}>
              Показать анкеты
            </button>
            <button type="button" onClick={() => setFilters({ ...defaults })}>
              Сбросить фильтры
            </button>
          </form>)}
      </dialog>);
}
