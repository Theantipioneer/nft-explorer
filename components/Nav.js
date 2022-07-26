import { useMoralis } from "react-moralis";

import React, { useState } from "react";
import styles from "../styles/Nav.module.css";

function Nav() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { authenticate, isAuthenticated, isAuthenticating, logout } =
        useMoralis();

    const login = async () => {
        if (!isAuthenticated) {
            await authenticate({ signingMessage: "Log in using Moralis" })
                .then(function (user) {
                    console.log("logged in user:", user);
                    console.log(user.get("ethAddress"));
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        setIsLoggedIn(true);
    };

    const logOut = async () => {
        await logout();
        console.log("logged out");
    };

    function toggleLogin() {
        isLoggedIn ? logOut() : login();
    }
    return (
        <nav className={styles.container}>
            <div>
                <button className={styles.treat_button} onClick={toggleLogin}>
                    {isAuthenticated ? "Log out" : "Login"}
                </button>
            </div>
        </nav>
    );
}

export default Nav;
