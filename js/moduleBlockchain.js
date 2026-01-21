// moduleBlockchain.js

// Importazione Costanti E ABI Dei Contratti Necessari Per Interagire Con La Blockchain
import { contractsConfig } from './configContracts.js';
// Importazione Ethers.js v6 via CDN (jsDelivr con supporto ESM)
// import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.7.0/+esm";
import * as ethers from "https://esm.sh/ethers@6.7.0?dev";

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

    // NN isProviderAvailable
    // Verifica La Presenza Di Un Provider Web3 Nel Browser
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

    // NN getChainId
    // Ottiene L'ID Univoco Della Rete Blockchain Attualmente In Uso
    async getChainId() {
        // Estrae E Restituisce Il Chain ID Della Rete Collegata In Formato Esadecimale
        const provider = new ethers.BrowserProvider(window.ethereum);

        const network = await provider.getNetwork();

        // Ether Restituisce Un BigInt Quindi Si Deve Convertire In Stringa
        // È Meglio Usare window.ethereum Per Il ChainId
        const networkString = '0x' + network.chainId.toString(16);

        return networkString;
    },

    // NN getWalletBrand
    // Rileva La Tipologia Di Wallet Collegata (Es. Metamask)
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

    // NN switchToSepolia
    // Invia Una Richiesta Al Wallet Per Passare Al Network Sepolia
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

    // NN getAuthorizedAccounts
    // Controlla Se Esistono Account Già Autorizzati (Controllo Silenzioso)
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

    // NN requestAccounts
    // Avvia La Procedura Di Connessione Al Wallet Tramite Popup
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

    // NN getSBTStatus
    // Verifica On-Chain Il Possesso Del Badge Di Identità SBT
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

    // NN mintSBT 
    // Avvia La Transazione Di Minting Per L'Identità Soulbound
    async mintSBT(userAddress) {
        console.log(`moduleBlockchain: Chiamata mintBadge(${userAddress})...`);

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
            console.log("moduleBlockchain: Transazione Minting Inviata. Hash: ", txResponse.hash);
            console.log("moduleBlockchain: In Attesa Della Conferma Della Transazione Minting...");

            // Attesa Della Conferma Della Transazione (TransactionReceipt)
            // In Ethers.js Il Metodo wait() Sul TransactionResponse Sospende L'Esecuzione Finché La Transazione 
            // Non Viene Validata E Inclusa In Un Blocco. Restituisce Un TransactionReceipt Che Contiene I Dettagli 
            // L'Esito Finale Della Transazione E Gli Eventi Emessi (In Questo Caso, L'Evento Locked)
            const txReceipt = await txResponse.wait();
            console.log("moduleBlockchain: Transazione Minting Confermata Nel Blocco: ", txReceipt.blockNumber);
            const returnData = {
                success: true,
                txHash: txReceipt.hash,
                blockNumber: txReceipt.blockNumber,
                gasUsed: txReceipt.gasUsed.toString(),
                from: txReceipt.from,
                to: txReceipt.to
            };

            return returnData;
        } catch (mintError) {
            console.error("moduleBlockchain: Errore Nel Minting Dello SBT:", mintError);
            const returnData = {
                success: false,
                error: mintError.message
            };

            return returnData;
        }
    },

    // NN getSBTInfo
    // Estrae I Metadati Del Profilo Associati Al Badge Dell'utente
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


    // SS Sezione Notarizzazione & Documenti

    // NN notarizeDocument
    // Registra L'Impronta Digitale Del Documento (Hash) Sulla Blockchain
    async notarizeDocument(hash) {
        console.log(`moduleBlockchain: Chiamata notarizeDocument(${hash})...`);
        if (!this.isProviderAvailable()) {
            console.error("moduleBlockchain: Nessun Provider Web3 Rilevato");

            const returnData = {
                success: false,
                error: "No Web3 Provider"
            };
            return returnData;
        } else {
            // Inizializza Il Provider (Per Lettura)
            const provider = new ethers.BrowserProvider(window.ethereum);

            // Inizializza Il Signer (Per Firmare Transazioni E Pagare Il Gas)
            const signer = await provider.getSigner();

            // Inizializza Il Contratto Notarizer Con Il Signer Per Abilitare Le Funzioni Di Scrittura
            const notarizerContract = new ethers.Contract(
                notarizerAddress,
                notarizerABI,
                signer
            );

            try {
                // Invio Della Transazione Di Notarizzazione Del Documento
                // A Questo Punto La Transazione È Inviata Alla Rete Ma non Ancora Scritta In Un Blocco
                // Quindi Si Estraggono I Dati Della Richiesta Di Notarizzazione (TransactionResponse)
                const txResponse = await notarizerContract.notarize(hash);
                console.log("moduleBlockchain: Transazione Notarizzazione Inviata. Hash: ", txResponse.hash);
                console.log("moduleBlockchain: In Attesa Della Conferma Della Notarizzazione...");

                // Attesa Della Conferma Della Transazione (TransactionReceipt)
                // In Ethers.js Il Metodo wait() Sul TransactionResponse Sospende L'Esecuzione Finché La Transazione 
                // Non Viene Validata E Inclusa In Un Blocco. Restituisce Un TransactionReceipt Che Contiene I Dettagli 
                // L'Esito Finale Della Transazione E Gli Eventi Emessi (In Questo Caso, L'Evento DocumentNotarized)
                const txReceipt = await txResponse.wait();
                console.log("moduleBlockchain: Transazione Notarizzazione Confermata Nel Blocco: ", txReceipt.blockNumber);
                const returnData = {
                    // Status Dovrebbe Essere Sempre 1 Qui
                    status: txReceipt.status,
                    txHash: txReceipt.hash,
                    block: txReceipt.blockNumber,
                    gasUsed: txReceipt.gasUsed.toString()
                };

                return returnData;
            } catch (notarizeError) {
                console.error("moduleBlockchain: Errore Nella Notarizzazione Del Documento:", notarizeError);
                const returnData = {
                    success: false,
                    error: notarizeError.message
                };

                return returnData;
            }
        }
    },

    // NN getDocumentStatus
    // Recupera I Dati Di Validità, Autore E Timestamp Di Un Hash
    async getDocumentStatus(hash) {
        console.log(`moduleBlockchain: Chiamata getDocumentStatus(${hash})`);

        const provider = new ethers.BrowserProvider(window.ethereum);

        const notarizerContract = new ethers.Contract(
            notarizerAddress,
            notarizerABI,
            provider
        );

        try {
            const response = await notarizerContract.verify(hash);

            const docHash = response[0];
            const authorAddress = response[1];
            const certTimestamp = Number(response[2]);
            const revTimestamp = Number(response[3]);
            const isCertified = response[4];

            // Logica Formattazione Data Creazione
            // AA let formattedCertDate = new Date(certTimestamp * 1000).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

            // Inizializzazione Variabili Stato
            let statusCode = 0;     // Default: 0 (Non Trovato/Errore)
            // AA let formattedRevocationDate = null;

            // Logica Stati: 2 = Revocato, 1 = Verificato
            if (isCertified === false && revTimestamp.toString() !== '0') {
                statusCode = 2;
                // AA formattedRevocationDate = new Date(revTimestamp * 1000).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
            } else if (isCertified === true) {
                // Non Serve revTimestamp.toString() === '0' Perchè Se È True Significa Che Non È Revocato
                statusCode = 1;
            }

            // Recupero SBT (Con controllo di sicurezza null check)
            let sbtId = "N/A";
            try {
                const sbtInfo = await this.getSBTInfo(authorAddress);
                if (sbtInfo && sbtInfo.sbtTokenId) {
                    sbtId = sbtInfo.sbtTokenId.toString();
                }
            } catch (errorSBT) {
                console.warn("moduleBlockchain: Impossibile Recuperare Info SBT Per Autore Documento:", errorSBT);
            }

            // Costruzione Oggetto Di Ritorno
            const documentData = {
                status: statusCode,
                hash: docHash,
                author: authorAddress,
                sbtId: sbtId,

                // Frontend Vuole Il Numero Del Blocco In Cui È Stato Certificato (Per Adesso Placeholder)
                block: "Archive",

                // Frontend Vuole Timestamp In Stringa E Lo Formatta In Data
                timestamp: certTimestamp.toString(),
                revocationTimestamp: revTimestamp.toString()
            };

            return documentData;

        } catch (error) {
            // Se Smart Contract Chiama revert DocumentNotFound();
            console.error("moduleBlockchain: Errore Nel Recupero Dello Stato Del Documento:", error);
            // Restituisco un oggetto con status 0 per coerenza (invece del primitivo 0)
            return { status: 0 };
        }
    },

    // NN revokeDocument
    // Invalida Ufficialmente La Certificazione Di Un Documento Notarizzato (Può Essere Fatta Solo Dall'Autore)
    async revokeDocument(hash) {
        console.log(`moduleBlockchain: Chiamata revokeDocument(${hash})...`);

        // Inizializza Il Provider (Per Lettura)
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Inizializza Il Signer (Per Firmare Transazioni E Pagare Il Gas)
        const signer = await provider.getSigner();

        // Inizializza Il Contratto Notarizer Con Il Signer Per Abilitare Le Funzioni Di Scrittura
        const notarizerContract = new ethers.Contract(
            notarizerAddress,
            notarizerABI,
            signer
        );

        try {
            // Invio Della Transazione Di Revoca Del Documento
            // A Questo Punto La Transazione È Inviata Alla Rete Ma non Ancora Scritta In Un Blocco
            // Quindi Si Estraggono I Dati Della Richiesta Di Revoca (TransactionResponse)
            const txResponse = await notarizerContract.revoke(hash);
            console.log("moduleBlockchain: Transazione Revoca Inviata. Hash: ", txResponse.hash);
            console.log("moduleBlockchain: In Attesa Della Conferma Della Revoca...");

            // Attesa Della Conferma Della Transazione (TransactionReceipt)
            // In Ethers.js Il Metodo wait() Sul TransactionResponse Sospende L'Esecuzione Finché La Transazione 
            // Non Viene Validata E Inclusa In Un Blocco. Restituisce Un TransactionReceipt Che Contiene I Dettagli 
            // L'Esito Finale Della Transazione E Gli Eventi Emessi (In Questo Caso, L'Evento DocumentNotarized)
            const txReceipt = await txResponse.wait();
            console.log("moduleBlockchain: Transazione Revoca Confermata Nel Blocco: ", txReceipt.blockNumber);

            // Estraggo Il Timestamp Della Revoca Dal Blocco
            const docStatus = await this.getDocumentStatus(hash);

            const revocationTimestamp = docStatus.revocationTimestamp;
            const docHash = docStatus.hash;

            const returnData = {
                // Status Dovrebbe Essere Sempre 1 Qui
                success: true,
                status: txReceipt.status,
                txHash: txReceipt.hash,
                revocationTimestamp: revocationTimestamp,
                docHash: docHash

            };

            return returnData;
        } catch (error) {
            console.error("moduleBlockchain: Errore Nella Revoca Del Documento:", error);
            const returnData = {
                success: false,
                error: error.message
            };
        }
    },

    // NN getUserDocuments
    // Ricostruisce L'Elenco Dei Documenti Notarizzati Da Un Indirizzo
    // In Solidity, scrivere dati in una variabile di "Stato" (ovvero nella memoria permanente dello Smart Contract) comporta costi di gas elevati.
    // Al contrario, l'emissione di un Evento è un'operazione molto più economica.
    // Invece di salvare il nome del file in una variabile, lo Smart Contract emette l'evento event 
    // AA `DocumentNotarized(address author, bytes32 hash, string fileName);` 
    // che registra le informazioni direttamente nei Logs della transazione. Attraverso la libreria Ethers.js, il frontend può interrogare questi 
    // registri cercando tutti gli eventi emessi da un determinato indirizzo.
    // Questo metodo permette di recuperare la lista completa dei nomi dei file e dei relativi hash direttamente dalla blockchain, garantendo la 
    // persistenza dei dati senza dover ricorrere a database locali e riducendo drasticamente il consumo di gas.
    async getUserDocuments(userAddress) {
        console.log(`Blockchain Service: Chiamata getUserDocuments(${userAddress})`);

        // Inizializzazione Provider e Contratto (Una volta sola)
        const provider = new ethers.BrowserProvider(window.ethereum);
        const notarizerContract = new ethers.Contract(
            notarizerAddress,
            notarizerABI,
            provider
        );

        try {
            // Lista Documenti Notarizzati
            const userNotarizedDocs = [];
            // Lista Documenti Revocati
            const userRevokedDocs = [];

            // Lista Finale Documenti Utente
            const userDocuments = [];

            // Definizione Filtro Evento DocumentNotarized Per userAddress
            // Evento Emesso Alla Creazione Di Una Nuova Notarizzazione
            // event DocumentNotarized(bytes32 indexed _hash, address indexed author, uint256 timestamp);
            const filterNotarized = notarizerContract.filters.DocumentNotarized(null, userAddress);
            const eventsNotarized = await notarizerContract.queryFilter(filterNotarized);

            if (eventsNotarized.length === 0) {
                console.warn("moduleBlockchain: Nessun Evento DocumentNotarized Trovato Per Questo Utente");
            } else {
                // Costruzione Lista Documenti Notarizzati
                console.log("moduleBlockchain: Trovati", eventsNotarized.length, "Eventi DocumentNotarized");

                for (const notarizationEvent of eventsNotarized) {
                    const notarizationArgs = notarizationEvent.args;

                    // Estrazione Dati
                    const docHash = notarizationArgs[0];
                    const userAddr = notarizationArgs[1];
                    const notarizationTimestamp = Number(notarizationArgs[2]);
                    const txHash = notarizationEvent.transactionHash;

                    const notarizedDoc = {
                        hash: docHash,
                        userAddress: userAddr,
                        txHash: txHash,
                        notarizationTimestamp: notarizationTimestamp
                    };

                    userNotarizedDocs.push(notarizedDoc);
                }
            }

            // Definzione Filtro Evento DocumentRevoked Per userAddress
            // Evento Emesso Quando Un Autore Invalida Un Proprio Documento
            // event DocumentRevoked(bytes32 indexed _hash, address indexed author);
            const filterRevoked = notarizerContract.filters.DocumentRevoked(null, userAddress);
            const eventsRevoked = await notarizerContract.queryFilter(filterRevoked);

            if (eventsRevoked.length === 0) {
                console.warn("moduleBlockchain: Nessun Evento DocumentRevoked Trovato Per Questo Utente");
                // NON ritornare null qui. Continua.
            } else {
                // Costruzione Lista Documenti Revocati
                console.log("moduleBlockchain: Trovati", eventsRevoked.length, "Eventi DocumentRevoked");

                for (const revocationEvent of eventsRevoked) {
                    const revocationArgs = revocationEvent.args;

                    // Estrazione Dati
                    const docHash = revocationArgs[0];
                    const userAddr = revocationArgs[1];
                    const txHash = revocationEvent.transactionHash;
                    const blockNumber = revocationEvent.blockNumber;

                    // Recupero Timestamp Dal Blocco
                    const blockData = await provider.getBlock(blockNumber);
                    const revocationTimestamp = blockData.timestamp;

                    const revokedDoc = {
                        hash: docHash,
                        userAddress: userAddr,
                        txHash: txHash,
                        revocationTimestamp: revocationTimestamp
                    };
                    userRevokedDocs.push(revokedDoc);
                }
            }

            console.log("moduleBlockchain: Documenti Notarizzati:", userNotarizedDocs);
            console.log("moduleBlockchain: Documenti Revocati:", userRevokedDocs);

            // Invece Di Lasciare I Documenti Revocati In Una Lista, Si Costruisce Una Mappa Dove:
            // Chiave = Hash Del Documento
            // Valore = Oggetto Documento Revocato (Elemento Lista)
            const revokedMap = new Map();
            userRevokedDocs.forEach(doc => revokedMap.set(doc.hash, doc));

            // Iterazione Sui Documenti Notarizzati
            for (const notarizedDocElement of userNotarizedDocs) {
                // Estrazione Hash Documento Corrente
                const docHash = notarizedDocElement.hash;
                // Controllo Se Il Documento È Stato Revocato (Se È Presente Nella Mappa È Stato Revocato)
                // has() Restituisce true Se La Chiave Esiste Nella Mappa, Altrimenti false
                const isRevoked = revokedMap.has(docHash);

                let currentTimestamp;
                let currentTxHash;
                let currentStatus;

                // Creazione Nome Custom Per Il File In Quanto Non Salvato In Blockchain Per Risparmiare Gas
                const fileName = `Documento_${docHash.substring(0, 5)}...`;

                // Gestione Del Timestamp E Del Transaction Hash In Base Alla Revoca
                if (isRevoked) {
                    // Documento Revocato
                    const revocationData = revokedMap.get(docHash);
                    // Estrazione Data Di Revoca
                    currentTimestamp = revocationData.revocationTimestamp;

                    // Estrazione Transaction Hash Di Revoca
                    currentTxHash = revocationData.txHash;

                    // Stato Documento In Stringa
                    currentStatus = "Revocato";
                } else {
                    // Documento Valido
                    // Estrazione Data Di Notarizzazione
                    currentTimestamp = notarizedDocElement.notarizationTimestamp;

                    // Estrazione Transaction Hash Di Notarizzazione
                    currentTxHash = notarizedDocElement.txHash;

                    // Stato Documento In Stringa
                    currentStatus = "Verificato";
                }

                const userDocumentElement = {
                    name: fileName,
                    hash: docHash,
                    notarizationDate: currentTimestamp,
                    txHash: currentTxHash,
                    status: currentStatus
                };

                // Aggiunta Documento Alla Lista Finale
                userDocuments.push(userDocumentElement);
            }

            // Ordinamento Documenti Per Data Decrescente (Dal Più Recente Al Meno Recente)
            userDocuments.sort((a, b) => b.notarizationDate - a.notarizationDate);
            console.log("moduleBlockchain: Documenti Finali Dell'Utente:", userDocuments);

            return userDocuments;

        } catch (error) {
            console.error("moduleBlockchain: Errore Nel Recupero Dei Documenti Dell'Utente:", error);
            return null;
        }
    }
};