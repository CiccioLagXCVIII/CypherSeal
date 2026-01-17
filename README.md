# 🔏 CypherSeal: Notarizzazione Crittografica & Sovereign Identity

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-Development-orange)
![Blockchain](https://img.shields.io/badge/blockchain-Ethereum%20Sepolia-c0c0c0)

> **The Gold Standard for Immutable Proof of Existence, Integrity & Authorship on Ethereum.**

**CypherSeal** è una Decentralized Application (DApp) avanzata progettata per ridefinire gli standard di fiducia digitale. Fondendo la certezza matematica della crittografia asimmetrica con i paradigmi della **Self-Sovereign Identity (SSI)**, il progetto offre un servizio di notarizzazione sicuro, trasparente e resistente alla censura.

A differenza dei sistemi tradizionali, CypherSeal lega ogni operazione a un **CypherSoul (CYID)**: un Soulbound Token (SBT) conforme allo standard **EIP-5192** che funge da passaporto reputazionale on-chain.

---

## 📑 Indice

- [🔏 CypherSeal: Notarizzazione Crittografica \& Sovereign Identity](#-cypherseal-notarizzazione-crittografica--sovereign-identity)
  - [📑 Indice](#-indice)
  - [💡 Value Proposition](#-value-proposition)
  - [🛡️ Ecosistema CypherSoul (CYID)](#️-ecosistema-cyphersoul-cyid)
  - [🔒 Architettura e Privacy](#-architettura-e-privacy)
    - [1. Client-Side Hashing (GDPR Compliant)](#1-client-side-hashing-gdpr-compliant)
    - [2. Dual Contract Architecture](#2-dual-contract-architecture)
  - [🛠 Stack Tecnologico](#-stack-tecnologico)
  - [📂 Struttura del Progetto](#-struttura-del-progetto)
  - [⚡ Quick Start](#-quick-start)
    - [Prerequisiti](#prerequisiti)
    - [Installazione](#installazione)
  - [⚠️ Nota: Modalità Simulazione](#️-nota-modalità-simulazione)
  - [👤 Autore](#-autore)

---

## 💡 Value Proposition

| Feature                | Descrizione                                                                                    |
| :--------------------- | :--------------------------------------------------------------------------------------------- |
| **Proof of Integrity** | Validazione SHA-256. Un singolo bit alterato invalida matematicamente il certificato.          |
| **Proof of Existence** | Timestamp immutabile garantito dalla block height di Ethereum.                                 |
| **Sovereign Identity** | L'autore non è un indirizzo anonimo, ma un'entità verificata tramite Soulbound Token.          |
| **Zero-Knowledge**     | Il file originale non lascia mai il dispositivo dell'utente. Solo l'hash viene notarizzato.    |
| **Revoca Logica**      | Gestione del ciclo di vita del documento (valido/revocato) senza alterare lo storico on-chain. |

---

## 🛡️ Ecosistema CypherSoul (CYID)

Il cuore della piattaforma è il token **CypherSoul (CYID)**, implementato tramite Smart Contract dedicato.

- **Standard:** EIP-5192 (Minimal Soulbound Interface).
- **Non-Transferable:** Il token è legato indissolubilmente al wallet (Soul) che lo ha mintato.
- **Gatekeeping:** Lo Smart Contract di notarizzazione verifica il possesso del CYID prima di accettare qualsiasi hash, creando una *Web of Trust* resistente allo spam.

---

## 🔒 Architettura e Privacy

### 1. Client-Side Hashing (GDPR Compliant)

CypherSeal utilizza le **Web Crypto API** native del browser.

1. L'utente seleziona il file.
2. L'engine calcola l'hash `SHA-256` localmente.
3. **Solo la stringa alfanumerica (Hash)** viene inviata alla blockchain. Il documento originale non viene mai caricato su server o IPFS.

### 2. Dual Contract Architecture

Il backend (in fase di sviluppo su testnet Sepolia) si basa su due contratti interconnessi:

- **`IdentityContract.sol`**: Gestisce il minting e lo stato dei badge SBT.
- **`NotarizerContract.sol`**: Gestisce il registro degli hash, interrogando l'IdentityContract per autorizzare le transazioni.

---

## 🛠 Stack Tecnologico

- **Frontend Engine**: HTML5 Semantico, CSS3 (Variabili & Flexbox), Bootstrap 5.
- **Logic**: JavaScript ES6 Modules (Architettura Modulare).
- **Web3 Integration**: Ethers.js (Predisposto).
- **Security**: `crypto.subtle` (SHA-256).
- **Smart Contracts**: Solidity (EIP-5192).

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
├── contract/
│   ├── identityContract.sol    # Smart Contract Token SBT
│   └── notarizerContract.sol   # Smart Contract Notarization (Work In Progress)
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

## ⚡ Quick Start

### Prerequisiti

- Un browser moderno (Chrome/Brave/Firefox).

- Estensione **MetaMask** installata.
- Un server locale (es. Live Server per VSCode) per supportare i moduli ES6.

### Installazione

1. **Clona la repository:**

    ```bash
    git clone https://github.com/TuoUsername/CypherSeal.git
    cd CypherSeal
    ```

2. **Avvia il server locale:**
    Se utilizzi Visual Studio Code, installa l'estensione *Live Server*, clicca col tasto destro su `index.html` e seleziona **"Open with Live Server"**.

    In alternativa con Python:

    ```bash
    python -m http.server 8000
    ```

3. Visita `http://localhost:8000` nel browser.

---

## ⚠️ Nota: Modalità Simulazione

Attualmente, il layer di comunicazione blockchain (`js/moduleBlockchain.js`) è configurato in **Simulation Mode**.

- L'interfaccia risponde come se fosse connessa alla **Sepolia Testnet**.
- Le transazioni, le gas fee e le conferme dei blocchi sono simulate con latenze realistiche per dimostrare la UX finale senza richiedere ETH reali per la valutazione.
- **Ready-to-Deploy:** Il codice è strutturato per passare alla Mainnet iniettando le istanze reali di `ethers.Contract` e gli ABI dei contratti presenti nella cartella `contracts/`.

---

## 👤 Autore

**Francesco Lo Verde**

*Università degli Studi di Perugia*

*Progetto di Data Security & Blockchain*
