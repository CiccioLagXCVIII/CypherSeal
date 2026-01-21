// moduleBlockchain.js

// Importazione Costanti E ABI Dei Contratti Necessari Per Interagire Con La Blockchain
import { contractsConfig } from './configContracts.js';
// Importazione Ethers.js v6 via CDN (jsDelivr con supporto ESM)
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.7.0/+esm";

// Definzione Provider
// Il Provider È Un'Interfaccia Che Consente Di Connettersi Alla Rete Ethereum E Interagire Con Essa
// const provider = new ethers.providers.Web3Provider(window.ethereum);

// Definizione Signer
// Il Signer È Un'Interfaccia Che Ha Accesso Alle Chiavi Private Per Firmare Messaggi E Transazioni
// const signer = provider.getSigner();

// Entrambi Devono Essere Definiti All'Interno Delle Funzioni Che Ne Hanno Bisogno, Peer Evitare Problemi Di Sincronizzazione

// Definizione Contratto
// È Un Interfaccia Che Permette Di Interagire Con Uno Smart Contract Deployato Sulla Rete Ethereum In Modo Da Poterlo Usare Come Un Oggetto JavaScript
const {
    cypherSoulAddress,
    cypherSoulABI,
    notarizerAddress,
    notarizerABI
} = contractsConfig;


