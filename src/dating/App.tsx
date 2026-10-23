import { DatingProvider } from "./state/DatingProvider";
import AppRouter from "./router";
export default function App() {
  return (
    <DatingProvider>
      <AppRouter />
    </DatingProvider>
  );
}
