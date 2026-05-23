import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import axios from 'axios';

// Graceful automatic retry interceptor on HTTP 429 (rate-limiting or concurrent request locks)
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (response && response.status === 429 && config) {
      config.__retryCount = config.__retryCount || 0;
      if (config.__retryCount < 3) {
        config.__retryCount += 1;
        // Wait with progressive progressive sleep delay to let the rate limits clear
        const delay = config.__retryCount * 1200;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return axios(config);
      }
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
