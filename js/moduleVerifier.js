// moduleVerifier.js
import { Blockchain } from './moduleBlockchain.js';

export const Verifier = {

    // Funzione Principale Di Verifica Del Documento Sulla Blockchain
    async checkDocumentOnChain(hash) {

        // Elementi Interfaccia Utente
        const infoPanel = document.getElementById("infoPanel");
        const resultPlaceholder = document.getElementById("resultPlaceholder");
        const resultData = document.getElementById("resultData");
        const statusBadge = document.getElementById("statusBadge");

        // Elementi Box Esito
        const authorItem = document.getElementById("resAuthor");
        const authorLinkItem = document.getElementById("resAuthorLink");
        const sbtItem = document.getElementById("resSbtId");
        const blockItem = document.getElementById("resBlock");
        const dateLabel = document.getElementById("resDateLabel");
        const dateItem = document.getElementById("resDate");
        // ID Box Identità
        const boxVerified = document.getElementById("idBoxVerified");
        const boxUnverified = document.getElementById("idBoxUnverified");
        const boxGuest = document.getElementById("idBoxGuest");

        // Reset Iniziale
        resultPlaceholder.classList.add("d-none");
        resultData.classList.remove("d-none");
        statusBadge.className = "verificationBadge";

        // Nascondi I Box Identità Autore
        if (boxVerified) {
            boxVerified.classList.add("d-none");
        }

        if (boxUnverified) {
            boxUnverified.classList.add("d-none");
        }

        if (boxGuest) {
            boxGuest.classList.add("d-none");
        }
        infoPanel.innerHTML += `<p class="text-white"> > Ricerca Hash ${hash.substring(0, 10)} Nella Blockchain...</p>`;

        try {
            // Possibili Stati: 0 = Non Trovato, 1 = Valido, 2 = Revocato
            const statusResponse = await Blockchain.getDocumentStatus(hash);

            console.log("Risposta Stato Documento:", statusResponse);

            // A Prescindere Che Il Documento Sia Certificato O Revocato, Si Mostrano I Dati Dell'Autore
            if (statusResponse.status === 1 || statusResponse.status === 2) {
                const authorAddr = statusResponse.author;
                const sbtTokenId = statusResponse.sbtId;
                const certificationTimestamp = statusResponse.timestamp;
                const revokeTimestamp = statusResponse.revocationTimestamp;
                const blockNumber = statusResponse.block;

                authorItem.textContent = authorAddr.substring(0, 6) + "..." + authorAddr.substring(38);
                authorLinkItem.href = `https://sepolia.etherscan.io/address/${authorAddr}`;

                if (sbtTokenId && sbtTokenId !== "N/A" && sbtTokenId !== "---") {
                    sbtItem.textContent = `CYID-${sbtTokenId}`;
                } else {
                    sbtItem.textContent = "---";
                }

                if (blockNumber !== "N/A" && blockNumber !== "Errore RPC") {
                    blockItem.textContent = blockNumber;
                    blockItem.href = `https://sepolia.etherscan.io/block/${blockNumber}`;
                } else {
                    blockItem.textContent = "Non Disponibile";
                    blockItem.removeAttribute("href");
                }

                if (statusResponse.status === 2) {
                    // Se Revocato, Mostro La Data Di Revoca
                    dateLabel.textContent = "Data Revoca:";
                    dateItem.textContent = new Date(parseInt(revokeTimestamp) * 1000).toLocaleDateString();
                } else {
                    // Se Certificato, Mostro La Data Di Certificazione
                    dateItem.textContent = new Date(parseInt(certificationTimestamp) * 1000).toLocaleDateString();
                }

                const currentUserAddress = localStorage.getItem('walletAddress');

                await this.checkAuthorIdentity(currentUserAddress);
            } else {
                // Se Il Documento Non È Trovato, Si Mostrano I Placeholder
                authorItem.textContent = "---";
                sbtItem.textContent = "---";
                blockItem.textContent = "---";
                dateItem.textContent = "---";

                // Nascondi I Box Identità Autore
                if (boxVerified) {
                    boxVerified.classList.add("d-none");
                }

                if (boxUnverified) {
                    boxUnverified.classList.add("d-none");
                }

                if (boxGuest) {
                    boxGuest.classList.add("d-none");
                }

            }

            // Gestione Badge Risultato Verifica E Messaggi In infoPanel
            if (statusResponse.status === 1) {
                // CASO: CERTIFICATO (Verde)
                statusBadge.innerHTML = `<i class="bi bi-patch-check-fill me-2"></i> Documento Autentico`;
                statusBadge.classList.add("badgeValid");

                infoPanel.innerHTML += `<p class="text-success"> > Successo: Il Documento È Certificato e Immutato.</p>`;

            } else if (statusResponse.status === 2) {
                // CASO: REVOCATO (Rosso)
                statusBadge.innerHTML = `<i class="bi bi-exclamation-octagon me-2"></i> Documento Revocato`;
                statusBadge.classList.add("badgeRevoked");

                infoPanel.innerHTML += `<p class="text-danger"> > Attenzione: Il Documento È Stato Revocato dall'Autore.</p>`;

            } else {
                // CASO: NON TROVATO (Grigio)
                statusBadge.innerHTML = `<i class="bi bi-x-circle me-2"></i> Documento Non Trovato`;
                statusBadge.classList.add("badgeNotFound");

                infoPanel.innerHTML += `<p class="text-muted"> > Attenzione: Documento Non Trovato Nella Blockchain</p>`;
            }

        } catch (error) {
            console.error("Errore verifica:", error);
            infoPanel.innerHTML += `<p class="text-danger"> > Errore Durante L'Interazione Con La Blockchain</p>`;
        }
    },

    // Funzione Per Controllare L'Identità Dell'Autore Tramite SBT
    async checkAuthorIdentity(viewerAddress) {
        const infoPanel = document.getElementById("infoPanel");

        // ID Box Identità
        const boxVerified = document.getElementById("idBoxVerified");
        const boxUnverified = document.getElementById("idBoxUnverified");
        const boxGuest = document.getElementById("idBoxGuest");

        // Reset Iniziale
        if (boxVerified) boxVerified.classList.add("d-none");
        if (boxUnverified) boxUnverified.classList.add("d-none");
        if (boxGuest) boxGuest.classList.add("d-none");

        // Utente Non Connesso (Ospite)
        if (!viewerAddress) {
            if (boxGuest) boxGuest.classList.remove("d-none");
            infoPanel.innerHTML += `<p class="text-muted"> > Visualizzazione come Ospite (Nessun Wallet).</p>`;
            return;
        }

        console.log("CypherSeal: Controllo SBT per il visualizzatore: " + viewerAddress);

        // Controllo Blockchain
        const hasIdentityBadge = await Blockchain.getSBTStatus(viewerAddress);

        if (hasIdentityBadge) {
            // Utente Connesso Con SBT (Verificato)
            if (boxVerified) boxVerified.classList.remove("d-none");
            infoPanel.innerHTML += `<p class="text-primary"> > Identità Utente Confermata (SBT Rilevato).</p>`;
        } else {
            // Utente Connesso Senza SBT
            if (boxUnverified) boxUnverified.classList.remove("d-none");
            infoPanel.innerHTML += `<p class="text-warning"> > Attenzione: Il tuo wallet non ha un'identità SBT.</p>`;
        }
    },

    // Funzione Per Gestire La Selezione Del File
    async handleFileSelection(file) {
        if (!file) return;

        const infoPanel = document.getElementById("infoPanel");
        const hashDisplay = document.getElementById("fileHash");
        const fileInfo = document.getElementById("fileInfo");
        const uploadState = document.getElementById("uploadState");
        const successState = document.getElementById("successState");

        // UI Feedback
        uploadState.classList.add("d-none");
        successState.classList.remove("d-none");
        fileInfo.style.display = "block";
        hashDisplay.textContent = "Calcolo hash...";
        infoPanel.innerHTML = `<p class="text-muted"> > Analisi file: ${file.name}</p>`;

        // Calcolo Hash
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

        hashDisplay.textContent = hashHex;

        // Avvia Verifica
        await this.checkDocumentOnChain(hashHex);
    },

    // Funzione Per Resettare L'Interfaccia Grafica
    resetInfoBox() {
        // Recupero Elementi Interfaccia Grafica

        // Colonna Upload (Sinistra)
        const uploadState = document.getElementById("uploadState");
        const successState = document.getElementById("successState");
        const fileInfo = document.getElementById("fileInfo");
        const fileInput = document.getElementById("fileInput");
        const hashDisplay = document.getElementById("fileHash");

        // Colonna Risultati (Destra)
        const resultPlaceholder = document.getElementById("resultPlaceholder");
        const resultData = document.getElementById("resultData");
        const statusBadge = document.getElementById("statusBadge");

        // Elementi Box Esito
        const resDate = document.getElementById("resDate");
        const resAuthor = document.getElementById("resAuthor");
        const resBlock = document.getElementById("resBlock");

        // Badge Identità Utente
        const boxVerified = document.getElementById("idBoxVerified");
        const boxUnverified = document.getElementById("idBoxUnverified");
        const boxGuest = document.getElementById("idBoxGuest");

        // info Panel
        const infoPanel = document.getElementById("infoPanel");


        // Reset Stato Iniziale Di Attesa File
        if (uploadState) {
            uploadState.classList.remove("d-none");
        }
        if (successState) {
            successState.classList.add("d-none");
        }

        if (fileInfo) {
            fileInfo.style.display = "none";
        }
        if (fileInput) {
            fileInput.value = "";
        }
        if (hashDisplay) {
            hashDisplay.textContent = "";
        }

        // Reset Risultati Verifica
        if (resultPlaceholder) resultPlaceholder.classList.remove("d-none");
        if (resultData) resultData.classList.add("d-none");

        // Reset Badge Stato Verifica
        if (statusBadge) {
            statusBadge.className = "verificationBadge";
            statusBadge.innerHTML = "";
        }

        // Reset Dati Box Esito
        if (resDate) resDate.textContent = "---";
        if (resAuthor) resAuthor.textContent = "---";
        if (resBlock) resBlock.textContent = "---";

        // Reset Badge Identità Utente
        if (boxVerified) boxVerified.classList.add("d-none");
        if (boxUnverified) boxUnverified.classList.add("d-none");
        if (boxGuest) boxGuest.classList.add("d-none");

        // Reset infoPanel
        if (infoPanel) {
            infoPanel.innerHTML = `<p class="text-muted">> In attesa di input...</p>`;
        }
    },

    // Funzione Di Inizializzazione Per Collegare Gli Eventi
    handleVerification() {
        const fileInput = document.getElementById("fileInput");
        const dropZone = document.getElementById("dropZone");
        const resetBtn = document.getElementById("resetBtn");

        if (dropZone && fileInput) {
            dropZone.addEventListener("drop", async (e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                await this.handleFileSelection(file);
            });

            fileInput.addEventListener("change", async (e) => {
                const file = e.target.files[0];
                await this.handleFileSelection(file);
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                this.resetInfoBox();
            });
        }
    }
};