/* ===============================
 * 공통 응답 타입
 * =============================== */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }
  
  /* ===============================
   * WebSocket
   * =============================== */
  export interface SendChatMessageRequest {
    roomId: number;
    message: string;
  }
  
  export interface ChatMessage {
    message: string;
    sender: number;
    senderName: string;
    createdAt: string;
    deleted: boolean;
  }
  
  /* ===============================
   * 메시지 목록 조회
   * =============================== */
  export type GetChatMessagesResponse = ApiResponse<ChatMessage[]>;
  
  /* ===============================
   * 내 채팅 상세
   * =============================== */
  export interface MyChatDetail {
    chatRoomId: number;
    title: string;
    tag: string;
    author: string;
    studentNum: number;
    createdAt: string;
  }
  
  export type GetMyChatDetailResponse = ApiResponse<MyChatDetail>;
  
  /* ===============================
   * 내 채팅 목록
   * =============================== */
  export interface MyChatListItem {
    chatRoomId: number;
    best: boolean;
    likeCnt: number;
    dislikeCnt: number;
    title: string;
    tag: string;
    author: string;
    createdAt: string;
  }
  
  export type GetMyChatListResponse = ApiResponse<MyChatListItem[]>;
  