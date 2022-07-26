import { MoralisProvider } from "react-moralis";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    return (
        <MoralisProvider
            serverUrl="https://mdzf1tdjzq3a.usemoralis.com:2053/server"
            appId="KAWbDIU7rBIVd02kC9edU8Fqnh1baFUf5rVgfokL"
        >
            <Component {...pageProps} />;
        </MoralisProvider>
    );
}

export default MyApp;
