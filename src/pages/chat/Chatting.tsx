// src/pages/chat/Chatting.tsx
import { useEffect, useState } from "react";
import type {
    GetChatMessagesResponse,
    GetMyChatDetailResponse,
    ChatMessage,
  } from "../../types/chat/chat.types";
import { useStompClient } from "../../hooks/useStompClient";
import "./styles/Chatting.css";

interface Props {
  chatRoomId: number;
}


const Chatting = ({ chatRoomId }: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [roomTitle, setRoomTitle] = useState("");

  const accessToken = localStorage.getItem("accessToken") ?? "";

  /* ======================
   * WebSocket
   * ====================== */
  const { connected, sendMessage } = useStompClient({
    roomId: chatRoomId,
    accessToken,
    onMessage: (msg) => {
      if (!msg.deleted) {
        setMessages((prev) => [...prev, msg]);
      }
    },
  });

  /* ======================
   * REST API
   * ====================== */
  useEffect(() => {
    fetchRoomDetail();
    fetchMessages();
  }, [chatRoomId]);

  const fetchRoomDetail = async () => {
    const res = await fetch(
      `http://localhost:8081/api/chats/me/${chatRoomId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data: GetMyChatDetailResponse = await res.json();
    setRoomTitle(data.data.title);
  };

  const fetchMessages = async () => {
    const res = await fetch(
      `http://localhost:8081/api/messages/${chatRoomId}?page=0&size=100&sort=createdAt,asc`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data: GetChatMessagesResponse = await res.json();
    setMessages(data.data.filter((m) => !m.deleted));
  };

  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage({
      roomId: chatRoomId,
      message: input,
    });

    setInput("");
  };

  return (
    <div className="chatting-container">
      <div className="chat-header">
        <h2>{roomTitle}</h2>
        <span className={connected ? "on" : "off"}>
          {connected ? "● 연결됨" : "○ 끊김"}
        </span>
      </div>

      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className="message">
            <strong>{m.senderName}</strong>
            <p>{m.message}</p>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <button onClick={handleSend} disabled={!connected}>
          전송
        </button>
      </div>
    </div>
  );
};

export default Chatting;
