# 🔏 CypherSeal: Notarizzazione Digitale & SSI Protocol

![Version](https://img.shields.io/badge/version-1.6.1-blue?style=for-the-badge)
![Network](https://img.shields.io/badge/network-Ethereum%20Sepolia-c0c0c0?style=for-the-badge&logo=ethereum)
![Standard](https://img.shields.io/badge/standard-EIP--5192%20(SBT)-red?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

> **Ridefinire la fiducia digitale attraverso la crittografia asimmetrica e l'identità sovrana.**

**CypherSeal** è una Decentralized Application (DApp) di grado forense progettata per la notarizzazione immutabile di asset digitali. Fondendo la certezza matematica della blockchain di Ethereum con i paradigmi della **Self-Sovereign Identity (SSI)**, CypherSeal garantisce che ogni documento notarizzato non sia solo integro, ma riconducibile a un'identità verificata e non trasferibile tramite **Soulbound Tokens (SBT)**.

---

## 📑 Indice

- [🔏 CypherSeal: Notarizzazione Digitale \& SSI Protocol](#-cypherseal-notarizzazione-digitale--ssi-protocol)
  - [📑 Indice](#-indice)
  - [💡 Visione e Proprietà Forensi](#-visione-e-proprietà-forensi)
    - [Revoca Logica (Semantic Revocation)](#revoca-logica-semantic-revocation)
  - [🛡️ Architettura Dual-Contract (EIP-5192)](#️-architettura-dual-contract-eip-5192)
  - [🔒 Privacy-by-Design \& GDPR](#-privacy-by-design--gdpr)
  - [🏗️ Ottimizzazione On-Chain (Gas Saving)](#️-ottimizzazione-on-chain-gas-saving)
  - [⛓️ Indirizzi Contratti (Sepolia)](#️-indirizzi-contratti-sepolia)
  - [🛠️ Stack Tecnologico](#️-stack-tecnologico)
  - [📂 Struttura del Progetto](#-struttura-del-progetto)
  - [⚡ Quick Start \& Faucet](#-quick-start--faucet)
    - [1. Installazione e Avvio](#1-installazione-e-avvio)
      - [Passo 1: Clona il repository](#passo-1-clona-il-repository)
      - [Passo 2: Avvia Il Server Locale](#passo-2-avvia-il-server-locale)
    - [2. Prerequisiti: Ottenere ETH di Test](#2-prerequisiti-ottenere-eth-di-test)
    - [3. Utilizzo](#3-utilizzo)
  - [👤 Autore](#-autore)
    - [⚠️ Disclaimer](#️-disclaimer)

---

## 💡 Visione e Proprietà Forensi

CypherSeal abilita un protocollo di fiducia decentralizzato basato su tre pilastri fondamentali:

1. **Proof of Integrity:** Attraverso l'hashing **SHA-256**, viene generata un'impronta digitale univoca del file. L'architettura sfrutta l'"effetto avalanche" per rendere immediatamente rilevabile anche la modifica di un singolo bit.
2. **Proof of Existence:** Il timestamping on-chain fornisce una prova temporale immutabile, opponibile a terzi e resistente alla censura, sfruttando la sicurezza del consenso Ethereum.
3. **Proof of Ownership (SSI):** A differenza dei sistemi di notarizzazione anonimi, CypherSeal richiede un **Identity Badge**. Questo crea un legame crittografico indissolubile tra la reputazione on-chain dell'autore e il sigillo digitale.

### Revoca Logica (Semantic Revocation)

Poiché la blockchain è *append-only* (solo scrittura), CypherSeal implementa un sistema di **Revoca Semantica**. L'autore può emettere una transazione di invalidazione che aggiorna lo stato del documento nel registro pubblico, permettendo la gestione del ciclo di vita di contratti o bozze superate, pur mantenendo traccia storica della loro esistenza precedente.

---

## 🛡️ Architettura Dual-Contract (EIP-5192)

Il protocollo adotta una **Dual-Contract Architecture** per separare nettamente la gestione dell'identità dalla logica di notarizzazione, garantendo modularità e sicurezza:

- **CypherSoul (SBT):** Implementa lo standard **EIP-5192**. Il token è "Soulbound" (non trasferibile). Una volta emesso, funge da credenziale di accesso permanente e non alienabile, legata al wallet dell'utente.
- **CypherSealNotarizer:** Agisce come gatekeeper logico. Prima di accettare qualsiasi scrittura nel registro, lo Smart Contract interroga `CypherSoul` tramite un'interfaccia `view` per verificare che il `msg.sender` possieda i requisiti identitari necessari (Gatekeeping Anti-Spam).

---

## 🔒 Privacy-by-Design & GDPR

La privacy non è una funzionalità aggiuntiva, ma il core dell'architettura:

- **Client-Side Hashing:** L'impronta digitale del file viene calcolata esclusivamente nel browser dell'utente tramite le `Web Crypto API` native.
- **Data Isolation:** Il file originale **non lascia mai** il dispositivo dell'utente. Non viene caricato su server, né su IPFS, né scritto in chiaro sulla blockchain.
- **Conformità GDPR:** Poiché sulla blockchain viene memorizzato solo l'hash (un dato pseudo-anonimo unidirezionale da cui è matematicamente impossibile risalire al contenuto), il sistema è intrinsecamente "Privacy-Preserving".

---

## 🏗️ Ottimizzazione On-Chain (Gas Saving)

Per massimizzare l'efficienza economica sulla rete Ethereum, CypherSeal adotta tecniche avanzate di sviluppo in Solidity:

- **Event-Driven Storage:** Invece di memorizzare lo storico dei documenti in costosi array di stato (`SSTORE`), la DApp ricostruisce la dashboard dell'utente indicizzando i log degli **Eventi** (`DocumentNotarized`). Ciò riduce il consumo di gas di oltre il **70%** rispetto alle architetture basate su storage tradizionale.
- **Custom Errors:** Utilizzo di `error CustomError()` invece di stringhe di errore (`require`) per minimizzare la dimensione del bytecode e il costo di esecuzione in caso di revert.

---

## ⛓️ Indirizzi Contratti (Sepolia)

Il protocollo è deployato e verificabile sulla Testnet Sepolia di Ethereum.

| Smart Contract                | Indirizzo Contratto                          | Explorer                                                                                             |
| :---------------------------- | :------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **CypherSoul (Identity SBT)** | `0x13F33419b25CB00ed6D51F92dD5216eE9aB3a97E` | [Vedi su Etherscan](https://sepolia.etherscan.io/address/0x13F33419b25CB00ed6D51F92dD5216eE9aB3a97E) |
| **CypherSeal Notarizer**      | `0x964081Fb0b0b8a3018Fbfa315AD7f2B8c674F646` | [Vedi su Etherscan](https://sepolia.etherscan.io/address/0x964081Fb0b0b8a3018Fbfa315AD7f2B8c674F646) |

---

## 🛠️ Stack Tecnologico

| Layer              | Tecnologia         | Dettagli                            |
| :----------------- | :----------------- | :---------------------------------- |
| **Blockchain**     | Solidity `^0.8.27` | Ethereum Sepolia Testnet            |
| **Web3 Logic**     | Ethers.js v6       | Modular ESM Implementation          |
| **Security**       | SubtleCrypto API   | Native SHA-256 Hashing              |
| **Frontend**       | HTML5 / CSS3 / JS  | Dark Mode, Responsive, No-Framework |
| **UI Framework**   | Bootstrap 5        | Layout System & Components          |
| **Token Standard** | EIP-5192           | Minimal Soulbound Interface         |

---

## 📂 Struttura del Progetto

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
│   └── notarizerContract.sol   # Smart Contract Notarization (CypherSealNotarizer)
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
└── Images/                     # Immagini
```

---

## ⚡ Quick Start & Faucet

Il progetto utilizza **ES6 Modules**, pertanto richiede un server locale per la gestione corretta delle policy CORS.

### 1. Installazione e Avvio

Il progetto utilizza **ES6 Modules**, pertanto richiede un server locale per gestire correttamente le policy di sicurezza (CORS). Non è possibile aprire i file direttamente con il doppio click.

#### Passo 1: Clona il repository

```bash
git clone https://github.com/TuoUsername/CypherSeal.git
cd CypherSeal
```

#### Passo 2: Avvia Il Server Locale

Scegli il metodo che preferisci:

**Opzione A: Visual Studio Code (Live Server)**
*Metodo consigliato per semplicità e auto-refresh.*

1. Apri la cartella del progetto con **VS Code**.
2. Installa l'estensione **Live Server** dal marketplace.
3. Fai clic destro sul file `index.html` e seleziona **"Open with Live Server"**.
4. In alternativa, clicca sul tasto **Go Live** presente nella barra di stato in basso a destra.

**Opzione B: Terminale (Python)**
*Metodo rapido se non usi VS Code.*
Se hai Python installato, esegui questo comando nella cartella del progetto:

```bash
python -m http.server 8000
```

> Apri il browser e visita l'indirizzo: `http://localhost:8000`

### 2. Prerequisiti: Ottenere ETH di Test

Per interagire con lo Smart Contract (minting SBT e notarizzazione) sono necessari **Sepolia ETH** per pagare le gas fee (simulate). Puoi ottenerli gratuitamente qui:

- 🚰 [Google Cloud Web3 Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia) (Consigliato)
- 🚰 [Alchemy Sepolia Faucet](https://www.alchemy.com/faucets/ethereum-sepolia) (Richiede Login)

### 3. Utilizzo

1. Assicurati che **MetaMask** sia installato e settato sulla rete **Sepolia**.
2. Vai su `Profilo SSI` nella barra laterale e collega il wallet.
3. Se è il primo accesso, segui la procedura guidata per il **Minting dell'Identity Badge**.

---

## 👤 Autore

**Francesco Lo Verde**
*Università degli Studi di Perugia*
Progetto d'esame per il corso di **Data Security & Blockchain Technology**.

### ⚠️ Disclaimer

*Questo progetto è stato sviluppato a scopo didattico. Il sistema opera sulla Testnet Sepolia di Ethereum: i documenti notarizzati in questo ambiente non hanno valore legale in tribunale e la persistenza dei dati è legata alla vita della Testnet.*

---
*CypherSeal © 2026*