export const Blockchain = {

    // SS Sezione Wallet E Provider

    // NN isProviderAvailable REALE
    // Controllo Disponibilità Provider
    isProviderAvailable() {
        // Verifica Se Nel Browser È Presente Un'Estensione Come MetaMask
        // Non Si Devono Usare Propriettà Che Iniziano Con _ Perchè Sono Interne Di Metamask E Quindi Se 
        // Si Aggiorna O C'È Un Altro Wallet Il Codice Si Rompe

        // Per Sapere Se C'È Il Provider Basta Controllare Se window.ethereum Esiste
        const injectedProvider = window.ethereum
        if (typeof injectedProvider !== 'undefined') {
            console.log("moduleBlockchain: Provider Web3 Rilevato");
            return true;
        } else {
            console.error("moduleBlockchain: Nessun Provider Web3 Rilevato");
            return false;
        }
    },

    // NN getChainId REALE
    // Recupera Il Network Collegato
    async getChainId() {
        // Estrae E Restituisce Il Chain ID Della Rete Collegata In Formato Esadecimale
        const provider = new ethers.BrowserProvider(window.ethereum);

        const network = await provider.getNetwork();

        // Ether Restituisce Un BigInt Quindi Si Deve Convertire In Stringa
        // È Meglio Usare window.ethereum Per Il ChainId
        const networkString = '0x' + network.chainId.toString(16);

        return networkString;
    },

    // NN getWalletBrand REALE
    // Identifica Il Brand Del Wallet Collegato
    getWalletBrand() {

        if (this.isProviderAvailable()) {
            const provider = window.ethereum;

            if (provider.isMetaMask) {
                return "MetaMask";
            } else if (provider.isBraveWallet) {
                return "Brave Wallet";
            } else if (provider.isCoinbaseWallet) {
                return "Coinbase Wallet";
            } else if (provider.isTrust) {
                return "Trust Wallet";
            } else if (provider.isRabby) {
                return "Rabby Wallet";
            } else {
                return "Injected Web3";
            }

        } else {
            return "No Web3 Provider";
        }
    },

    // NN switchToSepolia REALE
    async switchToSepolia() {
        if (this.isProviderAvailable()) {
            const sepoliaChainId = '0xaa36a7'; // 11155111 In Decimale
            const provider = new ethers.BrowserProvider(window.ethereum);

            // Switcha Alla Rete Sepolia
            try {
                await provider.send("wallet_switchEthereumChain", [{ chainId: sepoliaChainId }]);

                return true;
            } catch (switchError) {
                if (switchError.code === 4902) {
                    // Rete Non Trovata, Si Deve Aggiungere
                    const sepoliaParams = {
                        chainId: '0xaa36a7',
                        chainName: 'Sepolia Testnet',
                        nativeCurrency: {
                            name: 'SepoliaETH',
                            symbol: 'ETH',
                            decimals: 18
                        },
                        rpcUrls: ['https://sepolia.drpc.org'],
                        blockExplorerUrls: ['https://sepolia.etherscan.io']
                    }

                    try {
                        await provider.send("wallet_addEthereumChain", [sepoliaParams]);
                        return true;
                    } catch (addError) {
                        console.error("moduleBlockchain: Errore Nell'Aggiunta Della Rete Sepolia:", addError);
                        return false;
                    }
                } else {
                    console.error("moduleBlockchain: Errore Nello Switch Alla Rete Sepolia:", switchError);
                    return false;
                }
            }
        }
    },

    // NN getAuthorizedAccounts REALE
    // AA Controlla Account Autorizzati (Controllo Silenzioso)
    // Controlla Se L'Utente Ha Già Autorizzato Il Sito Ed È Attualmente Connesso
    // Se L'Utente Non È Connesso, Restituisce Un Array Vuoto E Non Succede Nulla
    // Si Usa Al Refresh Della Pagina Per Vedere Se L'Utente È Ancora Connesso
    async getAuthorizedAccounts() {
        if (this.isProviderAvailable()) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                // Si Usa eth_accounts Che A Differenza Di eth_requestAccounts Non Mostra Il Popup
                // Se È Connesso Ritorna Un Array Di Account Autorizzati, Altrimenti Ritorna Un Array Vuoto
                const accounts = await provider.send("eth_accounts", []);
                return accounts;
            } catch (error) {
                console.error("moduleBlockchain: Errore Nel Recupero Degli Account Autorizzati:", error);
                return [];
            }
        } else {
            console.error("moduleBlockchain: Nessun Provider Web3 Rilevato");
            return [];
        }
    },

    // NN requestAccounts REALE
    // AA Richiesta Connessione Wallet (Apre Popup MetaMask)
    // Chiede Attivamente All'Utente Di Connettere Il Sito Al Wallet Per Far Approvare La Connessione All'Utente
    // Si Usa Quando L'Utente Clicca Sul Bottone "Connetti Wallet"
    async requestAccounts() {
        // Permette Di Fare Il Login Vero E Proprio

        // Inizializzazione Connessione Con Il Provider
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Usando send Si Forza L'Apertutra Del Popup In MetaMask Se Il Sito Non È Ancora Connesso
        const accounts = await provider.send("eth_requestAccounts", []);

        console.log("requestAccounts: Account Connessi ->", accounts);

        // A Questo Punto Si Può Restituire Gli Account Autorizzati
        return accounts;
    },

    // TODO: Funzione Helper (isSignerAvailable)
    // TODO: Combina isProviderAvailable E getAuthorizedAccounts Per Sapere Se L'Utente Può Effettivamente Interagire Con La DApp E Firmare Transazioni
    async isWalletConnected() {
        // Può Esserci Un Provider (Come MetaMask) Ma Nessun Account Connesso E Quindi Non Si Può Firmare Nulla
        if (this.isProviderAvailable()) {
            const accounts = await this.getAuthorizedAccounts();
            if (accounts.length > 0) {
                console.log("moduleBlockchain: Signer Disponibile (Account Connesso)");
                return true;
            }
        }
        console.log("moduleBlockchain: Signer Non Disponibile (Nessun Account Connesso)");
        return false;
    },


    // SS Sezione Profilo & Identità (SBT)

    // Controlla Se L'Utente Possiede Un'Identità SBT
    // NN getSBTStatus REALE
    /*
    async getSBTStatus(userAddress) {
        console.log(`moduleBlockchain: Controllo Identità Per ${userAddress}...`);
        // Inizializza Il Provider
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Inizializza Il Contratto CypherSoul
        const cypherSoulContract = new ethers.Contract(
            cypherSoulAddress,
            cypherSoulABI,
            provider
            // È Solo In Lettura Quindi Non Serve Il Signer
        );


        try {
            // Chiama La Funzione hasValidIdentity Del Contratto
            const hasIdentity = await cypherSoulContract.hasValidIdentity(userAddress);
            console.log(`moduleBlockchain: L'Utente ${userAddress} Ha Identità SBT: ${hasIdentity}`);
            return hasIdentity;
        } catch (error) {
            console.error("moduleBlockchain: Errore Nel Controllo Dello Stato Dell'Identità SBT:", error);
            return false;
        }
    },
    */

    // NN mintSBT REALE 
    /*
    async mintSBT(userAddress) {
        console.log(`Blockchain Service: Chiamata mintBadge(${userAddress})...`);

        // Inizializza Il Provider (Per Lettura)
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Inizializza Il Signer (Per Firmare Transazioni E Pagare Il Gas)
        const signer = await provider.getSigner();

        // Inizializza Il Contratto CypherSoul Con Il Signer Per Abilitare Le Funzioni Di Scrittura
        const cypherSoulContract = new ethers.Contract(
            cypherSoulAddress,
            cypherSoulABI,
            signer
        );

        try {
            // Definizione URI Metadati SBT (Placeholder)
            const tokenURI = `https://cypherseal.example.com/sbt/${userAddress}`;

            // Invio Della Transazione Di Minting Dello SBT
            // A Questo Punto La Transazione È Inviata Alla Rete Ma non Ancora Scritta In Un Blocco
            // Quindi Si Estraggono I Dati Della Richiesta Di Minting (TransactionResponse)
            const txResponse = await cypherSoulContract.mintBadge(tokenURI);
            console.log("Blockchain Service: Transazione Inviata. Hash: ", txResponse.hash);
            console.log("In Attesa Della Conferma Della Transazione...");

            // Attesa Della Conferma Della Transazione (TransactionReceipt)
            // In Ethers.js Il Metodo wait() Sul TransactionResponse Sospende L'Esecuzione Finché La Transazione 
            // Non Viene Validata E Inclusa In Un Blocco. Restituisce Un TransactionReceipt Che Contiene I Dettagli 
            // L'Esito Finale Della Transazione E Gli Eventi Emessi (In Questo Caso, L'Evento Locked)
            const txReceipt = await txResponse.wait();
            console.log("Blockchain Service: Transazione Confermata Nel Blocco: ", txReceipt.blockNumber);
            return {
                success: true,
                txHash: txReceipt.hash,
                blockNumber: txReceipt.blockNumber,
                gasUsed: txReceipt.gasUsed.toString(),
                from: txReceipt.from,
                to: txReceipt.to
            };
        } catch (mintError) {
            console.error("Blockchain Service: Errore Nel Minting Dello SBT:", mintError);
            return {
                success: false,
                error: mintError.message
            };
        }
    },
    */

    // NN getSBTInfo REALE
    /*
    // Recupera Info SBT In Base All'Indirizzo Utente
    async getSBTInfo(userAddress) {
        console.log("moduleBlockchain: Recupero Info SBT...");

        // Inizializza Il Provider
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Inizializza Il Contratto CypherSoul
        const cypherSoulContract = new ethers.Contract(
            cypherSoulAddress,
            cypherSoulABI,
            provider
        );

        try {
            const hasIdentity = await cypherSoulContract.hasValidIdentity(userAddress);
            if (!hasIdentity) {
                // L'Utente Non Ha Un SBT
                console.warn("moduleBlockchain: L'Utente Non Possiede Un SBT");
                return null;
            } else {
                // L'Utente Ha Un SBT
                // Poiché Lo Smart Contract Non Fornisce Metodi Diretti Per Ottenere Le Info Dello SBT,
                // Si Deve Fare Un Filtro Basato Sull'Evento Emesso Durante Il Minting Dello SBT
                // Poichè La Funzione mintBadge Chiama La Funzione _safeMint Che Emmette L'Evento Transfer
                // Si Può Usare Questo Evento Per Trovare Le Info

                // Definizione Filtro Evento Transfer Da 0x000... A userAddress
                // In Pratica Cerca Sulla Blockchain Tutti Gli Eventi Transfer Dove L'Indirizzo from È 
                // L'Indirizzo Zero (Minting) E L'Indirizzo to È userAddress.
                // Questo Permette Di Trovare L'Evento Emesso Dal Contratto Quando L'Utente Ha Ricevuto Lo SBT
                const filter = cypherSoulContract.filters.Transfer(ethers.ZeroAddress, userAddress)
                const events = await cypherSoulContract.queryFilter(filter);
                if (events.length === 0) {
                    console.warn("moduleBlockchain: Nessun Evento Transfer Trovato Per Questo Utente");
                    return null;
                } else {
                    // L'Evento Di Minting Sarà Sicuramente Unico Perche Per Ogni Utente C'è Un Solo SBT
                    const mintEvent = events[0];

                    const eventArgs = mintEvent.args;
                    // Si Possono Usare I Parametri (args) Dell'Evento Per Ottenere Le Informazioni Necessarie
                    // Il Primo Elemmento args[0] È L'Indirizzo From (Zero Address)
                    // Il Secondo Elemmento args[1] È L'Indirizzo To (userAddress)
                    // Il Terzo Elemmento args[2] È Il tokenId Dello SBT
                    const address = eventArgs[1];
                    const sbtTokenId = eventArgs[2].toString();

                    // Recupero Data Di Emissione Dallo Smart Contract
                    const sbtBlock = mintEvent.blockNumber;
                    const blockData = await provider.getBlock(sbtBlock);
                    const emissionTimestamp = blockData.timestamp;
                    const emissionDate = new Date(emissionTimestamp * 1000).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

                    // Costruzione Oggetto Di Ritorno
                    const sbtInfo = {
                        userAddress: address,
                        sbtTokenId: sbtTokenId,
                        emissionDate: emissionDate,
                        registryNet: 'Ethereum (Sepolia)',
                        // I Seguenti Si Devono Prendere Da getUserDocuments
                        trustLevel: 'Verified User',
                        numDocCertificati: 'N/A', 
                        dataUltCertifica: '---'
                    };

                    return sbtInfo;
                }
            }
        } catch (error) {
            console.error("moduleBlockchain: Errore Nel Recupero Delle Info SBT:", error);
            return null;
        }
    },
    */

    // SS Sezione Notarizzazione & Documenti


    // SS ------------------------------------------------------------------------------------------
    // NN getSBTStatus SIMULATO
    async getSBTStatus(userAddress) {
        console.log(`moduleBlockchain: Controllo Identità Per ${userAddress}...`);
        const delay = Math.floor(Math.random() * 1000) + 500;
        await new Promise(r => setTimeout(r, delay));

        const hasIdentity = !userAddress.endsWith('0');

        // const hasIdentity = false;

        return hasIdentity;
    },

    // NN mintSBT SIMULATO
    // Simula il minting di un SBT (Creazione Identità)
    async mintSBT(userAddress) {
        console.log(`Blockchain Service: Chiamata safeMint(${userAddress})...`);

        // Simulazione attesa conferma transazione
        await new Promise(r => setTimeout(r, 4000));

        return {
            success: true,
            txHash: "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
        };
    },


    // NN getSBTInfo SIMULATO
    // Recupera Info SBT In Base All'Indirizzo Utente
    async getSBTInfo(userAddress) {
        console.log("CypherSeal: Recupero Info SBT...");

        await new Promise(r => setTimeout(r, 800));

        const shortAddr = userAddress.substring(2, 8).toUpperCase();
        const now = new Date();
        const emission = new Date(now.setMonth(now.getMonth() - 2)); // Emesso 2 mesi fa
        const emissionDate = emission.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

        // Costruzione Oggetto Di Ritorno
        const sbtInfo = {
            userAddress: userAddress,
            sbtTokenId: parseInt(shortAddr, 16).toString(),
            emissionDate: emissionDate,
            registryNet: 'Ethereum (Sepolia)',
            // I Seguenti Si Devono Prendere Da \getUserDocmuments
            // trustLevel: 'Advanced',
            // numDocCertificati: (parseInt(shortAddr, 16) % 20).toString(),
            // dataUltCertifica: new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
        };

        return sbtInfo;
    },

    // AA Sezione Notarizzazione & Documenti

    // NN notarizeDocument SIMULATO
    // Simula la notarizzazione di un hash (Scrittura su Blockchain)
    async notarizeDocument(hash) {
        console.log(`Blockchain Service: Chiamata notarizeDocument(${hash})...`);

        await new Promise(r => setTimeout(r, 800));

        if (Math.random() < 0.05) {
            throw new Error("Execution Reverted: Gas estimation failed or User rejected request");
        }

        // Simulazione stima gas e tempo di mining del blocco
        await new Promise(r => setTimeout(r, 2000 + Math.random() * 3000));

        return {
            success: true,
            txHash: "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
            // Blocco realistico (Ethereum Block Height attuale + random)
            block: 5400000 + Math.floor(Math.random() * 1000)
        };
    },

    // Simula Il Reale Recupero Dello Stato Di Un Documento (Lettura Da Blockchain)
    async getDocumentStatus(hash) {
        console.log(`Blockchain Service: Chiamata getDocumentStatus(${hash})`);

        await new Promise(r => setTimeout(r, 1200));

        const lastChar = hash.slice(-1);
        // Default: Non Trovato
        let simulatedStatus = 0;

        // Se finisce con numero pari -> Valido (1)
        // Se finisce con 'a', 'b', 'c' -> Revocato (2)
        // Altrimenti -> Non Trovato (0)
        if (!isNaN(lastChar)) {
            simulatedStatus = 1;
        } else if (['a', 'b', 'c', 'd', 'e', 'f'].includes(lastChar)) {
            simulatedStatus = 2;
        }

        // Dati Per Testare L'Interfaccia Utente
        const docStatus = {
            status: simulatedStatus, // 0 = Non Trovato, 1 = Valido, 2 = Revocato
            author: "0x" + hash.substring(0, 40),
            sbtId: "SBT-" + Math.floor(Math.random() * 9000 + 1000),
            block: 5432100 + Math.floor(Math.random() * 500),
            timestamp: (Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 2592000)).toString()
        };

        // Se non trovato, resetta i dati
        if (simulatedStatus === 0) {
            docStatus.author = "0x0000000000000000000000000000000000000000";
            docStatus.sbtId = "0";
            docStatus.block = 0;
            docStatus.timestamp = "0";
        }

        return docStatus;
    },

    // Simula La Revoca Di Un Documento Da Parte Del Proprietario
    async revokeDocument(hash) {
        console.log(`Blockchain Service: Chiamata revokeDocument(${hash})...`);

        // Simulazione Tempo Transazione
        await new Promise(r => setTimeout(r, 2000));

        return {
            success: true,
            txHash: "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
        };
    },

    // Simula Il Recupero Della Lista Documenti Di Un Utente
    // In Solidity, scrivere dati in una variabile di "Stato" (ovvero nella memoria permanente dello Smart Contract) comporta costi di gas elevati.
    // Al contrario, l'emissione di un Evento è un'operazione molto più economica.
    // Invece di salvare il nome del file in una variabile, lo Smart Contract emette l'evento event 
    // NN `DocumentNotarized(address author, bytes32 hash, string fileName);` 
    // che registra le informazioni direttamente nei Logs della transazione. Attraverso la libreria Ethers.js, il frontend può interrogare questi 
    // registri cercando tutti gli eventi emessi da un determinato indirizzo.
    // Questo metodo permette di recuperare la lista completa dei nomi dei file e dei relativi hash direttamente dalla blockchain, garantendo la 
    // persistenza dei dati senza dover ricorrere a database locali e riducendo drasticamente il consumo di gas.
    async getUserDocuments(wallet) {
        console.log(`Blockchain Service: Chiamata getDocumentsByAuthor(${wallet})`);

        // Simulazione Latenza Rete
        await new Promise(r => setTimeout(r, 1500));

        // SS Interazione Blockchain
        console.log("CypherSeal: Richiesta Elenco Documenti Notarizzati In Base A Indirizzo ->", wallet);

        // AA Generazione dinamica basata sul wallet
        // Se il wallet cambia, i documenti (mock) cambiano, dando l'illusione di un DB reale.
        const walletSnippet = wallet.substring(2, 6);
        const baseTimestamp = Math.floor(Date.now() / 1000);

        const documents = [
            {
                name: "Documento Certificato.pdf",
                notarizationDate: (baseTimestamp - 86400 * 2).toString(), // 2 giorni fa
                hash: "0x7e4a" + walletSnippet + "f9c8b6d3f2a4c9e0a1b7d8f6e5c3a2b1d4f9e8c7b6a5d0",
                txHash: "0xd108" + walletSnippet + "7ff2d723eceb36fbbe2661a4175bd240349c66d6581392",
                status: "Verificato"
            },
            {
                name: "Documento Revocato.pdf",
                notarizationDate: (baseTimestamp - 86400 * 30).toString(), // 1 mese fa
                hash: "0x0f8c" + walletSnippet + "2b6a5e4f1c7d3e9a8b0f2c6e1d5a4b7c8f9e3d0a1b2c4",
                txHash: "0x5429" + walletSnippet + "bc83a3fda6800360060dabab88d88eb5f7f97b47f82163",
                status: "Revocato"
            },
            {
                name: "Documento In Attesa.pdf",
                notarizationDate: (baseTimestamp - 3600).toString(), // 1 ora fa
                hash: "0xb3c9" + walletSnippet + "4a1d8e2f7c5b0a9d4e6c1f8a7b2d3e9c4f5a1b6e8d7c0f2",
                txHash: "0x9ef0" + walletSnippet + "8624012128366c6e4ee5d13579ee961ce1fe81abfbf72956",
                status: "In Attesa"
            },
            {
                name: "Documento In Pending.pdf",
                notarizationDate: (baseTimestamp).toString(), // Adesso
                hash: "0x1122" + walletSnippet + "4a1d8e2f7c5b0a9d4e6c1f8a7b2d3e9c4f5a1b6e8d7c0f2",
                txHash: "0x3344" + walletSnippet + "8624012128366c6e4ee5d13579ee961ce1fe81abfbf72956",
                status: "Pending"
            },
            {
                name: "Documento In Fallito.pdf",
                notarizationDate: (baseTimestamp - 60).toString(), // 1 min fa
                hash: "0x5566" + walletSnippet + "2b6a5e4f1c7d3e9a8b0f2c6e1d5a4b7c8f9e3d0a1b2c4",
                txHash: "0x7788" + walletSnippet + "bc83a3fda6800360060dabab88d88eb5f7f97b47f82163",
                status: "Fallito"
            }
        ];

        return documents;
    }
};