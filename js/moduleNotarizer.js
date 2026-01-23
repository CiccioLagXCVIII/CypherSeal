// moduleNotarizer.js
import { Blockchain } from './moduleBlockchain.js';
import { General } from './moduleGeneral.js';

export const Notarizer = {

    // Funzione Per Generare L'Hash Del File Caricato
    async generateFileHash(file) {
        const fileNameDisplay = document.getElementById("fileName");
        const fileInfo = document.getElementById("fileInfo");
        const fileHashDisplay = document.getElementById("fileHash");
        const dropZone = document.getElementById("dropZone");
        const uploadState = document.getElementById("uploadState");
        const successState = document.getElementById("successState");
        const notarizeBtn = document.getElementById("notarizeButton");

        // Recupero Valore Gas Stimato
        const estimatedGasDisplay = document.getElementById("estimatedGas");

        let infoPanel = document.getElementById("infoPanel");

        if (file) {
            if (uploadState && successState && dropZone) {
                uploadState.classList.add("d-none");
                successState.classList.remove("d-none");
                dropZone.classList.add("fileLoaded");

                const lastDot = file.name.lastIndexOf('.');
                let fileNameNoExt = lastDot === -1 ? file.name : file.name.substring(0, lastDot);

                if (infoPanel) {
                    infoPanel.innerHTML = `<p class="text-muted mb-2"> > "${fileNameNoExt}" Caricato</p>`;
                    infoPanel.scrollTop = infoPanel.scrollHeight;
                }

                const sizeKB = (file.size / 1024).toFixed(2);
                const fileTypeDisplay = document.getElementById("fileType");
                const fileSizeDisplay = document.getElementById("fileSize");

                if (fileTypeDisplay) fileTypeDisplay.textContent = file.type || "Generico";
                if (fileSizeDisplay) fileSizeDisplay.textContent = sizeKB + " KB";
            }


            fileNameDisplay.textContent = file.name;
            fileInfo.style.display = "block";
            fileHashDisplay.textContent = "Calcolo In Corso...";

            // Pulisco il gas precedente per evitare confusione
            if (estimatedGasDisplay) {
                estimatedGasDisplay.textContent = "Calcolo...";
                estimatedGasDisplay.classList.remove('text-warning', 'text-success'); // Rimuovo colori vecchi
            }

            try {
                const arrayBuffer = await file.arrayBuffer();
                const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

                if (infoPanel) {
                    infoPanel.innerHTML += `<p class="text-success mb-2"> > Hash SHA-256 Generato Correttamente</p>`;
                    infoPanel.scrollTop = infoPanel.scrollHeight;
                }
                fileHashDisplay.textContent = hashHex;

                // Stima Gas
                const estimatedGasETH = await Blockchain.estimateGasForNotarization(hashHex);

                if (estimatedGasETH === "ALREADY_EXISTS") {
                    // Documento Già Notarizzato
                    if (infoPanel) {
                        infoPanel.innerHTML += `<p class="text-warning mb-2 fw-bold"> > Attenzione: Il Documento Risulta Già Notarizzato!</p>`;
                        infoPanel.scrollTop = infoPanel.scrollHeight;
                    }
                    if (estimatedGasDisplay) {
                        estimatedGasDisplay.textContent = "Esistente";
                        estimatedGasDisplay.classList.add('text-warning');
                    }
                    if (notarizeBtn) {
                        notarizeBtn.disabled = true;
                        notarizeBtn.textContent = "Già Notarizzato";
                        notarizeBtn.classList.add("btn-secondary");
                        notarizeBtn.classList.remove("btnCypherSeal");
                    }
                } else if (estimatedGasETH === "NO_SBT") {
                    // Utente Senza SBT
                    if (infoPanel) {
                        infoPanel.innerHTML += `<p class="text-danger mb-2 fw-bold"> > Attenzione: Devi Possedere Un SBT Per Notarizzare Documenti.</p>`;
                        infoPanel.scrollTop = infoPanel.scrollHeight;
                    }

                    if (estimatedGasDisplay) {
                        estimatedGasDisplay.textContent = "NO SBT";
                        estimatedGasDisplay.classList.add('text-danger');
                    }

                    if (notarizeBtn) {
                        notarizeBtn.disabled = true;
                        notarizeBtn.textContent = "Necessario SBT";
                        notarizeBtn.classList.add("btn-secondary");
                        notarizeBtn.classList.remove("btnCypherSeal");
                    }

                } else if (estimatedGasETH && estimatedGasETH !== "Error" && estimatedGasETH !== "!!") {
                    // Stima Riuscita

                    // infoPanel.innerHTML += `<p class="text-info mb-2"> > Costo Stimato Notarizzazione: ~${estimatedGasETH} ETH</p>`;
                    // infoPanel.scrollTop = infoPanel.scrollHeight;

                    if (estimatedGasDisplay) {
                        estimatedGasDisplay.textContent = `~ ${estimatedGasETH} ETH`;
                        estimatedGasDisplay.classList.add('text-info');
                    }

                    // Riabilitato Pulsante Notarizzazione
                    if (notarizeBtn) {
                        notarizeBtn.disabled = false;
                        notarizeBtn.textContent = "Notarizza Documento";
                        notarizeBtn.classList.add("btnCypherSeal");
                        notarizeBtn.classList.remove("btn-secondary");
                    }
                } else {
                    // Gestione Errore Generico Stima
                    if (estimatedGasDisplay) estimatedGasDisplay.textContent = "N/A";
                }

            } catch (error) {
                fileHashDisplay.textContent = "Errore Nel Calcolo Dell'Hash";
                if (estimatedGasDisplay) {
                    estimatedGasDisplay.textContent = "Err";
                    console.error(error);
                    if (infoPanel) {
                        infoPanel.innerHTML += `<p class="text-danger mb-2"> > Errore Critico: Impossibile Calcolare Hash</p>`;
                        infoPanel.scrollTop = infoPanel.scrollHeight;
                    }
                }
            }
        }
    },

    // Funzione Per Gestire Il Caricamento Dei File Tramite Drag & Drop O Selezione
    manageFileUpload() {
        const dropZone = document.getElementById("dropZone");
        const fileInput = document.getElementById("fileInput");

        if (dropZone) {
            ["dragenter", "dragover"].forEach((name) => {
                dropZone.addEventListener(name, (e) => {
                    e.preventDefault();
                    dropZone.classList.add("dragOver");
                });
            });

            ["dragleave", "drop"].forEach((name) => {
                dropZone.addEventListener(name, (e) => {
                    e.preventDefault();
                    dropZone.classList.remove("dragOver");
                });
            });

            dropZone.addEventListener("drop", (e) => {
                this.generateFileHash(e.dataTransfer.files[0]);
            });

            fileInput.addEventListener("change", (e) => {
                this.generateFileHash(e.target.files[0]);
            });
        }

        const resetBtn = document.getElementById("resetBtn");
        if (resetBtn) {
            resetBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                this.resetInterface();
            });
        }
    },

    // Funzione Per Resettare L'Interfaccia Grafica
    resetInterface(keepLogs = false) {
        // Recupero Elementi Interfaccia Grafica
        const fileInput = document.getElementById("fileInput");
        const fileInfo = document.getElementById("fileInfo");
        const uploadState = document.getElementById("uploadState");
        const successState = document.getElementById("successState");
        const fileNameDisplay = document.getElementById("fileName");
        const dropZone = document.getElementById("dropZone");
        const fileType = document.getElementById("fileType");
        const fileSize = document.getElementById("fileSize");
        const infoPanel = document.getElementById("infoPanel");
        const notarizeBtn = document.getElementById("notarizeButton");
        const estimatedGasDisplay = document.getElementById("estimatedGas");

        if (fileInput) {
            fileInput.value = "";
        }
        if (fileInfo) {
            fileInfo.style.display = "none";
        }

        if (uploadState) {
            uploadState.classList.remove("d-none");
        }
        if (successState) {
            successState.classList.add("d-none");
        }

        if (fileNameDisplay) {
            fileNameDisplay.textContent = "---";
        }
        if (fileType) {
            fileType.textContent = "---";
        }
        if (fileSize) {
            fileSize.textContent = "---";
        }

        // Reset Valore Gas
        if (estimatedGasDisplay) {
            estimatedGasDisplay.textContent = "---";
            estimatedGasDisplay.classList.remove('text-warning', 'text-success', 'text-danger', 'text-info');
        }

        if (dropZone) {
            dropZone.classList.remove("dragOver");
            dropZone.classList.remove("fileLoaded");
        }

        // Se keepLogs È true Mantiene I Log, Altrimenti Resetta
        if (infoPanel && !keepLogs) {
            infoPanel.innerHTML = `<p class="text-muted mb-2"> > File Rimosso</p>`;
            infoPanel.scrollTop = infoPanel.scrollHeight;
        }

        if (notarizeBtn) {
            notarizeBtn.disabled = false;
            notarizeBtn.textContent = "Notarizza Documento";
            notarizeBtn.classList.add("btnCypherSeal");
            notarizeBtn.classList.remove("btn-secondary");
        }

        console.log("moduleNotarizer: Interfaccia Resettata (Logs mantenuti: " + keepLogs + ")");
    },

    // Funzione Per Copiare L'Hash Negli Appunti
    copyHashToClipboard() {
        const fileHashDisplay = document.getElementById("fileHash");
        const copyBtn = document.getElementById("copyAddressBtn");

        if (copyBtn) {
            copyBtn.addEventListener("click", () => {
                const text = fileHashDisplay.textContent;
                if (text && text !== "Calcolo in corso...") {
                    navigator.clipboard.writeText(text);
                    const toast = document.getElementById("copyToast");
                    toast.classList.add("show");
                    setTimeout(() => toast.classList.remove("show"), 2000);
                }
            });
        }
    },

    // Funzione Per Aggiornare Lo Stato Dello SBT E L'Address Visualizzato
    async renderIdentityStatus() {
        const sbtBadge = document.getElementById('certifiedIdBadge');
        const walletShortDisplay = document.getElementById('walletShort');
        const walletAddress = localStorage.getItem('walletAddress');

        const hasIdentity = await Blockchain.getSBTStatus(walletAddress);

        if (sbtBadge) {
            sbtBadge.style.display = hasIdentity === true ? 'block' : 'none';
        }

        if (walletShortDisplay && walletAddress) {
            walletShortDisplay.textContent = `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;
        }
    },

    // Funzione Per Scrivere L'Hash Del Documento Sulla Blockchain
    async writeHashToBlockchain(hashDoc) {
        const infoPanel = document.getElementById("infoPanel");

        try {
            if (infoPanel) {
                infoPanel.innerHTML += `<p class="text-muted mb-1 small"> > Interazione Con La Blockchain In Corso...</p>`;
                infoPanel.scrollTop = infoPanel.scrollHeight;
                infoPanel.innerHTML += `<p class="text-warning mb-1"> > <strong>Azione Richiesta:</strong> Conferma transazione...</p>`;
                infoPanel.scrollTop = infoPanel.scrollHeight;
                infoPanel.innerHTML += `<p class="text-white mb-1"> > <i class="bi bi-hourglass-split"></i> In Attesa Di Conferma...</p>`;
                infoPanel.scrollTop = infoPanel.scrollHeight;
            }
            const notarizationResult = await Blockchain.notarizeDocument(hashDoc);

            if (notarizationResult && notarizationResult.txHash) {
                // Notarizzazione Avvenuta Con Successo
                if (infoPanel) {
                    infoPanel.innerHTML += `<p class="text-success mb-1"> > Transazione Confermata! Blocco #${notarizationResult.block}</p>`;
                    infoPanel.scrollTop = infoPanel.scrollHeight;
                    infoPanel.innerHTML += `<p class="text-muted mb-1 small"> > TX ID: ${notarizationResult.txHash.substring(0, 10)}...</p>`;
                    infoPanel.scrollTop = infoPanel.scrollHeight;
                    infoPanel.innerHTML += `<p class="text-success fw-bold mt-2"> > <i class="bi bi-check-circle-fill"></i> Documento Notarizzato !</p>`;
                    infoPanel.scrollTop = infoPanel.scrollHeight;
                }

                // Reset Automatico Dopo 5 Secondi
                setTimeout(() => {
                    // Si Usa resetInterface con true Per Non Cancellare I Log
                    this.resetInterface(true);
                    if (infoPanel) {
                        // Riga Che Dice Che È Pronto Per Nuova Notarizzazione
                        infoPanel.innerHTML += `<div class="my-3 border-top border-secondary opacity-25"></div>`;
                        infoPanel.innerHTML += `<p class="text-primary mb-1"> > Sistema Pronto Per Una Nuova Notarizzazione</p>`;
                        infoPanel.scrollTop = infoPanel.scrollHeight;
                    }
                }, 5000); // 5000 millisecondi = 5 secondi

            } else {
                // Errore Logico (success: false)

                // Estrazione Messaggio Dettagliato
                const errorMsg = notarizationResult.error || "Nessun dettaglio disponibile";

                // Visualizza Dettagli Errore in Console
                console.error("moduleNotarizer [Logic Error]: Notarizzazione Fallita.", errorMsg);

                if (infoPanel) {
                    // Visualizza Messaggio Interfaccia Utente
                    infoPanel.innerHTML += `<p class="text-danger mb-1"> > Attenzione: Impossibile Completare La Notarizzazione.</p>`;
                    infoPanel.scrollTop = infoPanel.scrollHeight;
                }
            }

        } catch (error) {
            // Eccezione (Crash, Problema Di Rete, Utente Chiude Metamask)

            // Visualizza Dettagli Errore in Console
            console.error("moduleNotarizer [Critical Error]: Eccezione Durante La Transazione.", error);

            if (infoPanel) {
                // Visualizza Messaggio Interfaccia Utente
                infoPanel.innerHTML += `<p class="text-danger mb-1"> > Errore Critico: Transazione Annullata O Interrotta.</p>`;
                infoPanel.scrollTop = infoPanel.scrollHeight;
            }
        }
    },

    // Funzione Per Gestire La Notarizzazione Al Submit Del Form
    handleNotarization() {
        const notarizationForm = document.getElementById("notarizationForm");

        if (notarizationForm) {
            notarizationForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const fileHashDisplay = document.getElementById("fileHash");
                const infoPanel = document.getElementById("infoPanel");
                const hash = fileHashDisplay.textContent;

                if (!hash || hash === "Calcolo In Corso..." || hash.includes("Errore")) {
                    await General.showCustomAlert(
                        "È Necessario Trascinare O Selezionare Un File Valido Prima Di Procedere Con La Notarizzazione",
                        "File Mancante",
                        "bi-file-earmark-x-fill"
                    );
                    return;
                }
                if (infoPanel) {
                    infoPanel.innerHTML += `<div class="my-2 border-top border-secondary"></div>`;
                    infoPanel.scrollTop = infoPanel.scrollHeight;
                    infoPanel.innerHTML += `<p class="text-white mb-1"> > Inizializzazione richiesta Smart Contract...</p>`;
                    infoPanel.scrollTop = infoPanel.scrollHeight;
                }

                await this.writeHashToBlockchain(hash);
                console.log("moduleNotarizer: Richiesta Scrittura Hash Su Smart Contract ->", hash);
            });
        }
    }
};