import { InteractionType } from "@azure/msal-browser";
import {
  useAccount,
  useMsal,
  useMsalAuthentication,
} from "@azure/msal-react";
import { useCallback, useEffect } from "react";

function App() {
  // Triggers login redirect if not logged in
  useMsalAuthentication(InteractionType.Redirect);

  // Acquire access token once logged in
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  // Sets state when getToken requests received from iframe.
  // Token should only be sent ot the iframe once getToken message was received.
  const handleEvent = useCallback((event: MessageEvent<any>) => {
    if (
      event.data.signature === "queryExplorer" &&
      event.data.type === "getToken"
    ) {
      // Enter your own cluster URI
      const scope = event.data.scope === 'query' ? "https://help.kusto.windows.net/.default" : event.data.scope;
      if (account) {
        instance
          .acquireTokenSilent({
            scopes: [scope],
            account: account,
          })
          .then((response) => {
            if (response) {
              const iframeWindow =
        document.getElementsByTagName("iframe")[0].contentWindow;
      iframeWindow!.postMessage(
        { type: "postToken", message: response.accessToken, scope },
        "*"
      );
            }
          });
      }
    }
  }, [instance, account]);

  // Add event listener to receive messages from web explorer iframe
  useEffect(() => {
    window.addEventListener("message", handleEvent);

    return () => {
      window.removeEventListener("message", handleEvent);
    };
  }, [handleEvent]);

  return (
    <div className="App" style={{ height: "100vh" }}>
      <iframe
        width="100%"
        height="100%"
        title="Azure Data Explorer"
        src="https://dataexplorer.azure.com?ibizaPortal=true"
      ></iframe>
    </div>
  );
}

export default App;
