import api from '../client';

interface AuthRequest {
  username: string;
  password: string;
}

interface AuthResponse {
  username: string;
}

export async function signUp(payload: AuthRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/signup', payload);
  return data;
}

export async function signIn(payload: AuthRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/signin', payload);
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}
