import axios from "axios";
import { useMoralis } from "react-moralis";
import { useMoralisWeb3Api } from "react-moralis";
import arrayShuffle from "array-shuffle";
import { server } from "../config";
import { useEffect, useState } from "react";
import Image from "next/image";
import defaultImg from "../public/wtf.jpg";

import styles from "../styles/Home.module.css";

export default function Home({ holders }) {
    const [images, setImages] = useState([]);
    const Web3Api = useMoralisWeb3Api();

    const { authenticate, isAuthenticated, isAuthenticating, logout } =
        useMoralis();

    useEffect(() => {
        if (isAuthenticated) {
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, images]);

    // useEffect(() => {
    //     console.log(images);
    // }, [images]);

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
    };

    const logOut = async () => {
        await logout();
        console.log("logged out");
    };

    let addresses = [];
    function fetchHolderAddress() {
        if (addresses.length >= 3) {
            return;
        }
        const shuffledHolders = arrayShuffle(holders).slice(0, 10);

        for (let i = 0; i < shuffledHolders.length; i++) {
            addresses.push(shuffledHolders[i].HolderAddress);
        }

        return;
    }

    const fetchNFTs = async () => {
        let results = [];
        fetchHolderAddress();

        // Fetch nft balance for each address
        for (let i = 0; i < addresses.length; i++) {
            const options = {
                chain: "eth",
                address: addresses[i],
            };
            const data = await Web3Api.account.getNFTs(options);
            const result = data.result;
            if (result.length) {
                results.push(result);
            }
        }

        // Get the token uri's for each balance
        if (results.length) {
            results.forEach((result) => {
                if (result.length > 3) result.length = 3;
                result.forEach(async (nft) => {
                    // fetch metadata
                    const res = await fetch(nft.token_uri).catch((err) =>
                        console.log("err:", err)
                    );
                    if (res) {
                        const metaData = await res.json();
                        const imgUri = metaData.image;

                        // fetch image file
                        if (imgUri) {
                            const res = await fetch(imgUri).catch((err) =>
                                console.log("err:", err)
                            );
                            if (res) {
                                const img = await res.blob();
                                const imageObjectURL = URL.createObjectURL(img);
                                setImages((prev) => [...prev, imageObjectURL]);
                            }
                        }
                    }
                });
            });
        } else {
            console.log("All addresses have balance of zero NFTs");
        }
    };

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <button onClick={login}>Login</button>
                <button
                    onClick={fetchNFTs}
                    style={{
                        color: "white",
                        background: "#b04362",
                        cursor: "pointer",
                    }}
                >
                    Load NFTs
                </button>
                <button onClick={logOut} disabled={isAuthenticating}>
                    Logout
                </button>
                <div>
                    {images.map((img, index) => (
                        <Image
                            src={img}
                            key={index}
                            alt="nft"
                            width={250}
                            height={250}
                        />
                    ))}
                </div>
                <h1>Cachet</h1>
                <h3>hello??</h3>
            </main>
        </div>
    );
}

export const getStaticProps = async () => {
    const res = await fetch(`${server}/api/token-holders`);
    const holders = await res.json();

    return {
        props: {
            holders,
        },
    };
};
