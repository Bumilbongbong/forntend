// src/hooks/useStompClient.ts
import { useEffect, useRef, useState } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type{ ChatMessage, SendChatMessageRequest } from "../types/chat/chat.types";

const WS_URL = "http://localhost:8081/ws-chat";

interface UseStompClientProps {
  roomId: number;
  accessToken: string;
  onMessage: (message: ChatMessage) => void;
}

export const useStompClient = ({
  roomId,
  accessToken,
  onMessage,
}: UseStompClientProps) => {
  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!roomId || !accessToken) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        setConnected(true);

        client.subscribe(
          `/sub/chat/room/${roomId}`,
          (message: IMessage) => {
            const parsed: ChatMessage = JSON.parse(message.body);
            onMessage(parsed);
          }
        );
      },

      onDisconnect: () => setConnected(false),
      onStompError: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [roomId, accessToken]);

  const sendMessage = (payload: SendChatMessageRequest) => {
    if (!clientRef.current || !connected) return;

    clientRef.current.publish({
      destination: "/pub/chat/send",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  };

  return {
    connected,
    sendMessage,
  };
};
