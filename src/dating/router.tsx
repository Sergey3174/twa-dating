import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import DiscoverPage from "./pages/DiscoverPage";
import LikesPage from "./pages/LikesPage";
import MatchesPage from "./pages/MatchesPage";
import ProfilePage from "./pages/ProfilePage";
import PersonPage from "./pages/PersonPage";
import EditProfilePage from "./pages/EditProfilePage";
import MyProfilePage from "./pages/MyProfilePage";
import SettingsPage from "./pages/SettingsPage";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DiscoverPage />} />
          <Route path="likes" element={<LikesPage />} />
          <Route path="matches" element={<MatchesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/edit" element={<EditProfilePage />} />
          <Route path="profile/me" element={<MyProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="people/:id" element={<PersonPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
