import { useMoralisWeb3Api } from "react-moralis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import arrayShuffle from "array-shuffle";
import { server } from "../config";
import { useState } from "react";
import Image from "next/image";
import Nav from "../components/Nav";

import styles from "../styles/Home.module.css";

export default function Home({ holders }) {
    const [inputAddress, setInputAddress] = useState([""]);
    const [images, setImages] = useState([]);

    const Web3Api = useMoralisWeb3Api();

    let addresses = [];
    function fetchHolderAddress() {
        // Prevent adding more addresses to the array.
        if (addresses.length == 10) return;

        // const shuffledHolders = arrayShuffle(holders).slice(0, 10);

        // for (let i = 0; i < shuffledHolders.length; i++) {
        //     addresses.push(shuffledHolders[i].HolderAddress);
        // }
        addresses.push(inputAddress);

        return;
    }

    const fetchNFTs = async (e) => {
        let results = [];
        e.preventDefault();
        fetchHolderAddress();

        // Fetch nft balance for each address
        for (let i = 0; i < addresses.length; i++) {
            const options = {
                chain: "eth",
                address: addresses[i],
            };
            const data = await Web3Api.account.getNFTs(options).catch((err) => {
                alert("Enter a correct address");
                console.log("err:", err);
            });
            if (data) {
                const result = data.result;
                if (result.length) {
                    results.push(result);
                }
            }
        }

        // Get the token uri's for each balance
        if (results.length) {
            results.forEach((result) => {
                if (result.length > 3) result.length = 6;
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
        <>
            <Nav />
            <div className={styles.container}>
                <main className={styles.main}>
                    <div className={styles.wrap}>
                        <div className={styles.search}>
                            <input
                                className={styles.search_term}
                                type="text"
                                placeholder="Paste address"
                                value={inputAddress}
                                onChange={(e) =>
                                    setInputAddress(e.target.value)
                                }
                                onSubmit={(e) => e.preventDefault()}
                                onKeyDown={(e) => {
                                    e.key === 13 && fetchNFTs();
                                }}
                            />
                            <button
                                className={styles.search_btn}
                                onClick={fetchNFTs}
                                type="submit"
                            >
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </div>
                    </div>
                    <div className={styles.grid}>
                        {images.map((img, index) => (
                            <div key={index}>
                                <Image
                                    src={img}
                                    alt="nft"
                                    width={250}
                                    height={250}
                                />
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}

// Bulk searches
// export const getStaticProps = async () => {
//     const res = await fetch(`${server}/api/token-holders`);
//     const holders = await res.json();

//     return {
//         props: {
//             holders,
//         },
//     };
// };
