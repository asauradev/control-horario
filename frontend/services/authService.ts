const API_URL = "http://localhost:3000"; // URL del backend

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (response.ok) {
    localStorage.setItem("token", data.access_token);
    return { success: true, token: data.access_token };
  } else {
    return { success: false, message: data.message };
  }
};

export const startWork = async () => {
  const token = localStorage.getItem("token");
  if (!token) return { success: false, message: "No hay token disponible" };

  const response = await fetch(`${API_URL}/worklog/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.ok ? { success: true } : { success: false, message: "Error al iniciar jornada" };
};

export const pauseWork = async () => {
  const token = localStorage.getItem("token");
  if (!token) return { success: false, message: "No hay token disponible" };

  const response = await fetch(`${API_URL}/worklog/pause`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.ok ? { success: true } : { success: false, message: "Error al pausar jornada" };
};

export const resumeWork = async () => {
  const token = localStorage.getItem("token");
  if (!token) return { success: false, message: "No hay token disponible" };

  try {
    const response = await fetch(`${API_URL}/worklog/resume`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true };
    } else {
      console.error("❌ Error al reanudar jornada:", data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("❌ Error en la petición:", error);
    return { success: false, message: "Error al conectar con el servidor." };
  }
};

export const finishWork = async () => {
  const token = localStorage.getItem("token");
  if (!token) return { success: false, message: "No hay token disponible" };

  console.log("📡 Enviando petición a /worklog/finish...");

  try {
    const response = await fetch(`${API_URL}/worklog/finish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ Jornada finalizada correctamente en el backend.");
      return { success: true };
    } else {
      console.error("❌ Error al finalizar jornada:", data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("❌ Error en la petición:", error);
    return { success: false, message: "Error al conectar con el servidor." };
  }
};

export const getHistory = async () => {
  const token = localStorage.getItem("token");
  if (!token) return { success: false, message: "No hay token disponible" };

  console.log("📡 Solicitando historial de jornadas...");

  try {
    const response = await fetch(`${API_URL}/worklog/history`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ Historial recibido:", data);
      return { success: true, history: data };
    } else {
      console.error("❌ Error al obtener historial:", data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("❌ Error en la petición:", error);
    return { success: false, message: "Error al conectar con el servidor." };
  }
};





