export const fetchSession = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromQuery = urlParams.get("token");

  if (tokenFromQuery) {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/set-cookie`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: tokenFromQuery,
        }),
        credentials: "include",
      },
    );

    if (!res.ok) throw new Error("No se pudo guardar la cookie");

    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }

  const meRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  if (!meRes.ok) throw new Error("Sesión no válida");

  return meRes.json();
};
