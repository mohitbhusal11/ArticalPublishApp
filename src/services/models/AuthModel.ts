export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
}

export interface ForgotOTPResponse {
  result: boolean;
  message: string;
  messageUser: string;
  payload: {
    otp: string;
    mobile: string;
  };
}

export interface VerifyOTPResponse {
  result: boolean;
  message: string;
  messageUser: string;
  payload: {
    otp: string;
    mobile: string;
  };
}
