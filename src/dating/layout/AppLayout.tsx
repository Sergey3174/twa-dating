import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDating } from "../state/useDating";
import AppHeader from "./AppHeader";
import BottomNav from "./BottomNav";
import FilterSheet from "../components/FilterSheet";
export default function AppLayout() {
  const { error, notice, current } = useDating();
  const location = useLocation();
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    main.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [location.pathname, current?.id]);
  return (
    <div
      className={
        "dating" + ((location.pathname === "/" || location.pathname === "/profile/me") ? " dating--discover" : "")
      }
    >
      <AppHeader />
      <main ref={main}>
        {error && (
          <p role="alert" className="d-error">
            {error}
          </p>
        )}
        <Outlet />
      </main>
      <BottomNav />
      <FilterSheet />
      {notice && (
        <div className="d-toast" role="status">
          {notice}
        </div>
      )}
    </div>
  );
}
