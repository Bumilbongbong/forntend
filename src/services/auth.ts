import type { LoginRequestDto, SignupRequestDto } from "../types/auth/request";
import type { SignupResponseDto, LoginResponseDto } from "../types/auth/response";
import type { ApiResponse } from "../types/api";

const API_BASE = 'http://localhost:8081';

export async function login(request: LoginRequestDto): Promise<LoginResponseDto> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const text = await res.text();
  let result: ApiResponse<LoginResponseDto> | undefined;
  try {
    result = text ? JSON.parse(text) : undefined;
  } catch {
    throw new Error('서버 응답 데이터 형식이 올바르지 않습니다.');
  }
  if (!result) {
    throw new Error('서버에서 데이터를 반환하지 않았습니다.');
  }
  if (!res.ok || !result.success) {
    throw new Error(result.message || '로그인에 실패했습니다.');
  }
  if (!result.data?.refreshToken || !result.data?.accessToken) {
    throw new Error('토큰이 올바르게 반환되지 않았습니다.');
  }
  return result.data;
}

export async function signup(request: SignupRequestDto): Promise<SignupResponseDto> {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const text = await res.text();
  let result: ApiResponse<SignupResponseDto> | undefined;
  try {
    result = text ? JSON.parse(text) : undefined;
  } catch {
    throw new Error('서버 응답 데이터 형식이 올바르지 않습니다.');
  }
  if (!result) {
    throw new Error('서버에서 데이터를 반환하지 않았습니다.');
  }
  if (!res.ok || !result.success) {
    throw new Error(result.message || '회원가입에 실패했습니다.');
  }
  if (!result.data?.userId) {
    throw new Error('회원 ID가 올바르게 반환되지 않았습니다.');
  }
  return result.data;
}
