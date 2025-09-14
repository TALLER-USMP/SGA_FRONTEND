/// <reference types="vite/client" />


// microfrontends 
declare module "login/LoginApp" {
 const LoginApp: React.ComponentType
 export default LoginApp
}

declare module "dashboard/DashboardApp" {
 const DashboardApp: React.ComponentType
 export default DashboardApp
}