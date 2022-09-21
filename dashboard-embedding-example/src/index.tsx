import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { MsalProvider } from "@azure/msal-react";
import { Configuration, PublicClientApplication } from "@azure/msal-browser";

// MSAL configuration
const configuration: Configuration = {
  auth: {
    clientId: "YOUR APP ID",
    /**
     * Fill in your authority.
     * Docs can be found here: https://docs.microsoft.com/azure/active-directory/develop/msal-client-application-configuration
     */
    authority: "https://login.microsoftonline.com/72f988bf-86f1-41af-91ab-2d7cd011db47"
  },
};
const publicClientApplication = new PublicClientApplication(configuration);

const AppProvider = () => {
  return (
    <MsalProvider instance={publicClientApplication}>
      <App />
    </MsalProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <AppProvider />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
