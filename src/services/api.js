const getApiUrl = (endpoint) => {
  if (endpoint.startsWith('/auth')) {
    return `${import.meta.env.VITE_AUTH_API_BASE_URL}${endpoint}`;
  }
  return `${import.meta.env.VITE_REQUESTS_API_BASE_URL}${endpoint}`;
};

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const url = getApiUrl(endpoint);

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Add X-User-Id header for requests to the requests microservice
  if (userId && !endpoint.startsWith('/auth')) {
    defaultHeaders['X-User-Id'] = userId;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    // Handle cases with no content
    if (response.status === 204) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
};

export const getAuthenticatedUsers = async () => {
  try {
    const response = await apiFetch('/auth/authenticated-users');
    return response;
  } catch (error) {
    throw error;
  }
};
