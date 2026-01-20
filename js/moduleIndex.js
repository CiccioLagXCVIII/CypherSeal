// moduleIndex.js
const definitions = {
    integrity: {
        title: "Integrità del Dato",
        content: "L'integrità garantisce che il documento non abbia subito alcuna modifica dalla sua registrazione.\n\nAttraverso l'algoritmo SHA-256, viene calcolata un'impronta digitale unica (Hash). Anche la modifica di un solo bit nel file originale genera un Hash completamente diverso (il cosiddetto \"Effetto Valanga\"), rendendo immediatamente evidente e matematicamente provabile qualsiasi tentativo di manomissione o corruzione del file."
    },
    sbt: {
        title: "Soulbound Token (SBT)",
        content: "I Soulbound Tokens sono token digitali non trasferibili che rappresentano l'identità o le qualifiche di una persona sulla blockchain.\n\nA differenza degli NFT tradizionali, un SBT non può essere venduto o spostato: rimane legato indissolubilmente al wallet che lo ha ricevuto (il \"Soul\"). Questo meccanismo permette di creare una reputazione digitale verificabile, certificando che chi sta notarizzando un documento è un utente reale e accreditato."
    },
    ssi: {
        title: "Self-Sovereign Identity (SSI)",
        content: "La Self-Sovereign Identity è un modello che restituisce all'individuo il pieno controllo sui propri dati personali.\n\nInvece di dipendere da giganti tecnologici (come Google o Facebook) che gestiscono e monetizzano l'identità degli utenti, con la SSI l'utente custodisce le proprie credenziali direttamente nel proprio wallet. Questo permette di accedere ai servizi in modo sicuro, decidendo autonomamente quali dati condividere e con chi, senza intermediari centralizzati."
    },
    immutability: {
        title: "Immutabilità",
        content: "È la caratteristica fondamentale della tecnologia Blockchain. Una volta che la notarizzazione di un documento viene confermata e inserita in un blocco, diventa tecnicamente impossibile modificarla, cancellarla o alterarne la data.\n\nQuesto crea un registro storico eterno e resistente alla censura, fornendo una prova d'esistenza opponibile a terzi che durerà fintanto che esisterà la rete Ethereum."
    },
    gas: {
        title: "Gas Fees",
        content: "Le \"Gas Fees\" sono le commissioni necessarie per eseguire operazioni sulla rete Ethereum.\n\nRappresentano il \"carburante\" pagato ai validatori della rete per compensare la potenza di calcolo necessaria a elaborare la transazione e registrare l'hash del tuo documento in modo sicuro nel registro distribuito. Su CypherSeal (Testnet), questo costo è simulato e gratuito tramite i Faucet."
    },
    contract: {
        title: "Smart Contract",
        content: "Uno Smart Contract è un protocollo informatico che esegue automaticamente le azioni quando si verificano determinate condizioni, agendo come un \"Notaio Robotico\".\n\nNel contesto di CypherSeal, lo Smart Contract riceve l'hash del file, verifica che il mittente possieda un'identità SBT valida e registra in modo autonomo e imparziale l'impronta digitale e il timestamp sulla blockchain, senza bisogno di fiducia in terze parti umane."
    },
    revocation: {
        title: "Revoca del Documento",
        content: "Data l'immutabilità della blockchain, un documento non può mai essere \"cancellato\" fisicamente dal registro.\n\nLa revoca è quindi un aggiornamento di stato logico: l'autore originale invia una nuova transazione allo Smart Contract per segnalare pubblicamente che quel documento, pur esistendo, non è più considerato valido o è stato sostituito da una versione più recente. Il registro mostrerà quindi l'hash barrato o marcato come \"Revocato\"."
    },
    privacy: {
        title: "Privacy & Zero-Knowledge",
        content: "CypherSeal adotta un approccio \"Privacy-by-Design\". Il calcolo dell'impronta digitale (Hash) avviene localmente nel tuo browser.\n\nIl documento originale non viene mai caricato in rete né salvato su server esterni. Sulla blockchain viene registrata solo la stringa alfanumerica dell'hash: da essa è matematicamente impossibile risalire al contenuto del file (testi, immagini o dati sensibili), garantendo così la totale conformità al GDPR."
    }
};

export const HomeManager = {
    init() {
        this.setupModal();
        this.setupAvalanche();
        this.setupStartButton();
    },

    setupModal() {
        const infoBtns = document.querySelectorAll(".info-btn");
        const modalElement = document.getElementById("infoModal");
        const mainContent = document.querySelector(".content-area");
        const modal = new bootstrap.Modal(modalElement);
        const modalTitle = document.getElementById("infoModalLabel");
        const modalBody = document.getElementById("infoModalBody");

        // Funzione Per Allineare Modale Al Main Content
        const alignModalToMain = () => {
            if (mainContent && modalElement) {
                // Calcola Posizione E Dimensioni
                const rect = mainContent.getBoundingClientRect();

                // Applica Dimensioni Al Modal
                modalElement.style.left = `${rect.left}px`;
                modalElement.style.width = `${rect.width}px`;
            }
        };

        infoBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                // 1. Popolamento Dati
                const key = btn.getAttribute("dataDef");
                const data = definitions[key] || {
                    title: "Info",
                    content: "Dettagli In Arrivo...",
                };

                modalTitle.textContent = data.title;
                modalBody.textContent = data.content;

                // Posizionamento Dinamico
                alignModalToMain();

                // Mostra Modal
                modal.show();
            });
        });

        // Listener Per Il Ridimensionamento Della Finestra
        // Se L'Utente Ridimensiona La Finestra Con Il Modal Aperto Ricalcola
        window.addEventListener('resize', () => {
            if (modalElement.classList.contains('show')) {
                alignModalToMain();
            }
        });
    },

    async setupAvalanche() {
        const input = document.getElementById("avalancheInput");
        const output = document.getElementById("avalancheOutput");

        if (!input || !output) return;

        // Funzione interna per calcolare l'hash
        const updateHash = async (text) => {
            const msgBuffer = new TextEncoder().encode(text);
            const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
            output.textContent = hashHex;
        };

        // Esegui il calcolo al caricamento (per la stringa vuota)
        updateHash("");

        // Esegui il calcolo ogni volta che l'utente scrive
        input.addEventListener("input", (e) => {
            updateHash(e.target.value);
        });
    },

    setupStartButton() {
        const startBtn = document.getElementById('btnStartCertify');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                window.location.href = 'certifica.html';
            });
        }
    }
};