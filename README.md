# 🔏 CypherSeal: Notarizzazione Digitale & SSI Protocol

![Version](https://img.shields.io/badge/version-2.1.0-blue?style=for-the-badge)
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
  - [🛡️ Architettura dell'Identità (EIP-5192)](#️-architettura-dellidentità-eip-5192)
  - [🔒 Privacy-by-Design \& GDPR](#-privacy-by-design--gdpr)
  - [🏗️ Ottimizzazione On-Chain (Gas Saving)](#️-ottimizzazione-on-chain-gas-saving)
  - [🛠️ Stack Tecnologico](#️-stack-tecnologico)
  - [📂 Struttura del Progetto](#-struttura-del-progetto)
  - [⚡ Quick Start](#-quick-start)
  - [👤 Autore](#-autore)

---

## 💡 Visione e Proprietà Forensi

CypherSeal abilita un protocollo di fiducia decentralizzato basato su tre pilastri:

1. **Proof of Integrity:** Attraverso l'hashing **SHA-256**, viene generata un'impronta digitale univoca del file. L'architettura sfrutta l'"effetto avalanche" per rendere immediatamente rilevabile anche la modifica di un singolo bit.
2. **Proof of Existence:** Il timestamping on-chain fornisce una prova temporale immutabile, opponibile a terzi e resistente alla censura.
3. **Proof of Ownership (SSI):** A differenza dei sistemi di notarizzazione anonimi, CypherSeal richiede un **Identity Badge**. Questo crea un legame crittografico tra l'autore (la sua reputazione on-chain) e il sigillo digitale.

### Revoca Logica (Semantic Revocation)

Poiché la blockchain è immutabile, CypherSeal implementa un sistema di **Revoca Logica**. L'autore può emettere una transazione di invalidazione che aggiorna lo stato del documento nel registro pubblico, permettendo la gestione del ciclo di vita di contratti o bozze superate.

---

## 🛡️ Architettura dell'Identità (EIP-5192)

Il protocollo adotta una **Dual-Contract Architecture** per separare la gestione dell'identità dalla logica di notarizzazione:

- **CypherSoul (SBT):** Implementa lo standard **EIP-5192**. Il token è "Soulbound" (non trasferibile). Una volta emesso, funge da credenziale di accesso permanente e non alienabile.
- **CypherSealNotarizer:** Agisce come gatekeeper. Prima di ogni scrittura, interroga il contratto CypherSoul tramite un'interfaccia `view` per verificare che il `msg.sender` possieda i requisiti identitari necessari.

---

## 🔒 Privacy-by-Design & GDPR

La privacy è integrata nel core dell'applicazione:

- **Zero-Knowledge Hashing:** L'impronta digitale del file viene calcolata esclusivamente **lato client** tramite le `Web Crypto API`.
- **Data Isolation:** Il file originale non lascia mai il dispositivo dell'utente. Non viene caricato su server, né su IPFS, né su blockchain.
- **Conformità GDPR:** Poiché sulla blockchain viene memorizzato solo l'hash (un dato pseudo-anonimo unidirezionale), il sistema è intrinsecamente conforme alle normative sulla protezione dei dati sensibili.

---

## 🏗️ Ottimizzazione On-Chain (Gas Saving)

Per massimizzare l'efficienza economica sulla rete Ethereum, CypherSeal adotta tecniche avanzate di sviluppo in Solidity:

- **Event-Driven History:** Invece di memorizzare lo storico dei documenti in costosi array di stato, la DApp ricostruisce la dashboard dell'utente filtrando i log degli **Eventi** (`DocumentNotarized`). Ciò riduce il consumo di gas di oltre il 70% rispetto alle architetture basate su storage tradizionale.
- **Error Handling:** Utilizzo di `Custom Errors` invece di stringhe di errore per minimizzare il deployment e l'esecuzione del bytecode.

---

## 🛠️ Stack Tecnologico

| Layer            | Tecnologia                                            |
| :--------------- | :---------------------------------------------------- |
| **Blockchain**   | Solidity 0.8.27, Ethereum (Sepolia Testnet)           |
| **Web3 Library** | Ethers.js v6 (Modular Implementation)                 |
| **Cryptography** | SubtleCrypto API (Native Browser SHA-256)             |
| **Frontend**     | HTML5 Semantico, CSS3 (Custom Variables), Bootstrap 5 |
| **Identità**     | EIP-5192 (Soulbound Token Standard)                   |

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
└── Images/                     # Immagini
```

---

## ⚡ Quick Start

Il progetto utilizza **ES6 Modules**, pertanto richiede un server locale per la gestione corretta delle policy CORS.

1. **Clona il repository:** `git clone https://github.com/TuoUsername/CypherSeal.git`
2. **Avvia un server locale:**
    - Usando VS Code: estensione *Live Server*.
    - Usando Python: `python -m http.server 8000`
3. **Configurazione Wallet:** Assicurati di avere MetaMask installato e connesso alla rete **Sepolia**.
4. **Onboarding:** Naviga su `connessione.html` per collegare il wallet e procedere al minting del tuo Identity Badge (SBT).

---

## 👤 Autore

**Francesco Lo Verde**
*Università degli Studi di Perugia*
Progetto d'esame per il corso di **Data Security & Blockchain Technology**.

---
*CypherSeal © 2026*
