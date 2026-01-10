import type { PublicBoardItem } from '../types/board/PublicBoard';
import type { ApiResponse } from '../types/api';

const API_BASE = 'http://localhost:8081';

export type DateFilter = 'RECENT' | 'OLDEST';
export type TagFilter = 'IN_PROGRESS' | 'ADOPT' | 'REJECT' | 'END';

export async function fetchPublicBoard(params?: {
  datefilter?: DateFilter;
  tag?: TagFilter;
}): Promise<PublicBoardItem[]> {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('인증이 필요합니다.');
  }

  // 태그 검증: ADOPT, REJECT만 허용
  if (params?.tag && params.tag !== 'ADOPT' && params.tag !== 'REJECT') {
    throw new Error('필터링은 채택(ADOPT) 또는 반려(REJECT)만 선택할 수 있습니다.');
  }

  const searchParams = new URLSearchParams();

  if (params?.datefilter) searchParams.append('datefilter', params.datefilter);
  if (params?.tag) searchParams.append('tag', params.tag);

  const url = `${API_BASE}/api/chats` + (searchParams.size > 0 ? `?${searchParams}` : '');

  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  const text = await res.text();
  let apiResponse: ApiResponse<PublicBoardItem[]>;
  
  try {
    apiResponse = text ? JSON.parse(text) : { success: false, data: [] };
  } catch {
    throw new Error('서버 응답 데이터 형식이 올바르지 않습니다.');
  }
  
  if (!res.ok || !apiResponse.success) {
    throw new Error(apiResponse.message || '게시글 불러오기에 실패했습니다.');
  }
  
  // ApiResponse 구조에서 data 추출
  if (apiResponse.data && Array.isArray(apiResponse.data)) {
    return apiResponse.data;
  }
  
  return [];
}

export async function searchPublicBoard(query: string): Promise<PublicBoardItem[]> {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    throw new Error('인증이 필요합니다.');
  }

  const searchParams = new URLSearchParams();
  searchParams.append('query', query);

  const url = `${API_BASE}/api/chats/search?${searchParams}`;

  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  const text = await res.text();
  let apiResponse: ApiResponse<PublicBoardItem[]>;
  
  try {
    apiResponse = text ? JSON.parse(text) : { success: false, data: [] };
  } catch {
    throw new Error('서버 응답 데이터 형식이 올바르지 않습니다.');
  }
  
  if (!res.ok || !apiResponse.success) {
    throw new Error(apiResponse.message || '검색에 실패했습니다.');
  }
  
  // ApiResponse 구조에서 data 추출
  if (apiResponse.data && Array.isArray(apiResponse.data)) {
    return apiResponse.data;
  }
  
  return [];
}
