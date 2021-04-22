import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

const snakeToCamel = str =>
  String(str).replace(/([-_]\w)/g, g => g[1].toUpperCase());
  
const camelToSnake = str => {
  if (String(str).includes(':')) return str;
  return String(str)
    .replace(/[\w]([A-Z])/g, function(m) {
      return `${m[0]}_${m[1]}`;
    })
    .toLowerCase();
};

// https://github.com/axios/axios#request-config
const customAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

customAxios.interceptors.request.use(
  function(config) {
    const { transformToCamelCase = true } = config;
    const isFormData = config.data instanceof FormData;

    const configCopy = Object.assign({}, config);

    if (configCopy.params) {
      Object.keys(configCopy.params).forEach(key => {
        configCopy.params[key] = camelToSnake(configCopy.params[key]);
      });
    }

    if (configCopy.data && transformToCamelCase) {
      if (isFormData) {
        const formData = new FormData();

        for (const pair of configCopy.data.entries()) {
          formData.set(camelToSnake(pair[0]), pair[1]);
        }

        configCopy.data = formData;
      } else {
        configCopy.data = snakecaseKeys(configCopy.data, { deep: true });
      }
    }

    return configCopy;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

customAxios.interceptors.response.use(
  function(response) {
    const { transformToCamelCase = true } = response.config;

    return {
      ...response,
      data:
        response.data && transformToCamelCase
          ? camelcaseKeys(response.data, { deep: true })
          : response.data,
    };
  },
  function(error) {
    if (!error?.response?.config) {
      console.log(error);
    }

    const { transformToCamelCase = true } = error.response.config;

    if (error.response.status === 422 && transformToCamelCase) {
      error.response.data.errors = error.response.data.errors.map(error => ({
        ...error,
        field: snakeToCamel(error.field),
      }));
    }

    return Promise.reject(error);
  }
);

export default customAxios;
