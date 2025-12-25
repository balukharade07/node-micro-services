import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export function getHeaders(token) {
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
}

class ApiService {
  constructor() {
    const baseURL = process.env.AUTH_SERVICE_URL;

    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this._initializeResponseInterceptor();
    this._initResponseInterceptor();
  }

  _initializeResponseInterceptor() {}

  _initResponseInterceptor() {
    this.api.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        // log internally
        console.error('Service call failed:', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.response?.data?.message,
        });

        // forward clean error
        return Promise.reject({
          status: error.response?.status ?? 500,
          message: error.response?.data?.message ?? 'Service unavailable',
        });
      },
    );
  }

  // ---------- HTTP Methods ----------
  get(url, config = {}) {
    return this.api.get(url, config);
  }

  post(url, data = {}, config = {}) {
    return this.api.post(url, data, config);
  }

  put(url, data = {}, config = {}) {
    return this.api.put(url, data, config);
  }

  patch(url, data = {}, config = {}) {
    return this.api.patch(url, data, config);
  }

  delete(url, config = {}) {
    return this.api.delete(url, config);
  }
}

// Export single instance (Singleton)
export default new ApiService();
