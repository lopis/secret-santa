
export const login = async (formData: object) => {
  const API_URL = import.meta.env.VITE_SERVER_URL
  console.log( import.meta.env.VITE_SERVER_URL);
  
  const LOGIN = `${API_URL}/login`
  return fetch(LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
}