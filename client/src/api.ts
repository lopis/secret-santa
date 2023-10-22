export const login = async (formData: object) => {
  return fetch(
    `${import.meta.env.VITE_SERVER_URL || ''}/login`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(formData),
    }
  );
}

export const assignSantas = async () => {
  return fetch(
    `${import.meta.env.VITE_SERVER_URL || ''}/assign`,
    {
      credentials: 'include',
    }
  );
}