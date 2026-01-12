import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Header } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import './styles/AdminChat.css';

interface Message {
  message: string;
  sender: number;
  senderName: string;
  createdAt: string;
  deleted: boolean;
}

const AdminChat = () => {
  const { userId: myUserId } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMsgLoading, setIsMsgLoading] = useState(false);
  
  // 관리자용 화면에서는 특정 roomId를 props나 URL 파라미터로 받아오는 것이 일반적입니다.
  // 여기서는 예시로 고정된 roomId 혹은 로직에 따른 ID를 사용한다고 가정합니다.
  const selectedChatId = 1; // 실제 환경에선 URL 파라미터 등에서 추출하세요.

  const stompClient = useRef<Client | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 스크롤 하단 고정
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // WebSocket 연결
  useEffect(() => {
    if (selectedChatId) {
      connectWebSocket(selectedChatId);
    }
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
          },
          { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
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

    const request = {
      roomId: selectedChatId,
      message: inputValue.trim(),
    };

    stompClient.current.publish({
      destination: '/pub/chat/send',
      body: JSON.stringify(request),
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });
    setInputValue('');
  };

  // 초기 메시지 내역 불러오기
  const fetchMessages = async (roomId: number) => {
    setIsMsgLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/api/messages/${roomId}?size=100`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
      });
      const result = await response.json();
      if (result.success) setMessages(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMsgLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChatId) fetchMessages(selectedChatId);
  }, [selectedChatId]);

  return (
    <div className="admin-chat-page">
      <Header />
      <div className="admin-chat-container">
        <main className="admin-chat-content">
          <div className="admin-chat-window">
            <header className="admin-chat-header">
              <h3 className="admin-header-title">관리자 채팅 모니터링</h3>
              <span className="admin-badge">ADMIN MODE</span>
            </header>

            <div className="admin-message-list" ref={scrollRef}>
              {isMsgLoading ? (
                <p className="admin-msg-status">메시지를 불러오는 중...</p>
              ) : messages.length > 0 ? (
                messages.map((msg, idx) => {
                  const isMine = msg.sender === myUserId;
                  return (
                    <div 
                      key={idx} 
                      className={`admin-message-wrapper ${isMine ? 'mine' : 'others'}`}
                    >
                      <div className="admin-msg-bubble">
                        {!isMine && <span className="admin-sender-name">{msg.senderName}</span>}
                        <p className="admin-msg-text">
                          {msg.deleted ? '삭제된 메시지입니다.' : msg.message}
                        </p>
                        <span className="admin-msg-date">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="admin-msg-status">대화 내용이 없습니다.</p>
              )}
            </div>

            <div className="admin-chat-input-wrapper">
              <form className="admin-chat-input-container" onSubmit={handleSendMessage}>
                <input 
                  type="text" 
                  placeholder="관리자 메시지를 입력하세요..." 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit" className="admin-send-btn">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminChat;