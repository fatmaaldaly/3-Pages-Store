import { getItem, removeItem, setItem } from '../utils/mmkv';


interface LoginResponse {
  accessToken: string;
  id: number;
  username: string;
  
}

interface UserResponse {
  id: number;
  username: string;
  
}


// login
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const res = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok || !data.accessToken) {
    throw new Error(data.message || 'Login failed');
  }
  //persist token
  setItem('accessToken', data.accessToken);
  return data;
};


// get user info
export const getMe = async (token?: string): Promise<UserResponse | null> => {
  const accessToken = token ?? await getItem('accessToken');
  if (!accessToken) return null;

  const res = await fetch('https://dummyjson.com/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch user');
  return data;
};


// logout
export const logout = async () => {
  removeItem('accessToken');
};









