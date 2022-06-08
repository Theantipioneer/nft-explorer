import { MoralisProvider } from "react-moralis";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    return (
        <MoralisProvider
            serverUrl="https://almo5n2dl7m0.usemoralis.com:2053/server"
            appId="SNfXh5bTPPTyfFHFFUSSWsEq0qwp1u3IgfWv7dpH"
        >
            <Component {...pageProps} />;
        </MoralisProvider>
    );
}

export default MyApp;
