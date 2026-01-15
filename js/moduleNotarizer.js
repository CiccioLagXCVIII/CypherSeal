// moduleNotarizer.js
import { Blockchain } from './moduleBlockchain.js';

export const Notarizer = {

    // Funzione Asincrona Per Il Calcolo Dell'Hash SHA-256
    async generateFileHash(file) {
        // Elementi Interfaccia Utente
        const fileNameDisplay = document.getElementById("fileName");
        // MODIFICATO: file-info -> fileInfo
        const fileInfo = document.getElementById("fileInfo");
        const fileHashDisplay = document.getElementById("fileHash");

        const dropZone = document.getElementById("dropZone");
        // MODIFICATO: upload-state -> uploadState
        const uploadState = document.getElementById("uploadState");
        // MODIFICATO: success-state -> successState
        const successState = document.getElementById("successState");
        const resetBtn = document.getElementById("resetBtn");

        let infoPanel = document.getElementById("infoPanel");
        if (file) {
            // Logica File Caricato Con Successo
            if (uploadState && successState && dropZone) {
                uploadState.classList.add("d-none");
                successState.classList.remove("d-none");
                // MODIFICATO: file-loaded -> fileLoaded (per matchare il CSS)
                dropZone.classList.add("fileLoaded");

                const lastDot = file.name.lastIndexOf('.');
                let fileNameNoExt;

                if (lastDot === -1) {
                    // Caso: File NON Ha Estensione
                    fileNameNoExt = file.name;
                } else {
                    // Caso: File Ha Estensione
                    fileNameNoExt = file.name.substring(0, lastDot);
                }

                // Inserimento Messaggi Nel Pannello Info (Stile Terminale)
                infoPanel.innerHTML = `<p class="text-muted mb-2"> > "${fileNameNoExt}" Caricato</p>`

                const sizeKB = (file.size / 1024).toFixed(2);

                const fileTypeDisplay = document.getElementById("fileType");
                const fileSizeDisplay = document.getElementById("fileSize");

                if (fileTypeDisplay) fileTypeDisplay.textContent = file.type || "Generico";
                if (fileSizeDisplay) fileSizeDisplay.textContent = sizeKB + " KB";

            }

            // Logica Dati: Visualizzazione E Calcolo Hash
            fileNameDisplay.textContent = file.name;
            fileInfo.style.display = "block";
            fileHashDisplay.textContent = "Calcolo In Corso...";

            try {
                const arrayBuffer = await file.arrayBuffer();
                const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

                // Messaggio Di Successo Nel Pannello Info
                infoPanel.innerHTML += `<p class="text-success mb-2"> > Hash SHA-256 Generato Correttamente</p>`;

                fileHashDisplay.textContent = hashHex;
            } catch (error) {
                fileHashDisplay.textContent = "Errore Nel Calcolo Dell'Hash";
                console.error(error);
                infoPanel.innerHTML += `<p class="text-danger mb-2"> > Errore Critico: Impossibile Calcolare Hash</p>`;
            }
        } else {
            return;
        }
    },

    manageFileUpload() {
        // Area Di Rilascio Del File Drag And Drop
        const dropZone = document.getElementById("dropZone");
        // Input Di Tipo File Per Selezione Manuale (Nascosto)
        const fileInput = document.getElementById("fileInput");

        // Gestione Degli Eventi Visivi Di Trascinamento
        if (dropZone) {
            // Eventi Che Indicano Che Un File Viene Trascinato Sull'Area
            ["dragenter", "dragover"].forEach((name) => {
                dropZone.addEventListener(name, (e) => {
                    // Blocca Il Comportamento Predefinito Del Browser
                    e.preventDefault();
                    // Aggiunge Una Classe CSS Per Evidenziare L'Area Di Rilascio
                    // MODIFICATO: drag-over -> dragOver
                    dropZone.classList.add("dragOver");
                });
            });

            // Definisce Gli Eventi In Cui Il File Esce O Viene Rilasciato
            ["dragleave", "drop"].forEach((name) => {
                dropZone.addEventListener(name, (e) => {
                    // Impedisce L'apertura Automatica Del File Nel Browser
                    e.preventDefault();
                    // Rimuove L'Evidenziazione Visiva Dell'Area Di Rilascio
                    // MODIFICATO: drag-over -> dragOver
                    dropZone.classList.remove("dragOver");
                });
            });

            // Cattura L'Evento Di Rilascio Del File Nell'Area Indicata
            dropZone.addEventListener("drop", (e) => {
                // Estrae Il Primo File Trascinato E Lo Passa Alla Funzione Di Calcolo
                this.generateFileHash(e.dataTransfer.files[0]);
            });

            // Gestisce La Selezione Del File Tramite Il Selettore Classico
            fileInput.addEventListener("change", (e) => {
                // Invia Il File Selezionato Manualmente Alla Logica Di Hashing``
                this.generateFileHash(e.target.files[0]);
            });
        }

        // Gestione Tasto Reset
        const resetBtn = document.getElementById("resetBtn");
        if (resetBtn) {
            resetBtn.addEventListener("click", (e) => {
                // Ferma la propagazione per evitare che il click apra il file dialog del dropZone
                e.stopPropagation();
                this.resetInterface();
            });
        }
    },

    resetInterface() {
        const fileInput = document.getElementById("fileInput");
        const fileInfo = document.getElementById("fileInfo");
        const uploadState = document.getElementById("uploadState");
        const successState = document.getElementById("successState");
        const fileNameDisplay = document.getElementById("fileName");
        const dropZone = document.getElementById("dropZone");
        const fileType = document.getElementById("fileType");
        const fileSize = document.getElementById("fileSize");
        const infoPanel = document.getElementById("infoPanel");

        if (fileInput) fileInput.value = "";
        if (fileInfo) fileInfo.style.display = "none";

        if (uploadState) uploadState.classList.remove("d-none");
        if (successState) successState.classList.add("d-none");

        if (fileNameDisplay) fileNameDisplay.textContent = "---";
        if (fileType) fileType.textContent = "---";
        if (fileSize) fileSize.textContent = "---";

        // Rimozione Classi Drop Zone
        if (dropZone) {
            dropZone.classList.remove("dragOver");
            dropZone.classList.remove("fileLoaded");
        }

        // Messaggio Nel Terminale Info Panel
        if (infoPanel) {
            infoPanel.innerHTML = `<p class="text-muted mb-2"> > File Rimosso</p>`;
        }

        console.log("Notarizer: Interfaccia Resettata");
    },

    copyHashToClipboard() {
        // Elemento Dove Mostrare L'Hash Calcolato
        const fileHashDisplay = document.getElementById("fileHash");
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

    renderIdentityStatus() {
        const sbtBadge = document.getElementById('certifiedIdBadge');
        const walletShortDisplay = document.getElementById('walletShort');

        const walletAddress = localStorage.getItem('walletAddress');
        const hasIdentity = localStorage.getItem('identitySBT') === 'true';

        // Gestione visibilità Badge SBT
        if (sbtBadge) {
            if (hasIdentity === true) {
                sbtBadge.style.display = 'block';
            } else {
                sbtBadge.style.display = 'none';
            }
        }

        if (walletShortDisplay && walletAddress) {
            walletShortDisplay.textContent = `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;
        }
    },

    // SS Funzione Per Scrivere L'Hash Sulla Blockchain Tramite Smart Contract
    async writeHashToBlockchain(hashDoc) {
        const infoPanel = document.getElementById("infoPanel");

        try {
            // Stima Gas e Preparazione
            infoPanel.innerHTML += `<p class="text-muted mb-1 small"> > Interazione Con La Blockchain In Corso...</p>`;
            infoPanel.innerHTML += `<p class="text-warning mb-1"> > <strong>Azione Richiesta:</strong> Conferma transazione...</p>`;
            infoPanel.innerHTML += `<p class="text-white mb-1"> > <i class="bi bi-hourglass-split"></i> In Attesa Di Conferma...</p>`;

            const notarizationResult = await Blockchain.notarizeDocument(hashDoc);

            if (notarizationResult.success) {
                infoPanel.innerHTML += `<p class="text-success mb-1"> > Transazione Confermata! Blocco #${notarizationResult.block}</p>`;
                infoPanel.innerHTML += `<p class="text-muted mb-1 small"> > TX ID: ${notarizationResult.txHash.substring(0, 10)}...</p>`;
                infoPanel.innerHTML += `<p class="text-success fw-bold mt-2"> > <i class="bi bi-check-circle-fill"></i> Documento Notarizzato !</p>`;
            }

        } catch (error) {
            console.error("Notarizer: Errore Transazione", error);
            infoPanel.innerHTML += `<p class="text-danger mb-1"> > Errore: Transazione Fallita</p>`;
        }
    },

    // Funzione Per Gestire La Notarizzazione Del File
    handleNotarization() {
        const notarizationForm = document.getElementById("notarizationForm");

        if (notarizationForm) {
            notarizationForm.addEventListener("submit", async (e) => {
                e.preventDefault();

                // Recupera l'hash calcolato dal DOM
                const fileHashDisplay = document.getElementById("fileHash");
                const infoPanel = document.getElementById("infoPanel");
                const hash = fileHashDisplay.textContent;

                // Controllo validità hash
                if (!hash || hash === "Calcolo in corso..." || hash.includes("Errore")) {
                    alert("Carica Un File Valido Prima Di Procedere Con La Notarizzazione.");
                    return;
                }

                // Messaggi Nel Pannello Info
                infoPanel.innerHTML += `<div class="my-2 border-top border-secondary"></div>`;
                infoPanel.innerHTML += `<p class="text-white mb-1"> > Inizializzazione richiesta Smart Contract...</p>`;

                // Chiama La Funzione Per Scrivere L'Hash Sulla Blockchain
                await this.writeHashToBlockchain(hash);

                // SS Interazione Blockchain
                console.log("Notarizer: Richiesta Scrittura Hash Su Smart Contract ->", hash);
            });
        }
    }
};