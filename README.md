# 🔏 CypherSeal: Trustless Digital Notarization & SSI Protocol

![Version](https://img.shields.io/badge/version-2.0.0-blue?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Status](https://img.shields.io/badge/status-Architectural%20Prototype-orange?style=flat-square)
![Network](https://img.shields.io/badge/network-Ethereum%20Sepolia-c0c0c0?style=flat-square&logo=ethereum)
![Standard](https://img.shields.io/badge/standard-EIP--5192%20(SBT)-red?style=flat-square)

> **Ridefinire la fiducia digitale attraverso la crittografia asimmetrica e l'identità sovrana.**

**CypherSeal** è una Decentralized Application (DApp) *Privacy-by-Design* che permette la notarizzazione immutabile di documenti su blockchain Ethereum.
Il progetto supera i limiti dei notai digitali tradizionali integrando il paradigma della **Self-Sovereign Identity (SSI)**: l'autore di un documento non è un semplice indirizzo esadecimale anonimo, ma un'entità verificata attraverso il possesso di un **Soulbound Token (SBT)**.

---

## 📑 Indice

- [🔏 CypherSeal: Trustless Digital Notarization \& SSI Protocol](#-cypherseal-trustless-digital-notarization--ssi-protocol)
  - [📑 Indice](#-indice)
  - [💡 Visione e Architettura](#-visione-e-architettura)
    - [Gestione del Ciclo di Vita (Revoca)](#gestione-del-ciclo-di-vita-revoca)
  - [🛡️ CypherSoul: Il Modello di Identità (EIP-5192)](#️-cyphersoul-il-modello-di-identità-eip-5192)
  - [🔒 Privacy \& Sicurezza (GDPR)](#-privacy--sicurezza-gdpr)
  - [🛠 Stack Tecnologico](#-stack-tecnologico)
  - [📂 Struttura della Repository](#-struttura-della-repository)
  - [⚡ Installazione e Avvio](#-installazione-e-avvio)
  - [⚠️ Nota Tecnica: Simulation Mode](#️-nota-tecnica-simulation-mode)
  - [👤 Autore e Riferimenti](#-autore-e-riferimenti)

---

## 💡 Visione e Architettura

CypherSeal orchestra un flusso di lavoro che garantisce tre proprietà fondamentali per la forensica digitale:

1. **Proof of Integrity:** Utilizzando l'algoritmo **SHA-256**, viene generata un'impronta digitale univoca. La modifica di un singolo bit del file originale altera radicalmente l'hash (Effetto Avalanche), rendendo evidente qualsiasi manomissione.
2. **Proof of Existence:** La registrazione dell'hash in un blocco Ethereum fornisce una data certa (Timestamp) inoppugnabile e resistente alla censura.
3. **Proof of Authorship (Anti-Sybil):** Grazie all'implementazione di uno Smart Contract di *Gatekeeping*, solo gli utenti in possesso del badge identitario possono notarizzare documenti, prevenendo spam e garantendo la tracciabilità.

### Gestione del Ciclo di Vita (Revoca)

A differenza dei database tradizionali, la blockchain è *append-only*. CypherSeal implementa una logica di **Revoca Semantica**: l'autore può invalidare un documento precedentemente emesso aggiornando lo stato dello Smart Contract. Il documento rimane nello storico, ma viene marcato pubblicamente come "Revocato".

---

## 🛡️ CypherSoul: Il Modello di Identità (EIP-5192)

Il sistema si basa su una **Dual Contract Architecture**:

1. **Identity Contract (`CypherSoul`)**:
    - Implementa lo standard **EIP-5192** (Minimal Soulbound Interface).
    - Il token (CYID) è **non trasferibile**: una volta mintato, è legato indissolubilmente al wallet dell'utente ("Soul").
    - Funge da passaporto reputazionale on-chain.

2. **Notarizer Contract (`CypherSealNotarizer`)**:
    - Agisce come registro degli hash.
    - Prima di accettare una transazione di notarizzazione, interroga l'*Identity Contract* (`hasValidIdentity`) per verificare l'autorizzazione del mittente.

---

## 🔒 Privacy & Sicurezza (GDPR)

CypherSeal adotta un approccio **Zero-Knowledge** rigoroso per garantire la conformità al GDPR e la tutela dei dati sensibili.

- **Client-Side Hashing:** Il calcolo dell'hash SHA-256 avviene localmente nel browser dell'utente tramite le **Web Crypto API**.
- **Data Isolation:** Il documento originale (PDF, Immagine, DOCX) **non lascia mai il dispositivo dell'utente**. Non viene mai caricato su server centralizzati, IPFS o blockchain.
- **Public Ledger:** Sulla blockchain viene registrata esclusivamente la stringa alfanumerica dell'hash, dalla quale è matematicamente impossibile risalire al contenuto originale (One-Way Function).

---

## 🛠 Stack Tecnologico

Il progetto è costruito seguendo i moderni standard di sviluppo Web3:

| Layer            | Tecnologia       | Dettagli                                                              |
| :--------------- | :--------------- | :-------------------------------------------------------------------- |
| **Frontend**     | HTML5 / CSS3     | Design system personalizzato con variabili CSS e Dark Mode.           |
| **Framework**    | Bootstrap 5      | Layout responsivo e componenti modali.                                |
| **Logic**        | JavaScript ES6   | Architettura modulare nativa (import/export) senza bundler complessi. |
| **Cryptography** | Web Crypto API   | `crypto.subtle.digest('SHA-256')` per hashing ad alte prestazioni.    |
| **Blockchain**   | Solidity ^0.8.27 | Smart Contracts ottimizzati per gas (Events vs Storage).              |
| **Library**      | Ethers.js        | Interazione RPC con i nodi Ethereum (Predisposto).                    |

---

## 📂 Struttura della Repository

```text
CypherSeal/
├── index.html                  # Landing Page
├── connessione.html            # Onboarding Web3
├── profilo.html                # Dashboard E Storico Certificazioni
├── certifica.html              # Hashing E Notarizzazione
├── verifica.html               # Portale Pubblico Di Verifica
├── alertAccessoNegato.html     # Modal Protezione Route
├── package.json                # Dipendenze Del Progetto
├── package-lock.json           # Lockfile Delle Dipendenze
├── README.md                   # Documentazione Principale
│
├── artifacts/                  # File Generati Dal Compilatore/Deployer
│
├── contracts/
│   ├── identityContract.sol    # Smart Contract Token SBT (CypherSoul)
│   ├── notarizerContract.sol   # Smart Contract Notarization (CypherSealNotarizer)
│   ├── CypherSealNotarizerMetadata.json # Metadati Contratto Notarizer
│   └── CypherSoulMetadata.json # Metadati Contratto SBT
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
│   ├── configContracts.js      # Configurazioni Indirizzi ABI Smart Contract
│   ├── moduleAuth.js           # Gestione Wallet E Login
│   ├── moduleBlockchain.js     # Connection Layer Con Blockchain
│   ├── moduleGeneral.js        # Logica Di Utility
│   ├── moduleIndex.js          # Logica Homepage
│   ├── moduleNotarizer.js      # Logica Notarizzazione
│   ├── moduleProfile.js        # Logica Aggiornamento Dashboard
│   └── moduleVerifier.js       # Logica Verifica
│
├── Images/                     # Immagini
│
└── markdown/                   # Note E Appunti
    ├── Appunti.md
    ├── ToDo.md
    └── appuntiSolidity.md
```

---

## ⚡ Installazione e Avvio

Poiché il progetto utilizza **Moduli ES6** (`type="module"`), è necessario servire i file tramite protocollo HTTP(s) e non direttamente dal file system (`file://`).

1. **Clona la repository:**

    ```bash
    git clone https://github.com/TuoUsername/CypherSeal.git
    cd CypherSeal
    ```

2. **Avvia un Server Locale:**
    - **VS Code:** Installa l'estensione *Live Server*, tasto destro su `index.html` → "Open with Live Server".
    - **Python:**

        ```bash
        python -m http.server 8000
        ```

    - **Node.js:**

        ```bash
        npx http-server .
        ```

3. **Accesso:**
    Apri il browser all'indirizzo `http://localhost:8000`. Assicurati di avere un wallet Web3 (es. MetaMask) installato per l'esperienza completa.

---

## ⚠️ Nota Tecnica: Simulation Mode

Attualmente, il file `js/moduleBlockchain.js` opera in modalità **Mock/Simulazione**.

- **Scopo:** Dimostrare il flusso UX completo (Firma, Attesa Blocco, Conferma, Revoca) e la logica di frontend senza necessitare di ETH su Testnet per la valutazione.
- **Comportamento:** Il modulo intercetta le chiamate e restituisce promise asincrone che simulano latenza di rete e generano hash di transazione realistici.
- **Production Ready:** L'architettura è progettata per il passaggio in produzione ("Mainnet Switch"). È sufficiente sostituire i metodi mockati con le chiamate `ethers.Contract` utilizzando gli ABI generati dai contratti presenti nella cartella `contract/`.

---

## 👤 Autore e Riferimenti

**Francesco Lo Verde**
*Università degli Studi di Perugia*
Progetto di *Data Security & Blockchain Technology*

---
*CypherSeal © 2026 - All Rights Reserved*
