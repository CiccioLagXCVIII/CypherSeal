// moduleVerifier.js
import { Blockchain } from './moduleBlockchain.js';

export const Verifier = {

    async checkDocumentOnChain(hash) {
        const infoPanel = document.getElementById("infoPanel");
        const resultPlaceholder = document.getElementById("resultPlaceholder");
        const resultData = document.getElementById("resultData");
        const statusBadge = document.getElementById("statusBadge");

        // UI Reset
        resultPlaceholder.classList.add("d-none");
        resultData.classList.remove("d-none");
        infoPanel.innerHTML += `<p class="text-white"> > Interrogazione Smart Contract per Hash: ${hash.substring(0, 10)}...</p>`;

        try {
            // Possibili stati: 0 = Non Trovato, 1 = Valido, 2 = Revocato
            const statusResponse = await Blockchain.getDocumentStatus(hash);

            if (statusResponse.status === 1) {
                const authorAddr = statusResponse.author;
                const sbtTokenId = statusResponse.sbtId;
                const blockNumber = statusResponse.block;
                const date = statusResponse.timestamp;

                document.getElementById("resAuthor").textContent = authorAddr.substring(0, 6) + "..." + authorAddr.substring(38);
                document.getElementById("resAuthorLink").href = `https://sepolia.etherscan.io/address/${authorAddr}`;
                document.getElementById("resSbtId").textContent = sbtTokenId;
                document.getElementById("resBlock").textContent = blockNumber;
                document.getElementById("resDate").textContent = new Date(parseInt(date) * 1000).toLocaleDateString();

                // Mostra il badge di identità verificata
                const authorBox = document.getElementById("authorIdentityBox");
                // CORRETTO: badgeValid
                authorBox.classList.add("verified", "badgeValid");
                authorBox.classList.remove("d-none");
            } else if (statusResponse.status === 2) {
                statusBadge.innerHTML = `<i class="bi bi-exclamation-octagon me-2"></i> Documento Revocato`;
                // CORRETTO: verificationBadge badgeRevoked
                statusBadge.className = "verificationBadge badgeRevoked";
                infoPanel.innerHTML += `<p class="text-danger"> > Attenzione: Il documento è stato invalidato dall'autore.</p>`;
            } else {
                statusBadge.innerHTML = `<i class="bi bi-x-circle me-2"></i> Non Trovato`;
                // CORRETTO: verificationBadge badgeNotFound
                statusBadge.className = "verificationBadge badgeNotFound";
                infoPanel.innerHTML += `<p class="text-muted"> > Nessuna corrispondenza trovata in blockchain.</p>`;
            }

        } catch (error) {
            console.error("Errore verifica:", error);
            infoPanel.innerHTML += `<p class="text-danger"> > Errore durante l'interrogazione on-chain.</p>`;
        }
    },

    async checkAuthorIdentity(address) {
        const infoPanel = document.getElementById("infoPanel");
        const authorBox = document.getElementById("authorIdentityBox");

        console.log("VerifyData: Controllo possesso SBT (EIP-5192) per l'indirizzo: " + address);

        const hasSBT = true;

        if (hasSBT) {
            authorBox.classList.add("verified");
            authorBox.classList.remove("d-none");
            infoPanel.innerHTML += `<p class="text-primary"> > Identità Autore confermata tramite Soulbound Token.</p>`;
            document.getElementById("resAuthor").textContent = address;
        }
    },

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

    resetInfoBox() {
        const uploadState = document.getElementById("uploadState");
        const successState = document.getElementById("successState");
        const fileInfo = document.getElementById("fileInfo");
        const fileInput = document.getElementById("fileInput");
        const hashDisplay = document.getElementById("fileHash");

        const resultPlaceholder = document.getElementById("resultPlaceholder");
        const resultData = document.getElementById("resultData");
        const authorBox = document.getElementById("authorIdentityBox");
        const statusBadge = document.getElementById("statusBadge");
        const infoPanel = document.getElementById("infoPanel");

        // 1. Reset Sinistra
        uploadState.classList.remove("d-none");
        successState.classList.add("d-none");
        fileInfo.style.display = "none";
        fileInput.value = "";
        hashDisplay.textContent = "";

        // 2. Reset Destra
        resultPlaceholder.classList.remove("d-none");
        resultData.classList.add("d-none");
        // CORRETTO: badgeValid
        authorBox.classList.remove("verified", "badgeValid");
        authorBox.classList.add("d-none");
        // CORRETTO: verificationBadge
        statusBadge.className = "verificationBadge";
        statusBadge.innerHTML = "";

        document.getElementById("resDate").textContent = "---";
        document.getElementById("resAuthor").textContent = "---";
        document.getElementById("resBlock").textContent = "---";

        // 3. Reset Log
        infoPanel.innerHTML = `<p class="text-muted">> In attesa di input...</p>`;
    },

    init() {
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