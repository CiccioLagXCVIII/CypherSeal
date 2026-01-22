// moduleProfile.js
import { Blockchain } from './moduleBlockchain.js';
import { General } from './moduleGeneral.js';

export const Profile = {
    // Funzione Per Copiare Indirizzo Wallet Negli Appunti
    copyAddressToClipboard() {
        // Elemento Dove Mostrare L'Hash Calcolato
        const fileHashDisplay = document.getElementById("walletAddressDisplay");
        // Pulsante Per Copiare L'Hash Negli Appunti
        const copyBtn = document.getElementById("copyAddressBtn");

        // Logica Di Copia Negli Appunti E Notifiche
        if (copyBtn) {
            // Aggiunge Evento Click Al Pulsante Di Copia
            copyBtn.addEventListener("click", () => {
                // Recupera L'Hash Visualizzato
                const text = fileHashDisplay.textContent;
                // Verifica Che L'Hash Sia Pronto
                if (text && text !== "Calcolo in corso...") {
                    // Utilizza L'API Di Sistema Per Scrivere Il Testo Negli Appunti
                    navigator.clipboard.writeText(text);
                    // Recupera L'Elemento Toast Dalla Pagina
                    const toast = document.getElementById("copyToast");
                    // Mostra Il Messaggio Di Conferma Per Alcuni Secondi
                    toast.classList.add("show");
                    // Programma La Scomparsa Automatica Della Notifica
                    setTimeout(() => toast.classList.remove("show"), 2000);
                }
            });
        }
    },

    // Gestione Prima Colonna (Indirizzo Wallet)
    async renderWalletInfo(walletConnected) {
        const walletBrandDisplay = document.getElementById('walletBrand');
        const connectionStatus = document.getElementById('connectionStatus');
        const networkDisplay = document.getElementById('networkDisplay');

        // Definizione Oggetto Networks
        const networks = {
            '0x1': 'Ethereum Mainnet',
            '0xaa36a7': 'Sepolia Testnet',
            '0x5': 'Goerli Testnet',
            '0x89': 'Polygon Mainnet',
            '0x13881': 'Mumbai Testnet'
        };

        // Rilevamento Wallet e Network
        if (Blockchain.isProviderAvailable()) {
            // Wallet Info
            let name = Blockchain.getWalletBrand();
            if (walletBrandDisplay && connectionStatus) {
                walletBrandDisplay.textContent = name;
                connectionStatus.textContent = "Connected";
            }

            console.log("CypherSeal: Wallet Identificato:", name);

            // Network Info
            let chainId = await Blockchain.getChainId();

            if (chainId != '0xaa36a7') {
                console.warn("CypherSeal: Selezionata Rete Errata. Tentativo Di Switch Su Sepolia Testnet Per Funzionamento Corretto.");
                const switched = await Blockchain.switchToSepolia();

                if (switched) {
                    chainId = await Blockchain.getChainId();
                    console.log("CypherSeal: Switch Rete Avvenuto Con Successo. Nuovo Chain ID:", chainId);
                } else {
                    // Se Lo Switch Fallisce, Oppure L'Utente Rifiuta, Mostra Messaggio Di Errore
                    console.error("CypherSeal: Impossibile Passare Alla Sepolia Testnet. Assicurati Di Essere Connesso Alla Rete Corretta.");
                    // Modifica L'Interfaccia Per Indicare L'Errore
                    if (networkDisplay) {
                        networkDisplay.textContent = "Rete Errata - Connetti A Sepolia";
                        networkDisplay.classList.add("text-danger");
                    }
                    // Interrompe Ulteriori Operazioni Perche Non Si E' Sulla Rete Corretta
                    return;
                }
            } else {
                console.log("CypherSeal: Connesso Alla Sepolia Testnet.");
            }

            let networkName = networks[chainId] || `Chain ID: ${chainId}`;

            if (networkDisplay) {
                networkDisplay.textContent = networkName;
            }

            // Visualizza Indirizzo Etherscan Del Wallet Collegato
            const etherscanLinkDisplay = document.getElementById('etherscanLinkDisplay');
            if (etherscanLinkDisplay) {
                etherscanLinkDisplay.setAttribute('href', `https://sepolia.etherscan.io/address/${walletConnected}`);
            }

            console.log("CypherSeal: Network Rilevato:", networkName);
        } else {
            if (walletBrandDisplay) walletBrandDisplay.textContent = "No Wallet";
            if (connectionStatus) connectionStatus.textContent = "Disconnected";
        }
    },

    // Gestione Seconda Colonna (Dati Identità SBT)
    renderSBTInfo(identityInfo) {

        // Logica Icona "Randomica" Deterministica
        const avatarImg = document.getElementById('userAvatar');
        const fallbackIcon = document.getElementById('userAvatarFallback');

        const sbtBadge = document.getElementById('sbtBadgeContainer');
        const identitySBT = localStorage.getItem('identitySBT');

        if (sbtBadge && identitySBT === 'true') {
            // Mostra Badge Verde SBT
            sbtBadge.style.setProperty('display', 'block', 'important');
        }

        if (avatarImg && fallbackIcon) {
            // Uso DiceBear API Con Stile 'bottts'
            // Il 'Seed' Assicura Che Lo Stesso Indirizzo Generi Sempre La Stessa Immagine
            // Aggiunto &backgroundColor=transparent per evitare quadrati colorati che coprano il cerchio CSS
            const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${identityInfo.userAddress}&backgroundColor=transparent`;

            // Alternativa (Mostriciattolo) Usando Robohash:
            // return `https://robohash.org/${address}.png?set=set1`;

            avatarImg.src = avatarUrl;
            avatarImg.style.display = 'block';
            fallbackIcon.style.display = 'none';
        }

        // Dati Badge Identità
        const sbtTokenId = identityInfo.sbtTokenId;
        const emissionDate = identityInfo.emissionDate;
        const registryNet = identityInfo.registryNet;
        const trustLevel = identityInfo.trustLevel;


        // Aggiorna L'Interfaccia
        const sbtTokenIdDisplay = document.getElementById('sbtTokenIdDisplay');
        const emissionDateDisplay = document.getElementById('emissionDateDisplay');
        const registryNetDisplay = document.getElementById('registryNetDisplay');



        if (sbtTokenIdDisplay && emissionDateDisplay && registryNetDisplay) {
            sbtTokenIdDisplay.textContent = `CYID-${sbtTokenId}`;
            emissionDateDisplay.textContent = emissionDate;
            registryNetDisplay.textContent = registryNet;

        }
    },

    // Gestione Tabella Documenti Certificati
    renderTableData(certifiedDocuments) {
        const documentsTable = document.getElementById('certifiedDocumentsTable');
        if (!documentsTable) return;

        const tbody = documentsTable.querySelector('tbody');
        tbody.innerHTML = '';

        certifiedDocuments.forEach(element => {
            // Gestione Data
            const documentTimestamp = element.timestamp;
            let formattedDate = "Data Non Valida";
            if (documentTimestamp) {
                let dateObj;
                if (!isNaN(documentTimestamp)) {
                    dateObj = new Date(documentTimestamp * 1000);
                } else {
                    dateObj = new Date(documentTimestamp);
                }

                formattedDate = dateObj.toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                });
            }

            // Gestione Variabili Dinamiche
            const shortHash = element.hash.slice(0, 5) + "..." + element.hash.slice(-5);

            let shortTx;
            if (element.txHash) {
                shortTx = element.txHash.slice(0, 6) + "..." + element.txHash.slice(-4);
            } else {
                shortTx = "---";
            }

            let statusBadge = '';
            let actionButton = '';
            let nameClass = 'fw-bold text-white';
            let dateContent = `<span class="text-muted small">${formattedDate}</span>`;
            // Classe Default Link TX
            let txLinkClass = 'txLink';
            // Icona Default Link TX
            let txIcon = 'bi-box-arrow-up-right';

            // Logica Stati Documenti
            switch (element.status) {
                case 'Verificato':
                    statusBadge = `<span class="badge rounded-pill text-uppercase fw-bold py-1 px-2 verifiedBadge"><i class="bi bi-patch-check-fill me-1"></i>Certificato</span>`;
                    actionButton = `<button class="btn revokeButton" data-hash="${element.hash}">Revoca</button>`;
                    break;

                case 'Pending':
                    statusBadge = `<span class="badge rounded-pill text-uppercase fw-bold py-1 px-2 pendingBadge"><i class="bi bi-send me-1"></i>In Invio...</span>`;
                    actionButton = `<button class="btn processingButton" disabled><span class="spinner-border spinner-border-sm"></span></button>`;
                    break;

                case 'Fallito':
                    statusBadge = `<span class="badge rounded-pill text-uppercase fw-bold py-1 px-2 failedBadge"><i class="bi bi-exclamation-triangle-fill me-1"></i>Fallito</span>`;
                    actionButton = `<button class="btn retryButton" data-hash="${element.hash}">Riprova</button>`;
                    break;

                case 'Revocato':
                    statusBadge = `<span class="badge rounded-pill text-uppercase fw-bold py-1 px-2 revokedBadge"><i class="bi bi-x-circle-fill me-1"></i>Revocato</span>`;
                    actionButton = '';
                    nameClass = 'textRevoked';
                    // Modifica Link TX Per Revocato
                    txLinkClass = 'txLinkRevoked';
                    // Icona TX Per Revocato
                    txIcon = 'bi-box-arrow-up-right';
                    dateContent = `
                    <div class="d-flex flex-column">
                        <span class="revokedLabel">Revocato il:</span>
                        <span class="text-muted small">${formattedDate}</span>
                    </div>`;
                    break;

                default: // In Attesa Generico
                    statusBadge = `<span class="badge rounded-pill text-uppercase fw-bold py-1 px-2 neutralBadge"><i class="bi bi-hourglass-split me-1"></i>In Attesa</span>`;
                    actionButton = `<button class="btn processingButton" disabled>Elaborazione...</button>`;
                    break;
            }

            // Contenuto Riga Transazione
            let txColumnContent;
            if (element.txHash) {
                txColumnContent = `
                    <a href="https://sepolia.etherscan.io/tx/${element.txHash}" target="_blank" class="${txLinkClass}">
                        <i class="bi ${txIcon} me-1"></i>${shortTx}
                    </a>`;
            } else {
                txColumnContent = '<span class="text-muted small"</span>';
            }

            // Generazione Riga
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="ps-3 ${nameClass}">${element.name}</td>
                <td>${dateContent}</td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <span class="documentHash">${shortHash}</span>
                        <button class="copyHashButton" data-hash="${element.hash}" title="Copia Hash">
                            <i class="bi bi-copy"></i>
                        </button>
                    </div>
                </td>
                <td>
                    ${txColumnContent}
                </td>
                <td>${statusBadge}</td>
                <td class="pe-3 text-center">${actionButton}</td>
            `;
            tbody.appendChild(row);
        });

        // Gestione Dati Badge SBT Che Dipendono Dai Documenti Certificati

        // Data Ultima Certificazione
        // In moduleBlockchain La Funzione getUserDocuments REstituisce L'Array userDocuments Che È Contenuto In certifiedDocuments
        // L'Array È Ordinato Dal Più Recente Al Meno Recente Quindi Prendo Il Primo Elemnento
        const lastDocument = certifiedDocuments[0];
        const lastTimestamp = lastDocument.timestamp;

        let formattedDate = "Data Non Valida";
        if (lastTimestamp) {
            let dateObj;
            if (!isNaN(lastTimestamp)) {
                dateObj = new Date(lastTimestamp * 1000);
            } else {
                dateObj = new Date(lastTimestamp);
            }

            formattedDate = dateObj.toLocaleDateString("it-IT", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
        }

        const dataUltCertDisplay = document.getElementById('dataUltCertificaDisplay');
        dataUltCertDisplay.textContent = formattedDate;

        // Numero Documenti Certificati
        const numDocCertificati = certifiedDocuments.length;
        // const numDocCertificati = 31;
        const numDocCertDisplay = document.getElementById('numDocCertificatiDisplay');
        numDocCertDisplay.textContent = numDocCertificati;

        const trustLevelDisplay = document.getElementById('trustLevelDisplay');

        // Rimozione Di Tutte Le Classi
        trustLevelDisplay.classList.remove('bg-light', 'bg-info', 'bg-primary', 'bg-success', 'bg-warning', 'text-dark');

        let levelText = "";
        let levelClass = "";
        let textDark = false;

        // Calcolo Range Dal Più Alto Al Più Basso
        if (numDocCertificati >= 30) {
            levelText = "Leggendario";
            levelClass = "bg-warning";
            textDark = true;
        } else if (numDocCertificati >= 15) {
            levelText = "Esperto";
            levelClass = "bg-success";
        } else if (numDocCertificati >= 5) {
            levelText = "Affidabile";
            levelClass = "bg-primary";
        } else if (numDocCertificati >= 1) {
            levelText = "Iniziato";
            levelClass = "bg-info";
            textDark = true;
        } else {
            levelText = "Nuovo";
            levelClass = "bg-light";
            textDark = true;
        }

        trustLevelDisplay.textContent = levelText;
        trustLevelDisplay.classList.add(levelClass);
        if (textDark) trustLevelDisplay.classList.add('text-dark');
    },

    // Copia Indirizzo Wallet Click Pulsante E Copia Indirizzo Hash Tabella
    setupEventListeners(walletConnected) {
        // Indirizzo Wallet - Copia Al Click Del Pulsante
        const copyBtn = document.getElementById('copyAddressBtn');
        if (copyBtn) {
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(walletConnected);
                // Feedback Visivo Sul Pulsante
                const icon = copyBtn.querySelector('i');
                const originalClass = icon.className;
                icon.className = 'bi bi-check';

                setTimeout(() => {
                    icon.className = originalClass;
                }, 2000);
            };
        }

        // Listeners Per I Pulsanti Nella Tabella
        const table = document.getElementById('certifiedDocumentsTable');
        if (table) {
            table.onclick = async (event) => {
                // Gestione Click Pulsante Copia Hash
                const copyTarget = event.target.closest('.copyHashButton');
                if (copyTarget) {
                    const hashToCopy = copyTarget.getAttribute('data-hash');

                    if (hashToCopy) {
                        navigator.clipboard.writeText(hashToCopy);

                        const icon = copyTarget.querySelector('i');
                        const originalClass = icon.className;
                        icon.className = 'bi bi-check';

                        setTimeout(() => {
                            icon.className = originalClass;
                        }, 2000);
                    }
                }

                // Gestione Click Pulsante Revoca
                const revokeTarget = event.target.closest('.revokeButton');
                if (revokeTarget) {
                    const hashToRevoke = revokeTarget.getAttribute('data-hash');

                    // Feedback visivo immediato
                    revokeTarget.textContent = "Revoca in corso...";
                    revokeTarget.disabled = true;

                    try {
                        // Chiamata al Mock Blockchain
                        const result = await Blockchain.revokeDocument(hashToRevoke);

                        if (result.success) {
                            alert(`Documento Revocato Con Successo!\nTX: ${result.txHash}`);
                            // Ricarica La Pagina Per Aggiornare Lo Stato
                            window.location.reload();
                        }
                    } catch (error) {
                        console.error("Errore revoca:", error);
                        revokeTarget.textContent = "Errore";
                    }
                }
            };
        }
    },

    async fetchDocumentData(wallet) {
        const documents = await Blockchain.getUserDocuments(wallet);

        console.log("Documenti Certificati Da ", wallet, ":", documents);
        return documents;
    },

    // Funzione Principale
    async updateProfileInterface() {
        const walletConnected = localStorage.getItem('walletAddress') || "";
        const currentPage = General.findPage();

        if (currentPage === 'profilo.html' && walletConnected) {
            const walletDisplay = document.getElementById('walletAddressDisplay');
            const requestSection = document.getElementById('identityRequest');
            const profileSection = document.getElementById('profileDashboard');
            const loadingSpinner = document.getElementById('loadingSection');

            // 1. STATO INIZIALE: Mostro solo lo spinner, nascondo tutto il resto
            if (loadingSpinner) loadingSpinner.classList.remove('d-none');
            if (requestSection) requestSection.classList.add('d-none');
            if (profileSection) profileSection.classList.add('d-none');

            console.log("CypherSeal: Avvio caricamento asincrono...");

            try {
                // Interazone Con La Blockchain Per Caricare I Dati Dell'Utente (Si Ferma Qui Finché Non Riceve Tutto)
                const hasIdentity = await Blockchain.getSBTStatus(walletConnected);
                const certDocuments = await Blockchain.getUserDocuments(walletConnected);
                const identityInfo = await Blockchain.getSBTInfo(walletConnected);
                // Aggiorno il localStorage
                localStorage.setItem('identitySBT', hasIdentity.toString());

                // Modifiche UI Basate Sullo Stato Ottenuto Anche Se I Div Sono Nascosti
                if (walletDisplay) walletDisplay.textContent = walletConnected;
                await this.renderWalletInfo(walletConnected);
                this.renderSBTInfo(identityInfo);
                this.setupEventListeners(walletConnected);
                this.renderTableData(certDocuments);

                // Nascondo Lo Spinner E Mostro La Sezione Corretta
                if (loadingSpinner) loadingSpinner.classList.add('d-none');

                if (hasIdentity) {
                    console.log("CypherSeal: Mostro Dashboard Profilo");
                    if (profileSection) profileSection.classList.remove('d-none');
                    if (requestSection) requestSection.classList.add('d-none');
                } else {
                    console.log("CypherSeal: Mostro Richiesta Minting Identità SBT");
                    if (requestSection) requestSection.classList.remove('d-none');
                    if (profileSection) profileSection.classList.add('d-none');
                }

            } catch (error) {
                console.error("CypherSeal: Errore Durante Il Caricamento Dati", error);
                if (loadingSpinner) loadingSpinner.classList.add('d-none');
            }
        }
    },
}
