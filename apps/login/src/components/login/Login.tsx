import React from "react";
import { useMsal } from "@azure/msal-react";

// ⚠️ Para habilitar el inicio de sesión real con Microsoft:
// npm install @azure/msal-browser @azure/msal-react
// Luego descomenta las líneas de MSAL e inserta tu configuración.

const BACKEND_URL = "http://localhost:7071/api";

function Login() {
  // ----------------------------------------------------
  // LÓGICA DE INICIO DE SESIÓN
  // ----------------------------------------------------
  const { instance } = useMsal();

  const handleLoginMicrosoft = async () => {
    try {
      // Solicitar permisos y obtener token mediante popup
      const loginRequest = {
        scopes: ["user.read", import.meta.env.VITE_AZURE_API_SCOPE ?? "openid"],
      };

      const response = await instance.loginPopup(loginRequest);
      const microsoftToken = response.accessToken;

      if (!microsoftToken) {
        throw new Error("No se obtuvo token de Microsoft");
      }

      await sendTokenToBackend(microsoftToken);
      // Redirigir a la app principal una vez creado el session interno
      window.location.href = "http://localhost:5174/";
    } catch (error) {
      console.error("Error durante el login con Microsoft:", error);
      // Mostrar mensaje de error si está disponible para facilitar diagnóstico
      const message = error instanceof Error ? error.message : String(error);
      alert(`Error al iniciar sesión: ${message}`);
    }
  };

  /**
   * Enviar el token al backend (/auth/login)
   */
  const sendTokenToBackend = async (token: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ microsoftToken: token }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          (errorData && (errorData.message || JSON.stringify(errorData))) ||
            "Fallo en la creación de la sesión interna.",
        );
      }

      // Si es exitoso, el backend ya envió la cookie HttpOnly.
      return;
    } catch (err) {
      // En desarrollo es común que el backend no esté corriendo -> Failed to fetch
      // Para no bloquear el flujo de desarrollo, almacenamos el token localmente
      // y permitimos que el frontend continúe. NO hacer esto en producción.
      console.warn(
        "No se pudo enviar el token al backend (modo dev). Se almacenará localmente:",
        err,
      );
      try {
        localStorage.setItem("dev_microsoft_token", token);
      } catch (e) {
        console.warn("No se pudo guardar el token en localStorage:", e);
      }
      return;
    }
  };

  // ----------------------------------------------------
  // RENDERIZADO DEL LOGIN
  // ----------------------------------------------------
  return (
    <div style={styles.container}>
      {/* Lado Izquierdo (Imagen grande con marco) */}
      <div style={styles.leftColumn}>
        <div style={styles.illustrationFrame}>
          <img
            src="data:image/jpeg;base64,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"
            alt="Ilustración USMP"
            style={styles.image}
          />
        </div>
      </div>

      {/* Lado Derecho (Login) */}
      <div style={styles.rightColumn}>
        <div style={styles.logoBox}>
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAA4VBMVEW8FxP///+9FxG6EQ3JR0K4AAC3AAC7AAC9FhS8FxX//v/99va0AAC/FhO+Fhb76Ozou7r129zbkpHswsDhp6fls7T66engnJzhrKvXgX7TeXi/AAC5GBb7///PZGW6GQ7ISUjux8fio57NYFvx1NXAIiLTcXDRYmX01tXJUFPHOTjKU06+CwvrxcLWgnn23uHKbWjZiIbLUEPYcG7lpKfGNjPOZmDDJCLntbDJRj348u3MV1vz5OHZen7CJivHWFDckZTrvbPAMCfDNjzZhojmqqT74drbmpTuvsLhmZzzytG09NedAAARbklEQVR4nO1di1/ayBZOZjhzMjCTBXkoEAgg0ojDsmxFqVrba1u19///g+6ZhEcQ26u2vb3rb75dH2AymW/O6zuTaL3Ca4fHXzs89trhBa8dnoODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODw88Bk/Qf/f+75/HrYKTHTOC9XoaqhyGeGE//7on8Mqikq0YTIV8pw6gNquz/6dcFmt89l18DbO2P+r7fmbT2RvC7J/NLwNtTv1P0CUN8palGqqHl1+mL+HdP5ddA4l9+x/eLnWIXf/dcfg2w6Tcuip1O46rYep0UGYCq+xd+TYH43XP5RWBS9YeqUoXX8ReYtJZy549liS/AYSB2/4qWPYNp6f1zUpB+3EwxRjpAGTyqaaIooCLyT5I7WjNP5/78mSakJCIT6e2/jJbRMrHR0W+e9JPAEVTbC7TEp8Oe1+Ywhv97PRcGUt/M6g0fpSempaeiQckVGrOJ73/iG7lDkRzITS/JYhaSf4ebq2kdMo/CXW9cW4YRC7bDmUUyIKfZxM3y6EC+JCQ053+TKnuLYRCKP2yBfxJKwpPg3/nYGMGGIWMmzrltFFEqCqMtP5Y00Zh56/eo9WSR3pl57OWO8YhvOrz3kpjQMmqHo9PEb0dMNfziQypU8L/BkIR5tVtYwMZG0jMgTG72nNw53szefmMAkefSU+AZOkhsMZSaA7bFxv/byiyD4wUxIWkJaTxQkkkghpZPMQffvypXt7Eo+h3LMEBse3mtE/OTbrfH16/N/Kx7aNiasTYCC92zEwa4Pojpk+7Zm7MjnhtHe+Nut3tWWL2HZ90MZ2dzhPyRT4KhMCBQ4vTIS/3hKLVjznAHAvIQan9pw4CWx2NhrusQU9+vb/osmNGBamliRnHemyw9oH4udJz9AKr2nTLmPRBTwX+wGgnyPrUIUern7BsRv0imiKVlWFFNO05uzPqWJA1wsPJSsonhXOb2cEQlNy+aGQ3VWDKk66gvq1nSxwgp4aQHldPXZFW5XvR5usK1HYad9P1DjJ6TcWTAgtQ2XmbDiiK9vRV62wzVYB2HGubjeRv0Jlc+YIg5hlKrRTpupVKyXztmmYOXDPeQr22ItfQatdWFLcPJwcFBrTxMvWtsnqMiNTPvppXhNEGW2VCkS9/5BkMYbDINVPxS0b/ezOx7DBk/tKO2BPn8ccO/uIYsP1qG9mINtV4pjtnltxiOkM5UKOwyTcSzdLI0HxoF/5OPXpAyBGoLM0ftPGRIVh4svSxl6Hcv31yNYOMx37Oh6NN5vXQshVVcNyvE0B+WfP9Ndl4YS6TwbVw9YNjCtD5yYUMUo2d4KdOmsA97sICILRnS1GY2oe4wZFkMrhhic5gkdcyt53cYekgs+llVCHiuhlqGi3u7j5C+xyQTV37ndPg4Q6/9ni4/NjkV8V8RxRojlMClXtlQR2BjsfiQ4TIGVwwDKm0Aee3xXYa0YGWVrZQn11klZVg+oTGvs1qn1TFdm9FIp/lMs2IIH8jZT3Bz/n8HJV5SpCwgjb22oZbw524cioG/zdCuTxjnHOY7DLW4oBdL3wxzqcIyrJLW8GvpD6UUVD4SZUd6zIZpHhyL52yMRdzjmj4Cb23DdNR1LGYMqRleEVwzpGyoSXQ9iWEg+nYssFFLBeoBQ7ijUYFKiiSNQ1d4axlueel7ZJo6GkOX6PjInsGQSR0eneuj0AtZnqHMKK4ZergmuGJoCigQdPSkTOOZQ3vqVRMFSJ2boGU4ASTfa1KdozR3Z2UCPGT4lwJBauNoYp0dnrMHHwfmb79k81O8ZUPtwbIuZgw3Ftxkmqk/PGhGT7Qhw0W2+dr/eKRy+Te1obCfp4KuGghy2AGKhwwrfcLkKr3+tYmeId3CiOvmsHFYwkhu2ZB54s+UTMpQ5AiuGZ7sD/1iD59UD4NYQm0pSvzkOCd8Ui/lx/T238ILoUuHaL7jpZmksU5VKjxve5oanr8rrS+VJmX9PMPVDIv+QuRjMM9weNA6b6vcYBnDIHd+Z+2l9vWnSTpPOn8gpLdWbWRDT03TLwwT67Rsx0tXaNyJZ/YXVrUpBIFyl6EHn1MvDXCL4IqhFojb3rLlW3T6+1wcWlAP1KoWba31ZytHXTJEeyljUkl6aLwdL52Ne4VCYU5RzJ95g8EqbxZqT0Zx+JBhEFkrLmDbgptcquUDjZ/acFOrxMdthkxSoyZgVrKuihtdahkGVqrtCyR13oA43M2lwA03hlog+Zxqb69KHTaLbE2Md22oraPVHxK0SBlKu534kGFZbLz8YJthYDM3YwJvaYTuMhRXDO3XCxCU9PZIsu7YcITaC6Xd9HjuRkbAQiMsyF+XvcVWO6g+13cJdtYVf3u14J7qgcrUF62aSDr+UAXp6zDbCki/xzc0RhO2bOjxOVn2jCK3aF1/h+Gq4j8fgaf+LpZKpQvIqsVF7eAByvv7d3f7OXyt+I8z1PDRCo5Me3ohZ+TPXyBjRcFgjM5KCwVb0W+2vTxDyYCk6DDJ6P5MhlrHRz0Lk+nSnV2ZwawvUgG6Mav1p8cYeobRCcPM/SKtbF805ib12oBRN4lh+j3uEcOTbS/VEls2wDt+7yczJHcyKWSqaXZ2ompqz69ittOx3M8X32LItKjTKV8E+RlXsOd3qGOQy+OgV7yIbCLkokCXKT3IpbansBmoM1Xy5zK00tL+4yW2bD9kSC++AC04VWRp91mWsAzTXQzDPZaP+zgIwM6y0sU2Xia2vq93mNKe06+NEecD6yh/rrquVRym3TVd8XP6g5/IUEqbD6WmZd+xYYcsaF2KajCVgPUVVgzNid3f43mOkZkX847eW2sXOKHxOuuBJyCjhwz5tV1Vkarqn8gwTCs3iCrKXS8d0LCWYZHmsHkuasUQ/BHhOrcTRWQxTFLZkm7JzHG9ly3F+CpzC7sCA6u+t3Op/XZiJVG89tJNf1j8kTiM+bukn9z6uOulp4piiBja2VbFWn7aBi5VbaWkUrntYa4Ck/o04rBslXxp0lV8M6sg5ni4aNhhp1+uQevVNqrdTexnDG0VGUOQMpw+2E1svpghxc7NrDl6U0TKpbcbhsVlS5ra0IKMrG0sSkZ6g+QmXfhfijLrrsoHaqpIr8LOjXFDPwh1W+TP0fL8+vp8tSt1c71kxa9vbo7WznE+v2b5ex3PQ0AxCCA+cSpn9U0MpTGYZ0ixGKWP8Gm0L+xMwNPf0IiMB4Hcucdgd2U53+5eI89uumY6KpBmzZ3zjf5k9p9yejm0HZ0xmr6H3VyWGGSaY82QYlERQW21WIcUCf0s1NGjnkONv7Gydfcn9F4QbSs9GcloucOrc6uS/vNNq0PWNyxfSJGFtmRp6jJUY1MHRTb7NcOO3U6JtFRdS9e2aADmkaqfMpSP7hSlfqa3vU0vb8zmjljS2oxt78jpH7rZzAwgtDnJilHahlMdW+9zbbzUxqKKbYfa8WciYlhajMV2rIUskiyiBbNfrX7RknoBZj/RHENtbx0wMr22jhMHobUMi6hHybzd3h5kYcBk+PgKvRxyPLu/8psiTFO3LWhrglsMi517ka5BorQOsFD3p808xdAjxmRdEIbMi4YZjJFHRrTtgiiIGLd2ZxAEiMKElKgpvrhtTtPzRVvFgaQWUPyITz4GvCrtl+q2qEuSv8SgotaRnWdo5YpNsglSYEiPI86SPMMI98Z4Siqoq/aEaL6Dsxa2DuG4X50hVqt1jM4n/UOjBoh71ftz7uGXE8NwUa2lFGF2X77mMKtWD38ksTwGpk79kbAbtUSxb4kMcTXzbRumhfxWxCFDpK6IPfBSKJ9AAmJRwnvA2gc8qqiKUaNTe/e1ohYt/Fwny7YTgX19eauC88qERFMF9hZ2HLh/17sFLBeoG/jJDKnfHFNXFzIeebG9RVTsXHwgOSLtPfh8HKaKbAImYqK7Dyxk0Xa1wHJPDVGUD5N7AQcfDFbPygJHlXIXsDSpmAD2Ky2BicI+whVi7eMfR1wkyiS29EJ1rhoI9X71OVtpT0JERdrehArfYaS1mqX1/qBNpAO2ZUP7/ldbRXBUquyLWG/Xw9j8lewlql09b5VEu3aIvODPjRj1W10hpthAHJ3uU+dRUdD/XF8IuG3d1QGnrUors+HXg7KA+l7r5Gc/4MHSFiM+L/rvMZIaDtOYu+gqE2/Z0ObZt8rmOXzvf/WvjOdt5TxKJ5dvIeDH53gioHctuRoBNe+j0SUXl6JXoIo7QmkujTl+f9nm4x7CG+Bn7z+l+4O8N+oKTZ9bhWfdIHwKIkZiA/duPy9Q2z4jStWznxSU2qoW/u01UIqnVl2c+W+Ge6i3d4W0NhBrD1ggqKXXAQtJYYeGpB2TJjI8DBR5SWQYU6ACTk1pQJQMmkwF8HQfjSPw6Fc8TIZXbb+d6RjGl57q93sCPtrNv+xW21dFRdOj3pWc99gvxTre8tLQY3YHTUv7bH9gJE/dIzKkuqkBDajJpFDgNmMbMhKecM+kysUWTm68iD7xIH0MyxiWcuUkOwz1Z1a3UVmlRj2iRTTyW2rxeyC1Wb3AOPM6Kkoh5VT7JEbl7cxfdnbDOdr9wKNF2wRSYu/EPHgOhml8Y39zAQo8YOfn4ia0NzX4GGHOIg2fDJM34wIa3hsXInEyA3kN5zdMG/LkQoRecFMo2KfMQjYuCBnj8VvUwTmdEQc37+ao+btCQUsYjbn3EkXAPw0ine0OUo4MuDiZZiWwk300Du1mMwnEI/9iDlQPuYq9bV0aiEFtMaeQ8yMOI18tCmTRSPiHPb/NsOW3I9zv14YKaqWDsbo7bB/5NyO7NcwgqVGSFcnBwY3dhR9f1BKkY/euBH5OalSAJov+HpjGoIYwoZLDXvDkEAWKvSm3eqyAap0Rb6frSv9HCzCiNkRGMS76F5eQqmj94HdpoDXdQwP9w1OE0SQ5HVs/hX5lWBFc9VtU979+7k0hVInQuH9mzoeV7meky0EfVQVUv3ZKOUfyebXdQNFQUH8LzcG7KTHsNevQ/mN/BniavIfn3OV+FHidFiSEwySlWHmTlnZSXnYn6bx06z/62wlMzvFgBvNSvQQw2vvoj03kBfCvN2eJEccX91Qu7u5LPcXgFiO864rr6odiqvugLwqkAybjGyMpEMaN8okR0zFcjbE5vDgkw9VKyM0wvjFmjMPjH60m2POz+7EeiuvatD7H9OEHflROKPSY6A/0o5eIsPnv4Y3YO1HNv/Csqe7HnNoC9QVgEeCXczXoYfPwpgrS7plA8xKPBmqfyoeOsV7999xA/b5/wg1T8wEqxscJWQtaraAv8ADfzwQOq2WAQb8qflQRiD9m2daQfepMiNWzHdBPymVFaa/QwkfrFQvTGyeqTdanbzUY2z1oYFpwTVkWuARkaJ8AsDvAKCMMyTlCypIgaNYBCEU21GGMOo4MaXBB5QS53azm9tk3oSCQAKTPf8xLodlQlkE7TcoykFxSSSPC5/6kgiQCODwe6CGz1SO9u8DsdipFS0TlT4chvRmFaeaN6HyiQA2TZ5/KjYM4fZg66wDtDQBGDVYYMZsJqNli1IQFMkj7Ms82svZQLV+US5egixj/mLQ+uVEDtG7TwodiXE9Ihor9i6QvXlKL/p9ATVF0f0FViYnGCDV0R1RrsdYQIBnD4l8H594/4rnnb0MHnlY9Q23sWQlIfSRJkRwU/eTOPkR8diYk+8n99/8eFB2kqQIxnUEYQ+OtTzITy33qyb0IjN563PKfDE2trG2TLqZVEh38xm/svbJfDKJayAKrVj9dgAwY7F+Kf3j8PYR9XJsYthsXH+29tQhE9Eq8cw2Z/hqNFEqQRLXF6rURdHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcPhJ+A/RoHCiwVnc2wAAAABJRU5ErkJggg=="
            alt="Logo USMP"
            style={styles.logo}
          />
        </div>

        <h2 style={styles.heading}>INICIAR SESIÓN</h2>

        <p style={styles.instruction}>
          Presione el botón para iniciar sesión (utilice su cuenta institucional
          @usmp.pe).
        </p>

        <button onClick={handleLoginMicrosoft} style={styles.button}>
          <span>Iniciar sesión con Microsoft 365</span>
          <img
            src="/microsoft-365.png"
            alt="Microsoft 365"
            style={styles.microsoftIcon}
          />
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// ESTILOS
// ----------------------------------------------------
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    padding: "20px",
  },
  contentBox: {
    display: "flex",
    width: "1000px",
    height: "600px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    backgroundColor: "transparent",
    borderRadius: "10px",
    overflow: "hidden",
  },
  leftColumn: {
    flex: 1.2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
  },
  illustrationFrame: {
    width: "100%",
    height: "100%",
    border: "8px solid #B00000",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: "6px",
    backgroundColor: "transparent",
  },
  rightColumn: {
    flex: 0.8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    gap: "18px",
    backgroundColor: "#fff",
  },
  logoBox: {
    width: "84px",
    height: "84px",
    borderRadius: "16px",
    backgroundColor: "#B00000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "6px",
  },
  logo: {
    width: "100px",
    height: "100px",
  },
  heading: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#B00000",
    margin: 0,
  },
  instruction: {
    fontSize: "13px",
    color: "#666",
    textAlign: "center",
    maxWidth: "320px",
    lineHeight: 1.3,
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "12px 18px",
    fontSize: "14px",
    fontWeight: 700,
    color: "white",
    backgroundColor: "#B00000",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    width: "260px",
    boxShadow: "0 4px 12px rgba(176,0,0,0.18)",
  },
  microsoftIcon: {
    width: "20px",
    height: "20px",
  },
};

export default Login;
