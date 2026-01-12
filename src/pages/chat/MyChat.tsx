import React, { useState, useEffect } from 'react';
import { Header } from '../../components';
import ChatCreate from '../../components/ChatCreate';
import './styles/MyChat.css';

interface ChatRoom {
  chatRoomId: number;
  title: string;
  tag: string; // 'ADOPT', 'PENDING' 등이 올 것으로 보임
  author: string;
  createdAt: string;
}

const MyChat = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 태그 코드를 화면용 텍스트와 클래스로 변환하는 헬퍼 함수
  const getTagInfo = (tag: string) => {
    switch (tag) {
      case 'ADOPT': return { text: '채택됨', className: 'status-adopted' };
      case 'PENDING': return { text: '진행 중', className: 'status-ing' };
      case 'REJECT': return { text: '반려됨', className: 'status-rejected' };
      default: return { text: tag, className: 'status-ended' };
    }
  };

  const fetchMyChats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8081/api/chats/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('데이터를 불러오는 데 실패했습니다.');
      }

      const result = await response.json();
      
      // 포인트: result가 아니라 result.data를 설정해야 함
      if (result.success && Array.isArray(result.data)) {
        setChats(result.data);
      } else {
        setChats([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류 발생');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyChats();
  }, []);

  return (
    <div className="mychat-page">
      <Header />
      
      <div className="mychat-container">
        <aside className="mychat-sidebar">
          <div className="new-chat-btn" onClick={() => setIsModalOpen(true)}>
            <span className="edit-icon">✎</span> 새 채팅
          </div>
          
          <div className="chat-list-section">
            <h3 className="list-title">
              <span className="chat-icon">💬</span> 내 채팅
            </h3>
            
            {isLoading ? (
              <p className="status-message">로딩 중...</p>
            ) : error ? (
              <p className="status-message error">{error}</p>
            ) : (
              <ul className="chat-list">
                {chats.length > 0 ? (
                  chats.map((chat) => {
                    const tagInfo = getTagInfo(chat.tag);
                    return (
                      <li key={chat.chatRoomId} className="chat-item">
                        <div className="chat-info">
                          <span className="chat-item-title">{chat.title}</span>
                        </div>
                        <span className={`chat-status-badge ${tagInfo.className}`}>
                          {tagInfo.text}
                        </span>
                      </li>
                    );
                  })
                ) : (
                  <p className="status-message">참여 중인 채팅이 없습니다.</p>
                )}
              </ul>
            )}
          </div>
        </aside>

        <main className="mychat-content">
          {/* 모달이 열려있지 않을 때만 안내 문구 표시 */}
          {!isModalOpen && (
            <div className="empty-state">
              {chats.length > 0 ? (
                <>
                  <h2>채팅을 선택해주세요</h2>
                  <p>왼쪽 목록에서 대화를 선택하거나 새 채팅을 시작하세요.</p>
                </>
              ) : (
                <>
                  <h2>대화할 주제를 찾아보세요</h2>
                  <p>왼쪽 상단의 '새 채팅' 버튼을 눌러 시작하세요.</p>
                </>
              )}
            </div>
          )}
          
          <ChatCreate 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onChatCreated={() => {
              fetchMyChats();
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default MyChat;