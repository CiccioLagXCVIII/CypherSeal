# 🛡️ VerifyData: Notarizzazione Digitale & Self-Sovereign Identity

> **Proof of Existence, Integrity & Authorship su Ethereum.**

![Project Status](https://img.shields.io/badge/Status-Prototype-blue)
![Network](https://img.shields.io/badge/Network-Sepolia_Testnet-orange)
![License](https://img.shields.io/badge/License-MIT-green)
![Tech](https://img.shields.io/badge/Tech-ES6%20Modules%20%7C%20Bootstrap%205-yellow)

**VerifyData** è una Decentralized Application (DApp) di nuova generazione progettata per garantire l'autenticità e l'integrità dei documenti digitali.

A differenza dei servizi tradizionali di timestamping, VerifyData introduce il paradigma della **Self-Sovereign Identity (SSI)**: l'identità del firmatario è garantita da un **Soulbound Token (SBT)** (Standard EIP-5192), creando un legame indissolubile e verificabile tra il documento e la reputazione digitale dell'autore.

---

## 📑 Indice

- [🛡️ VerifyData: Notarizzazione Digitale \& Self-Sovereign Identity](#️-verifydata-notarizzazione-digitale--self-sovereign-identity)
  - [📑 Indice](#-indice)
  - [💡 Value Proposition](#-value-proposition)
  - [🔒 Architettura di Sicurezza](#-architettura-di-sicurezza)
    - [1. Privacy-by-Design (Hashing Locale)](#1-privacy-by-design-hashing-locale)
    - [2. Identity Gating (SBT)](#2-identity-gating-sbt)
  - [🛠 Stack Tecnologico](#-stack-tecnologico)
  - [📂 Struttura del Progetto](#-struttura-del-progetto)
  - [⚡ Installazione e Avvio](#-installazione-e-avvio)
    - [Prerequisiti](#prerequisiti)
    - [Passaggi](#passaggi)
  - [📖 Guida all'Uso](#-guida-alluso)
  - [⚠️ Nota sul Mocking (Simulazione)](#️-nota-sul-mocking-simulazione)
  - [👤 Autore](#-autore)

---

## 💡 Value Proposition

- **Proof of Integrity:** Garanzia matematica che il file non è stato alterato (nemmeno di un bit).
- **Proof of Existence:** Prova temporale certa e immutabile su registro distribuito.
- **Anti-Spam Identity:** Solo gli utenti con un profilo verificato (SBT) possono notarizzare, elevando la qualità del registro.
- **Verifica Pubblica:** Chiunque può verificare un documento trascinandolo nel browser, senza intermediari.
- **Revoca Logica:** Possibilità per l'autore di invalidare un documento obsoleto mantenendo la trasparenza storica.

---

## 🔒 Architettura di Sicurezza

### 1. Privacy-by-Design (Hashing Locale)

Il sistema utilizza la **Web Crypto API** nativa del browser.

1. L'utente seleziona il file.
2. Il browser calcola l'hash `SHA-256` in locale.
3. **Il documento originale non lascia mai il dispositivo.**
4. Solo l'impronta digitale (stringa esadecimale) viene inviata alla blockchain.

*Questo approccio rende la DApp intrinsecamente conforme al **GDPR**.*

### 2. Identity Gating (SBT)

L'accesso alla funzione di scrittura è protetto. Lo Smart Contract (simulato) verifica che l'indirizzo mittente possieda un "Identity Badge".
- **Senza Badge:** Utente anonimo → Accesso sola lettura.
- **Con Badge:** Identità Sovrana → Accesso scrittura/notarizzazione.

---

## 🛠 Stack Tecnologico

- **Frontend Core:** HTML5, CSS3 (Custom Properties), JavaScript (ES Modules).
- **UI Framework:** Bootstrap 5 & Bootstrap Icons.
- **Crittografia:** Native `crypto.subtle` API.
- **Web3 Integration:** Logica predisposta per *Ethers.js*.
- **Storage:** `localStorage` (per persistenza sessione nel prototipo).

---

## 📂 Struttura del Progetto

Il progetto adotta un'architettura modulare basata su **ES Modules**:

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

Poiché il progetto utilizza **moduli JavaScript** (`import/export`), i browser bloccheranno l'esecuzione se i file vengono aperti direttamente dal file system (Policy CORS). **È necessario un server HTTP locale.**

### Prerequisiti

* Un browser moderno (Chrome, Firefox, Brave).
- Estensione **MetaMask** installata (opzionale per la UI, consigliata per l'UX reale).
- **VS Code** (Consigliato) o Python/Node installati.

### Passaggi

1. **Clona la repository:**

    ```bash
    git clone https://github.com/TuoUsername/verifydata.git
    cd verifydata
    ```

2. **Avvia il Server Locale:**
    - **Metodo A (VS Code):** Installa l'estensione *"Live Server"*, clicca col tasto destro su `index.html` e seleziona *"Open with Live Server"*.
    - **Metodo B (Python):**

        ```bash
        python -m http.server 8000
        ```

    - **Metodo C (Node.js):**

        ```bash
        npx http-server .
        ```

3. Visita **`http://localhost:8000`** nel browser.

---

## 📖 Guida all'Uso

1. **Connessione:** Clicca su "Connetti Wallet". La DApp simulerà la connessione a MetaMask.
2. **Identità (SBT):** Al primo accesso, la Dashboard ti chiederà di effettuare il "Minting" del tuo Badge SBT. Clicca per attivare il profilo (simulazione transazione).
3. **Certifica:**
    - Vai su "Certifica Documento".
    - Trascina un file (PDF, Immagine, ecc.).
    - Osserva il calcolo dell'Hash in tempo reale.
    - Clicca "Notarizza" per scrivere sulla blockchain (simulata).
4. **Verifica:**
    - Vai su "Verifica Pubblica".
    - Carica lo stesso file: il sistema ti confermerà l'autenticità.
    - Prova a modificare il file originale (anche cambiando una lettera) e ricaricalo: la verifica fallirà (Hash Mismatch).

---

## ⚠️ Nota sul Mocking (Simulazione)

Attualmente, il file **`js/moduleBlockchain.js`** agisce come un **Mock Service Layer**.

- **Cosa significa?** Le chiamate non vengono realmente inviate alla Testnet Sepolia per evitare costi di Gas e complessità di configurazione durante la fase di revisione dell'interfaccia.
- **Come funziona?** Il modulo simula latenze di rete (`setTimeout`), transazioni pendenti e restituisce dati fittizi coerenti (es. se l'hash finisce con un numero è "Valido", se finisce con una lettera è "Revocato").
- **Produzione:** Per passare in produzione, è sufficiente sostituire il contenuto di `moduleBlockchain.js` con le chiamate reali `ethers.Contract(...)`.

---

## 👤 Autore

**Francesco Lo Verde**
Università degli Studi di Perugia
*Progetto di Data Security & Blockchain Forensics*