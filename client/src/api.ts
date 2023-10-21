export const login = async (formData: object) => {
  return fetch(
    `${import.meta.env.VITE_SERVER_URL}/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }
  );
}

export const assignSantas = async () => {
  return fetch(`${import.meta.env.VITE_SERVER_URL}/assign`);
}