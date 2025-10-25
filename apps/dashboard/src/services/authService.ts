class AuthService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL;
  }

  fetchSession = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromQuery = urlParams.get("token");

    if (tokenFromQuery) {
      const meRes = await fetch(`${this.baseUrl}/auth/me`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: tokenFromQuery,
          message: "Login via token in query params" + tokenFromQuery,
        }),
      });

      if (!meRes.ok) throw new Error("Sesión no válida");

      // Limpiar el token de la URL
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      return meRes.json();
    }

    // Si no hay token en query, usar cookie
    const res = await fetch(`${this.baseUrl}/auth/me`, {
      method: "POST", // Cambiar a POST para consistencia
      credentials: "include",
    });

    if (!res.ok) throw new Error("Sesión no válida");
    return res.json();
  };

  logout = async () => {
    const res = await fetch(`${this.baseUrl}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Error al cerrar sesión");
    }

    return res.json();
  };
}

export const authService = new AuthService();
