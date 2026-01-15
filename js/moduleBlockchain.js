// moduleBlockchain.js

export const Blockchain = {

    // SS Sezione Wallet E Provider

    // Controllo Disponibilità Provider
    isProviderAvailable() {
        return typeof window.ethereum !== 'undefined';
    },

    // Richiesta Connessione Account
    async requestAccounts() {
        return await window.ethereum.request({ method: 'eth_requestAccounts' });
    },

    // Ottiene Il Chain ID Attuale
    async getChainId() {
        return await window.ethereum.request({ method: 'eth_chainId' });
    },

    // Identifica Brand Wallet
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

    // Controlla Acount Autorizzati (Utile Per Verificare Sessione Attiva Al Refresh)
    async getAuthorizedAccounts() {
        if (this.isProviderAvailable()) {
            try {
                // eth_accounts: Restituisce Gli Account Collegati. Se Vuoto, Nessun Account È Collegato.
                return await window.ethereum.request({ method: 'eth_accounts' });
            } catch (error) {
                console.error("Errore Recupero Account Autorizzati:", error);
                return [];
            }
        }
        return [];
    },

    // SS Sezione Profilo & Identità (SBT)

    // Controlla Se L'Utente Possiede Un'Identità SBT
    async getSBTStatus(userAddress) {
        console.log(`Blockchain Service: Controllo Identità Per ${userAddress}...`);

        const delay = Math.floor(Math.random() * 1000) + 500;
        await new Promise(r => setTimeout(r, delay));

        const hasIdentity = !userAddress.endsWith('0');

        return hasIdentity;
    },

    // Recupera Info SBT In Base All'Indirizzo Utente
    async getSBTInfo(userAddress) {
        console.log("VerifyData: Recupero Info SBT...");

        await new Promise(r => setTimeout(r, 800));

        const shortAddr = userAddress.substring(2, 8).toUpperCase();
        const now = new Date();
        const emission = new Date(now.setMonth(now.getMonth() - 2)); // Emesso 2 mesi fa

        return {
            userAddress: userAddress,
            sbtTokenId: parseInt(shortAddr, 16).toString(),
            emissionDate: emission.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }),
            registryNet: 'Ethereum (Sepolia)',
            trustLevel: 'Advanced',
            numDocCertificati: (parseInt(shortAddr, 16) % 20).toString(),
            dataUltCertifica: new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
        };
    },

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

    // SS Sezione Notarizzazione & Documenti

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
        console.log("VerifyData: Richiesta Elenco Documenti Notarizzati In Base A Indirizzo ->", wallet);

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