import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import { useAuth } from '../../contexts/AuthContext';
import AdminSurveyModel from '../../components/AdminSurveyModal';
import './styles/AdminChat.css';

interface Message {
  message: string;
  sender: number;
  senderName: string;
  createdAt: string;
  deleted: boolean;
}

interface ChatDetail {
  chatRoomId: number;
  title: string;
  tag: string;
  author: string;
  studentNum: number;
  createdAt: string;
}

const AdminChat = () => {
  const navigate = useNavigate();
  const { chatRoomId } = useParams<{ chatRoomId: string }>();
  const { userId: myUserId, isAdmin } = useAuth();

  const selectedChatId = Number(chatRoomId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMsgLoading, setIsMsgLoading] = useState(false);
  const [chatDetail, setChatDetail] = useState<ChatDetail | null>(null);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

  const stompClient = useRef<Client | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAdmin) {
      alert('관리자만 접근 가능합니다.');
      navigate('/');
      return;
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedChatId) return;
    connectWebSocket(selectedChatId);
    fetchChatDetail(selectedChatId);
    fetchMessages(selectedChatId);

    return () => disconnectWebSocket();
  }, [selectedChatId]);

  const connectWebSocket = (roomId: number) => {
    stompClient.current = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8081/ws-chat'),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      onConnect: () => {
        stompClient.current?.subscribe(
          `/sub/chat/room/${roomId}`,
          (frame) => {
            const newMessage = JSON.parse(frame.body);
            setMessages((prev) => [...prev, newMessage]);
          }
        );
      },
    });
    stompClient.current.activate();
  };

  const disconnectWebSocket = () => {
    stompClient.current?.deactivate();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !stompClient.current?.connected) return;

    stompClient.current.publish({
      destination: '/pub/chat/send',
      body: JSON.stringify({
        roomId: selectedChatId,
        message: inputValue.trim(),
      }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    setInputValue('');
  };

  const fetchChatDetail = async (roomId: number) => {
    const res = await fetch(`http://localhost:8081/api/chats/me/${roomId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    const json = await res.json();
    if (json.success) setChatDetail(json.data);
  };

  const fetchMessages = async (roomId: number) => {
    setIsMsgLoading(true);
    const res = await fetch(`http://localhost:8081/api/messages/${roomId}?size=100`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    const json = await res.json();
    if (json.success) setMessages(json.data);
    setIsMsgLoading(false);
  };

  return (
    <div className="admin-chat-page">
      <Header />
      <div className="admin-chat-container">
        <div className="admin-chat-window">
          <header className="chat-header">
            <h3>{chatDetail?.title || '로딩 중...'}</h3>
            <span className="admin-badge">ADMIN MODE</span>
            <button onClick={() => setIsSurveyModalOpen(true)}>종료</button>
          </header>

          <div className="admin-message-list" ref={scrollRef}>
            {isMsgLoading ? (
              <p>로딩 중...</p>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={msg.sender === myUserId ? 'mine' : 'others'}>
                  <p>{msg.deleted ? '삭제된 메시지입니다.' : msg.message}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage}>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="관리자 메시지 입력"
            />
            <button type="submit">전송</button>
          </form>
        </div>
      </div>

      {isSurveyModalOpen && (
        <AdminSurveyModel
          onCancel={() => setIsSurveyModalOpen(false)}
          onConfirm={() => setIsSurveyModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminChat;
