import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('roarworks_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthEndpoint = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('roarworks_token');
        localStorage.removeItem('roarworks_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// API endpoints interfaces
export interface TourBookingPayload {
  email: string;
  full_name: string;
  phone?: string;
  booking_type: string;
  plan_interest: string;
  start_date?: string;
  end_date?: string;
  preferred_time?: string;
  notes?: string;
  terms_agreed: boolean;
}

export interface BookingRecord extends TourBookingPayload {
  id: string;
  status: 'NEW' | 'CONTACTED' | 'TOUR_SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
  updated_at: string;
  assigned_to_user_id?: string;
}

export interface OfferingRecord {
  id: string;
  name: string;
  slug: string;
  tag?: string;
  description: string;
  price_pkr: number;
  billing_period: string;
  capacity: string;
  shift_type: string;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  display_order: number;
}

export interface BlogPostRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  read_time: string;
  published: boolean;
  published_at: string;
  author_name?: string;
  created_at: string;
}

export interface TeamMemberRecord {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo_url: string;
  email?: string;
  linkedin_url?: string;
  twitter_url?: string;
  display_order: number;
  is_active?: boolean;
}

export interface PartnerRecord {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  category: string;
  description?: string;
  is_featured?: boolean;
  display_order?: number;
}

export interface TestimonialRecord {
  id: string;
  name: string;
  role: string;
  avatar: string;
  stars: number;
  content: string;
  display_order: number;
  is_active: boolean;
}

export const authApi = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const bookingsApi = {
  create: (data: TourBookingPayload) => api.post('/bookings', data),
  list: (params?: { status?: string; search?: string }) => api.get('/bookings', { params }),
  get: (id: string) => api.get(`/bookings/${id}`),
  update: (
    id: string,
    data: Partial<Omit<TourBookingPayload & BookingRecord, 'phone' | 'start_date' | 'end_date' | 'preferred_time' | 'notes'>> & {
      phone?: string | null;
      start_date?: string | null;
      end_date?: string | null;
      preferred_time?: string | null;
      notes?: string | null;
    }
  ) => api.patch(`/bookings/${id}`, data),
  delete: (id: string) => api.delete(`/bookings/${id}`),
};

export const offeringsApi = {
  list: (params?: { shift?: string; include_inactive?: boolean }) => api.get('/offerings', { params }),
  get: (slugOrId: string) => api.get(`/offerings/${slugOrId}`),
  create: (data: Omit<OfferingRecord, 'id'>) => api.post('/offerings', data),
  update: (id: string, data: Partial<Omit<OfferingRecord, 'tag'>> & { tag?: string | null }) => api.patch(`/offerings/${id}`, data),
  delete: (id: string) => api.delete(`/offerings/${id}`),
};

export const blogApi = {
  list: (params?: { category?: string; search?: string; all_posts?: boolean }) => api.get('/blog', { params }),
  get: (slug: string) => api.get(`/blog/${slug}`),
  create: (data: any) => api.post('/blog', data),
  update: (id: string, data: any) => api.patch(`/blog/${id}`, data),
  delete: (id: string) => api.delete(`/blog/${id}`),
};

export const teamApi = {
  list: (params?: { include_inactive?: boolean }) => api.get('/team', { params }),
  create: (data: Omit<TeamMemberRecord, 'id' | 'created_at' | 'updated_at'>) => api.post('/team', data),
  update: (
    id: string,
    data: Partial<Omit<TeamMemberRecord, 'email' | 'linkedin_url' | 'twitter_url'>> & {
      email?: string | null;
      linkedin_url?: string | null;
      twitter_url?: string | null;
    }
  ) => api.patch(`/team/${id}`, data),
  delete: (id: string) => api.delete(`/team/${id}`),
};

export const partnersApi = {
  list: () => api.get('/partners'),
  create: (data: Omit<PartnerRecord, 'id' | 'created_at' | 'updated_at'>) => api.post('/partners', data),
  update: (
    id: string,
    data: Partial<Omit<PartnerRecord, 'website_url' | 'description'>> & {
      website_url?: string | null;
      description?: string | null;
    }
  ) => api.patch(`/partners/${id}`, data),
  delete: (id: string) => api.delete(`/partners/${id}`),
};

export const testimonialsApi = {
  list: (params?: { include_inactive?: boolean }) => api.get('/testimonials', { params }),
  create: (data: Omit<TestimonialRecord, 'id' | 'created_at' | 'updated_at'>) => api.post('/testimonials', data),
  update: (id: string, data: Partial<TestimonialRecord>) => api.patch(`/testimonials/${id}`, data),
  delete: (id: string) => api.delete(`/testimonials/${id}`),
};

export const statsApi = {
  getDashboard: () => api.get('/stats/dashboard'),
};

export const rebacApi = {
  check: (data: { user_id: string; action: string; resource_type: string; resource_id: string }) => api.post('/rebac/check', data),
  listTuples: (params?: any) => api.get('/rebac/tuples', { params }),
  grant: (data: any) => api.post('/rebac/grant', data),
  revoke: (data: any) => api.post('/rebac/revoke', data),
};
