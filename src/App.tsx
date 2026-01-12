import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Login, Signup } from './pages/auth';
import { PublicBoard } from './pages/board';
import { ChatDetail } from './pages/chat';

import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import ChangePassword from './pages/ChangePassword';
import Students from './pages/Students';
import SurveyModal from './components/SurveyModel';

// 관리자 페이지
import AdminUserEdit from './pages/admin/AdminUserEdit';
import MyChats from './pages/chat/MyChats';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />

        {/* 일반 기능 */}
        <Route path="/boards/public" element={<PublicBoard />} />
        <Route path="/chats/:chatRoomId" element={<ChatDetail />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/my-chats" element={<MyChats />} />

        {/* 관리자 */}
        <Route path="/students" element={<Students />} />
        <Route path="/admin/users/:userId/edit" element={<AdminUserEdit />} />

        {/* 잘못된 경로 */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path='/chat-setting' element={<SurveyModal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;