/// <reference types="vite/client" />
import type { Configuration } from "@azure/msal-browser";
import { PublicClientApplication } from "@azure/msal-browser";

const CLIENT_ID = import.meta.env.VITE_AZURE_CLIENT_ID!;
const AUTHORITY = import.meta.env.VITE_AZURE_AUTHORITY!;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI!;
const API_SCOPE = import.meta.env.VITE_AZURE_API_SCOPE!;

export const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: AUTHORITY,
    redirectUri: REDIRECT_URI,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

// === GRAPH API ===
export const loginRequest = {
  scopes: ["User.Read", "Mail.Read", "Calendars.Read", "User.ReadBasic.All"],
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphPhotoEndpoint: "https://graph.microsoft.com/v1.0/me/photo/$value",
  graphMailEndpoint: "https://graph.microsoft.com/v1.0/me/messages",
  graphCalendarEndpoint: "https://graph.microsoft.com/v1.0/me/events",
};

// === BACKEND API (protegida por Azure AD) ===
export const loginRequestBack = {
  scopes: [API_SCOPE], // 👈 ahora viene del .env
};
