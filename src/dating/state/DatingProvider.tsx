import type { ReactNode } from "react";
import { Context, useDatingState } from "./useDating";
export function DatingProvider({ children }: { children: ReactNode }) {
  const value = useDatingState();
  return (
    <Context.Provider value={value}>
      {!value.state || !value.profile ? (
        <main className="dating">
          <p role="status">{value.error || "Загружаем знакомства…"}</p>
        </main>
      ) : (
        children
      )}
    </Context.Provider>
  );
}
