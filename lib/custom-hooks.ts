import React from 'react';
import Router from 'next/router';
import useSWR from 'swr';
import axios from './axios';

export function useIsAuthenticated(setLoading) {
  React.useEffect(() => {
    axios
      .get('/v1/backend/auth/user')
      .then(() => {
        Router.replace('/');
      })
      .catch(error => {
        setLoading(false);
      });
  }, [setLoading]);
}

export function useOnClickOutside(ref, handler) {
  React.useEffect(
    () => {
      const listener = event => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}

export function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Return a cleanup function that will be called every time ...
      // ... React.useEffect is re-called. React.useEffect will only be re-called ...
      // ... if value changes (see the inputs array below).
      // This is how we prevent debouncedValue from changing if value is ...
      // ... changed within the delay period. Timeout gets cleared and restarted.
      // To put it in context, if the user is typing within our app's ...
      // ... search box, we don't want the debouncedValue to update until ...
      // ... they've stopped typing for more than 500ms.
      return () => {
        clearTimeout(handler);
      };
    },
    // Only re-call effect if value changes
    // You could also add the "delay" var to inputs array if you ...
    // ... need to be able to change that dynamically.
    [delay, value]
  );

  return debouncedValue;
}

export function useIsOnline() {
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
  }, []);

  return isOnline;
}

export function useFormErrors() {
  const [errors, setErrors] = React.useState([]);
  const clearError = field =>
    setErrors(errors.filter(error => error.field !== field));
  const hasError = field => errors.some(error => error.field === field);
  const getError = field => errors.find(error => error.field === field).message;

  return { errors, setErrors, clearError, hasError, getError };
}

export function useRequest(request, { initialData, ...config } = {}) {
  return useSWR(
    request ? JSON.stringify(request) : null,
    () =>
      axios(request || {}).then(response => {
        if (response?.data?.data) return response?.data?.data;
        return response?.data;
      }),
    {
      ...config,
      initialData: initialData && {
        status: 200,
        statusText: 'InitialData',
        headers: {},
        data: initialData,
      },
    }
  );
}

export function useIsMounted() {
  const ref = React.useRef(false);

  React.useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  }, []);

  return () => ref.current;
}

export const useSocketConnect = ({ io, token, setSocket }) => {
  React.useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      reconnect: true,
      forceNew: true,
    });

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    setSocket(socket);
    return () => socket.close();
  }, [io, setSocket, token]);
};
