import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import { Login, Signup } from './pages/auth';
import { PublicBoard } from './pages/board';
import UserProfile from './pages/UserProfile';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 홈 */}
        <Route path="/" element={<Home />} />

        {/* 인증 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />

        {/* 게시판 */}
        <Route path="/boards/public" element={<PublicBoard />} />

        {/* 마이페이지 */}
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path='/chat-setting' element={<SurveyModal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
