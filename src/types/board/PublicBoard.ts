export interface PublicBoardItem {
  chatRoomId: number;
  best: boolean;
  likeCnt: number;
  dislikeCnt: number;
  title: string;
  tag: 'ADOPT' | 'REJECT';
  author: string;
  createdAt: string; // ISO DateTime string
}
