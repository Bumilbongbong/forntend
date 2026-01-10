// 공통 API 응답 (ApiResponse)
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success: boolean;
}

// 로그인 요청 DTO
export interface LoginRequestDto {
  email: string;
  password: string;
}

// 로그인 응답 DTO
export interface LoginResponseDto {
  refreshToken: string;
  accessToken: string;
}

// 회원가입 요청 DTO
export interface SignupRequestDto {
  email: string;
  name: string;
  password: string;
  studentNum: number;
}

// 회원가입 응답 DTO
export interface SignupResponseDto {
  userId: number;
}
