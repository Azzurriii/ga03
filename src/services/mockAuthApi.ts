// Mock authentication backend
// In a real app, these would be actual API endpoints

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface RefreshResponse {
  accessToken: string;
}

// Mock tokens
const generateToken = (prefix: string): string => {
  return `${prefix}_${Math.random().toString(36).substring(2)}${Date.now()}`;
};

// Store refresh tokens (in a real app, this would be server-side)
const validRefreshTokens = new Set<string>();

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthApi = {
  // Email/Password Login
  login: async (email: string, password: string): Promise<AuthResponse> => {
    await delay(800); // Simulate network delay

    // For demo purposes, accept any valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const accessToken = generateToken('access');
    const refreshToken = generateToken('refresh');
    
    validRefreshTokens.add(refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: Math.random().toString(36).substring(7),
        email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      },
    };
  },

  // Google Sign-In
  googleLogin: async (_credential: string): Promise<AuthResponse> => {
    await delay(800);

    // In a real app, you would verify the Google credential with Google's API
    // For demo, we just generate mock data
    
    const accessToken = generateToken('access');
    const refreshToken = generateToken('refresh');
    
    validRefreshTokens.add(refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: Math.random().toString(36).substring(7),
        email: 'google.user@gmail.com',
        name: 'Google User',
        picture: undefined,
      },
    };
  },

  // Refresh Access Token
  refreshToken: async (refreshToken: string): Promise<RefreshResponse> => {
    await delay(500);

    if (!validRefreshTokens.has(refreshToken)) {
      throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const accessToken = generateToken('access');

    return {
      accessToken,
    };
  },

  // Validate Token
  validateToken: async (accessToken: string): Promise<boolean> => {
    await delay(200);
    
    // In a real app, verify token signature and expiration
    return accessToken.startsWith('access_');
  },

  // Logout
  logout: async (refreshToken: string): Promise<void> => {
    await delay(300);
    
    // Remove refresh token from valid tokens
    validRefreshTokens.delete(refreshToken);
  },
};
