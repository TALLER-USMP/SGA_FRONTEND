/// <reference types="vite/client" />
import type { Configuration } from "@azure/msal-browser";
import { PublicClientApplication } from "@azure/msal-browser";

// Only log env in non-production
if (typeof console !== "undefined" && import.meta.env.MODE !== "production") {
  // eslint-disable-next-line no-console
  console.debug("VITE env (build-time):", {
    VITE_AZURE_CLIENT_ID: import.meta.env.VITE_AZURE_CLIENT_ID,
    VITE_AZURE_AUTHORITY: import.meta.env.VITE_AZURE_AUTHORITY,
    VITE_REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI,
    MODE: import.meta.env.MODE,
    PROD: import.meta.env.PROD,
  });
}

export const msalConfig: Configuration = {
  auth: {
    clientId:
      import.meta.env.VITE_AZURE_CLIENT_ID ||
      "3d7c6395-07ae-461b-82fb-4776ba1af653",
    authority:
      import.meta.env.VITE_AZURE_AUTHORITY ||
      "https://login.microsoftonline.com/98201fef-d9f6-4e68-84f5-c2705074e342",
    redirectUri: "http://localhost:5001",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequestBack = {
  scopes: ["api://3d7c6395-07ae-461b-82fb-4776ba1af653/access"],
};

export const loginRequest = {
  scopes: ["User.Read", "Mail.Read", "Calendars.Read", "User.ReadBasic.All"],
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphPhotoEndpoint: "https://graph.microsoft.com/v1.0/me/photo/$value",
  graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages",
  graphCalendarEndpoint: "https://graph.microsoft.com/v1.0/me/events",
};
