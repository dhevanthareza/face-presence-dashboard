import axios from 'axios';    

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // config.headers.Authorization = `Bearer ${your_token}`;
    // OR config.headers.common['Authorization'] = `Bearer ${your_token}`;
    config.baseURL = 'https://face.dhevantugas.my.id';

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);


export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  patch: axios.patch
};