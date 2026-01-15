# 🛡️ VerifyData: Notarizzazione Digitale & Self-Sovereign Identity

> **Proof of Existence, Integrity & Authorship su Ethereum.**

![Project Status](https://img.shields.io/badge/Status-Prototype-blue)
![Network](https://img.shields.io/badge/Network-Sepolia_Testnet-orange)
![License](https://img.shields.io/badge/License-MIT-green)

**VerifyData** è una Decentralized Application (DApp) che sfrutta la blockchain di Ethereum e i **Soulbound Tokens (SBT)** per garantire l'autenticità e l'integrità dei documenti digitali. A differenza dei sistemi tradizionali, offre una soluzione **Privacy-by-Design** dove i file non lasciano mai il dispositivo dell'utente.

---

## 📑 Indice

- [🛡️ VerifyData: Notarizzazione Digitale \& Self-Sovereign Identity](#️-verifydata-notarizzazione-digitale--self-sovereign-identity)
  - [📑 Indice](#-indice)
  - [💡 Introduzione](#-introduzione)
  - [🚀 Funzionalità Chiave](#-funzionalità-chiave)
  - [🔒 Architettura e Sicurezza](#-architettura-e-sicurezza)
    - [Privacy-by-Design](#privacy-by-design)
    - [Self-Sovereign Identity (SSI)](#self-sovereign-identity-ssi)
  - [🛠 Stack Tecnologico](#-stack-tecnologico)
  - [📂 Struttura del Progetto](#-struttura-del-progetto)
  - [⚡ Installazione e Avvio](#-installazione-e-avvio)
    - [Prerequisiti](#prerequisiti)
    - [Passaggi](#passaggi)
  - [📖 Workflow Utente](#-workflow-utente)
  - [🚧 Mocking e Integrazione Backend](#-mocking-e-integrazione-backend)
  - [👤 Autore](#-autore)

---

## 💡 Introduzione

VerifyData democratizza l'accesso alla notarizzazione digitale. Il sistema calcola l'impronta digitale (Hash SHA-256) di un file localmente e la registra sulla blockchain. L'identità dell'autore è garantita da un profilo **SSI (Self-Sovereign Identity)** legato a un token non trasferibile (SBT), rendendo la certificazione professionale e tracciabile.

## 🚀 Funzionalità Chiave

*   **Proof of Integrity:** Garanzia matematica che il documento non è stato alterato (SHA-256).
*   **Proof of Existence:** Timestamp immutabile garantito dal blocco Ethereum.
*   **Identity Badge (SBT):** L'autore è verificato tramite standard EIP-5192 (Soulbound Token).
*   **Privacy Assoluta:** Il documento originale non viene mai caricato su server o IPFS.
*   **Verifica Permissionless:** Portale pubblico per verificare documenti di terze parti.
*   **Gestione Stato:** Possibilità di marcare un documento come "Revocato" (senza cancellarlo dalla history).

---

## 🔒 Architettura e Sicurezza

### Privacy-by-Design
L'applicazione utilizza la **Web Crypto API** del browser. Il processo di hashing avviene client-side:
1.  L'utente seleziona il file.
2.  Il browser calcola l'hash `SHA-256`.
3.  Solo la stringa alfanumerica (hash) viene inviata allo Smart Contract.
4.  **GDPR Compliant:** Nessun dato sensibile lascia il dispositivo.

### Self-Sovereign Identity (SSI)
L'accesso alle funzioni di scrittura è protetto. Solo i wallet che hanno effettuato il "Minting" del Badge SBT possono certificare documenti, prevenendo lo spam e garantendo l'autorevolezza della fonte.

---

## 🛠 Stack Tecnologico

*   **Frontend:** HTML5, CSS3, JavaScript (ES Modules).
*   **UI Framework:** Bootstrap 5 & Bootstrap Icons.
*   **Blockchain Integration:** Ethers.js (Simulazione Mock nel prototipo).
*   **Cryptography:** Native SubtleCrypto API.
*   **Network:** Ethereum Sepolia Testnet (Target).

---

## 📂 Struttura del Progetto

```text
VerifyData/
├── index.html                  # Landing Page
├── connessione.html            # Onboarding Web3
├── profilo.html                # Dashboard E Storico Certificazioni
├── certifica.html              # Hashing E Notarizzazione
├── verifica.html               # Portale Pubblico Di Verifica
├── alertAccessoNegato.html     # Modal Protezione Route
│
├── css/
│   ├── style.css               # Layout E Stile Globale
│   ├── index.css               # Layout E Stile Landing Page
│   ├── profile.css             # Layout E Stile Dashboard
│   ├── certifica.css           # Layout E Stile Pagina Certifica
│   ├── verifica.css            # Layout E Stile Pagina Verifica
│   └── connessione.css         # Layout E Stile Onboarding Web3
│
├── js/
│   ├── app.js                  # Orchestrator principale
│   ├── moduleAuth.js           # Gestione Wallet E Login
│   ├── moduleBlockchain.js     # Connection Layer Con Blockchain
│   ├── moduleGeneral.js        # Logica Di Utility
│   ├── moduleIndex.js          # Logica Homepage
│   ├── moduleNotarizer.js      # Logica Notarizzazione
│   ├── moduleProfile.js        # Logica Aggiornamento Dashboard
│   └── moduleVerifier.js       # Logica Verifica
│
└── Images/                     # Immagini
```

---

## ⚡ Installazione e Avvio

Poiché il progetto utilizza **ES Modules** (`import/export`), non è possibile aprire i file HTML direttamente dal file system (errore CORS). È necessario un server HTTP locale.

### Prerequisiti
*   Un browser moderno (Chrome, Firefox, Brave).
*   Estensione Wallet **MetaMask** installata.
*   VS Code (Consigliato).

### Passaggi

1.  **Clona o Scarica** la repository.
2.  Apri la cartella del progetto nel tuo editor.
3.  **Avvia un Server Locale**:
    *   *Opzione A (VS Code):* Installa l'estensione "Live Server", clicca col tasto destro su `index.html` e seleziona "Open with Live Server".
    *   *Opzione B (Python):* Apri il terminale nella cartella e digita:
        ```bash
        python -m http.server 8000
        ```
    *   *Opzione C (Node):* Usa `http-server` o simili.
4.  Visita `http://localhost:8000/index.html`.

---

## 📖 Workflow Utente

1.  **Connessione:** Clicca su "Connetti Wallet" in alto a destra. Segui il tutorial per configurare MetaMask su rete Sepolia.
2.  **Identità:** Se è il primo accesso, verrai reindirizzato al minting del tuo **Identity Badge (SBT)** nella pagina Profilo.
3.  **Certifica:** Vai su "Certifica Documento". Trascina un file PDF/JPG. Attendi il calcolo dell'hash e conferma la transazione (simulata).
4.  **Gestione:** Nella pagina Profilo, visualizza la tabella dei tuoi documenti. Puoi copiare l'hash o revocare un documento obsoleto.
5.  **Verifica:** Chiunque (anche senza login) può andare su "Verifica Pubblica", caricare un file e controllare se l'hash esiste sulla blockchain e chi lo ha firmato.

---

## 🚧 Mocking e Integrazione Backend

Attualmente, il file `js/moduleBlockchain.js` agisce come un **Mock Service Layer**. Simula le risposte della blockchain (latenza, conferma transazioni, lettura dati) per permettere il test completo dell'interfaccia utente senza spendere Gas reale.

**Per passare in produzione:**
1.  Deployare lo Smart Contract Solidity su Sepolia.
2.  In `moduleBlockchain.js`, sostituire i dati statici con chiamate reali tramite `Ethers.js` o `Web3.js` verso l'indirizzo del contratto deployato.

---

## 👤 Autore

**Francesco Lo Verde**
Università degli Studi di Perugia
*Data Security Project*

---

**Disclaimer:** *Questo software è un prototipo a scopo dimostrativo/accademico. Le chiavi private e la sicurezza reale dipendono dalla configurazione del wallet dell'utente e dallo Smart Contract sottostante.*
