export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getPayload = () => {
  const token = getToken();

  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    return null;
  }
};

export const getCurrentUser = () => {
  const payload = getPayload();

  if (!payload) return null;

  return {
    id: payload._id,
    IDnumber: payload.IDnumber,
    name: payload.name,
    role: payload.role,
  };
};

export const hasRole = (role) => {
  const user = getCurrentUser();
  return user?.role === role;
};