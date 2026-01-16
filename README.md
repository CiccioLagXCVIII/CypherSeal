# 🔏 CypherSeal: Notarizzazione Crittografica & Sovereign Identity

> **The Gold Standard for Immutable Proof of Existence, Integrity & Authorship on Ethereum.**

**CypherSeal** è una suite decentralizzata avanzata progettata per la protezione e la validazione dell'asset digitale. Fondendo crittografia asimmetrica e tecnologia blockchain, CypherSeal trasforma il concetto di notarizzazione in un processo privo di intermediari, sicuro e legalmente rilevante.

A differenza dei sistemi di timestamping legacy, CypherSeal implementa il paradigma della **Self-Sovereign Identity (SSI)**: ogni operazione è legata al **CypherSoul (CYID)**, un Soulbound Token (SBT) conforme allo standard **EIP-5192**, che garantisce l'identità dell'autore senza compromettere la privacy.

---

## 📑 Indice

- [🔏 CypherSeal: Notarizzazione Crittografica \& Sovereign Identity](#-cypherseal-notarizzazione-crittografica--sovereign-identity)
  - [📑 Indice](#-indice)
  - [💡 Value Proposition](#-value-proposition)
  - [🛡️ Ecosistema CypherSoul (CYID)](#️-ecosistema-cyphersoul-cyid)
  - [🔒 Architettura di Sicurezza](#-architettura-di-sicurezza)
    - [1. Privacy-by-Design (Local Hashing)](#1-privacy-by-design-local-hashing)
    - [2. Identity Gating](#2-identity-gating)
  - [🛠 Stack Tecnologico](#-stack-tecnologico)
  - [📂 Struttura del Progetto](#-struttura-del-progetto)
  - [⚡ Installazione e Avvio](#-installazione-e-avvio)
    - [Prerequisiti](#prerequisiti)
    - [Quick Start](#quick-start)
  - [📖 Guida all'Uso](#-guida-alluso)
  - [⚠️ Nota sul Mocking (Sviluppo)](#️-nota-sul-mocking-sviluppo)
  - [👤 Autore](#-autore)

---

## 💡 Value Proposition

- **Proof of Integrity:** Validazione matematica dell'integrità del file tramite SHA-256. Un singolo bit alterato invalida il sigillo.
- **Proof of Existence:** Marcatura temporale immutabile e resistente alla censura su rete Ethereum.
- **Sovereign Authorship:** L'autore non è un semplice indirizzo anonimo, ma un'entità verificata dal proprio token **CypherSoul**.
- **Zero-Knowledge Privacy:** Il documento originale non viene mai caricato online; solo il suo hash (l'impronta digitale) tocca la blockchain.
- **Revoca Logica:** Sistema di gestione del ciclo di vita dei documenti, che permette di invalidare certificati obsoleti mantenendo l'audit trail.

---

## 🛡️ Ecosistema CypherSoul (CYID)

Il cuore pulsante della reputazione su CypherSeal è il token **CypherSoul (CYID)**.

- **Standard:** EIP-5192 (Minimal Soulbound).
- **Funzione:** Funge da "Passaporto Digitale" non trasferibile.
- **Sicurezza:** Impedisce lo spam nel registro pubblico e assicura che solo attori verificati possano emettere certificazioni di integrità, creando un network di fiducia (Web of Trust).

---

## 🔒 Architettura di Sicurezza

### 1. Privacy-by-Design (Local Hashing)

CypherSeal utilizza le **Web Crypto API** per processare i file lato client.

1. Il file viene trascinato nell'interfaccia.
2. Viene generato l'hash `SHA-256` all'interno della sandbox del browser.
3. **Il documento rimane sul tuo computer.** Nessun dato sensibile viene inviato al server o alla blockchain.

### 2. Identity Gating

L'accesso alla funzione di notarizzazione è protetto da uno Smart Contract che interroga il possesso del token **CYID**.

- **Livello Guest:** Sola verifica dei documenti esistenti.
- **Livello Seal-Maker:** Accesso completo alla notarizzazione (richiede CYID).

---

## 🛠 Stack Tecnologico

- **Frontend:** HTML5, CSS3 (Advanced Custom Properties), JavaScript (ES Modules).
- **UI Framework:** Bootstrap 5 & Bootstrap Icons (Cypher-Custom Theme).
- **Cryptography:** Native Browser `crypto.subtle`.
- **Blockchain Interface:** Logica predisposta per **Ethers.js v6**.
- **Identity Standard:** EIP-5192 (Soulbound Tokens).

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
│   ├── identityContract.sol    # Smart Contract Token SBT
│   └── index.css               # Smart Contract Notarization (Work In Progress)
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

### Prerequisiti

- Un browser moderno con supporto **ES6 Modules**.
- Un server locale (per gestire le policy CORS dei moduli JS).

### Quick Start

1. **Clona la repository:**

   ```bash
   git clone https://github.com/TuoUsername/CypherSeal.git
   cd CypherSeal
   ```

2. **Lancio locale:**
   - Se usi **VS Code**, clicca col tasto destro su `index.html` -> *Open with Live Server*.
   - Oppure usa Python: `python -m http.server 8000`.
3. Naviga su `http://localhost:8000`.

---

## 📖 Guida all'Uso

1. **Connessione:** Collega il tuo Wallet (MetaMask).
2. **Minting CypherSoul:** Se è il tuo primo accesso, genera il tuo token **CYID** nella dashboard per attivare i permessi di scrittura.
3. **Sigillatura (Seal):** Carica un documento in "Certifica", attendi il calcolo dell'impronta e conferma la transazione.
4. **Verifica:** Trascina il file originale nella pagina di verifica. CypherSeal interrogherà la blockchain per confermare timestamp, autore (CYID) e integrità.

---

## ⚠️ Nota sul Mocking (Sviluppo)

Per facilitare il testing dell'interfaccia e la valutazione accademica senza costi di Gas, il modulo **`js/moduleBlockchain.js`** opera attualmente in modalità **Simulation Mode**.

- Le transazioni sono simulate con latenze realistiche.
- I dati vengono persistiti nel `localStorage` per mantenere la coerenza della sessione.
- **Pronto per il Mainnet:** Il codice è strutturato per iniettare l'istanza `ethers.Contract` con modifiche minime alla configurazione.

---

## 👤 Autore

**Francesco Lo Verde**
*Università degli Studi di Perugia*
*Progetto di Data Security & Blockchain*
