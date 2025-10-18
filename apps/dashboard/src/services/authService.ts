export const fetchSession = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromQuery = urlParams.get("token");

  if (tokenFromQuery) {
    const meRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
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
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);

    return meRes.json();
  }
};
