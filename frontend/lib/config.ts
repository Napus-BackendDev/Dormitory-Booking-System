export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    version: 'v1',
    timeout: 10000,
  },
  
  app: {
    name: 'MFU Dorm Maintenance System',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    debug: process.env.NODE_ENV === 'development',
  },
};

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout', 
    profile: '/auth/me',
  },
  
  tickets: {
    list: '/tickets',
    create: '/tickets',
    detail: (id: string) => `/tickets/${id}`,
    update: (id: string) => `/tickets/${id}`,
    assign: (id: string) => `/tickets/${id}/assign`,
  },
  
  users: {
    list: '/users',
    profile: '/users/profile',
  },
  
  uploads: '/uploads',
};