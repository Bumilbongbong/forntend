import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login, Signup } from './pages/auth';
import { PublicBoard } from './pages/board';
import { ChatDetail } from './pages/chat';

import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import ChangePassword from './pages/ChangePassword';
import MyChat from './pages/chat/MyChat';
import Students from './pages/Students';
import AdminChatList from './pages/chat/AdminChatList';
import AdminUserEdit from './pages/admin/AdminUserEdit';
import AdminChat from './pages/admin/AdminChat';

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

        {/* 사용자 채팅 */}
        <Route path="/chat" element={<MyChat />} />
        <Route path="/my-chat" element={<MyChat />} />
        <Route path="/chats/:chatRoomId" element={<ChatDetail />} />

        {/* 관리자 채팅 */}
        <Route path="/admin/chats" element={<AdminChatList />} />
        <Route path="/admin/chats/:chatRoomId" element={<AdminChat />} />

        {/* 관리자 학생 관리 */}
        <Route path="/students" element={<Students />} />
        <Route
          path="/admin/users/:userId/edit"
          element={<AdminUserEdit />}
        />

        {/* 마이페이지 */}
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
