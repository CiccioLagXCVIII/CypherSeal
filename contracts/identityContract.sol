// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.5.0
pragma solidity ^0.8.27;

// SS SEZIONE 1: IMPORTAZIONI E DIPENDENZE
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// SS SEZIONE 2: DEFINIZIONE CONTRATTO

contract CypherSoul is ERC721, ERC721URIStorage, Ownable {
    // SS SEZIONE 2.1: Etichette Errori
    // Quando La DAPP Legge Il Nome Dell'Etichetta E Decide Cosa Mostrare All'Utente
    error IdentityAlreadyMinted();
    error NotOwnerTryBurn();
    error identityNotLocked();
    error transferDenied();

    // SS SEZIONE 2.2: Variabili Di Stato
    // Variabile (uint256) Per Tenere Traccia Dell'ID Del Prossimo Token Da Creare
    // Lo Definiamo Privato Poiché Non Deve Essere Accessibile Esternamente
    uint256 private nextTokenId;
    // Mapping Per Tenere Traccia Degli Indirizzi Che Hanno Già Coniato Un Token
    mapping(address => bool) private hasMinted;

    // SS SEZIONE 2.3: Eventi
    // AA Eventi di Blocco (Locking)
    // Evento Per Segnalare Che Il Token Non Può Essere Trasferito.
    event Locked(uint256 tokenId);
    // Evento Utile Se Si Prevede Di Aggiungere Funzionalità Di Sblocco
    event Unlocked(uint256 tokenId);

    // SS SEZIONE 2.4: Costruttore
    // Al Deploy Del Contratto, Viene Chiamato Il Costruttore Che:
    // 1. Richiama Il Costruttore Di ERC721 Per Inizializzare Nome E Simbolo Del Token
    // 2. Richiama Il Costruttore Di Ownable Per Impostare L'Owner Iniziale Del Contratto (Owner Iniziale È Chi Fa Il Deploy)
    // 3. Esegue Il Suo Codice Personalizzato (Quello Dentro Le Graffe)
    constructor() ERC721("CypherSoul", "CYID") Ownable(msg.sender) {
        // Inizializziamo nextTokenId Al Valore Iniziale (Uso 1 Ma È Legittimo Usare Anche Altri Valori)
        nextTokenId = 1;
    }

    // SS SEZIONE 2.5: Funzioni
    // AA Funzione Di Minting
    function mintBadge(string memory _tokenURI) public {
        // NN 1. Controllare Se L'Indirizzo Chiamante Ha Già Mintato Un Token Utilizzando Il Mapping hasMinted.
        // Usando if/revert Con Errore Personalizzato Costa Meno Gas Rispetto A require Con Stringa
        if (hasMinted[msg.sender]) {
            revert IdentityAlreadyMinted();
        }

        // NN 2. Se Non Ha Già Mintato, Procedere A Mintare Un Nuovo Token All'Indirizzo Chiamante.
        // Aggiornare Le Variabili Di Stato Prima Di Eseguire Interazioni Esterne
        // NN  2.1 Utilizzare nextTokenId Per Ottenere L'ID Unico Del Nuovo Token.
        uint256 tokenId = nextTokenId;
        // NN 2.2 Incrementare nextTokenId Per Prepararsi Al Prossimo
        nextTokenId++;
        // NN 2.3 Aggiornare Il Mapping hasMinted Per Indicare Che L'Indirizzo Ha Ora Mintato Un Token.
        hasMinted[msg.sender] = true;

        // NN 3. Richimare La Funzione Per Mintare Il Token All'Indirizzo Chiamante
        _safeMint(msg.sender, tokenId);
        // NN 4. Impostare Il tokenURI Per Il Token Mintato.
        _setTokenURI(tokenId, _tokenURI);

        // NN Emettere L'Evento 'Locked' Per Il tokenId Appena Creato (Requisito EIP-5192).
        emit Locked(tokenId);
    }

    // AA Funzione Di Revoca (Burning)
    // Essendo Una SSI (Self-Sovereign Identity), L'Utente Potrebbe Voler Revocare La Propria Identità Se Compromessa.
    function burn(uint256 tokenId) external {
        // NN 1. Verificare Che Chi Chiama La Funzione Sia Il Proprietario Del Token
        if (ownerOf(tokenId) != msg.sender) {
            revert NotOwnerTryBurn();
        }
        // NN 2. Aggiornare Il Mapping hasMinted A false (Per Permettere Eventuale Re-Iscrizione).
        hasMinted[msg.sender] = false;

        // NN 3. Eliminare Il Token Utilizzando La Funzione _burn
        _burn(tokenId);
    }

    // AA Funzione Helper Per Il Contratto Notarizer
    // Questa Funzione Permetterà Al Contratto Notarizer Di Verificare Se Un Indirizzo Ha Una Identità Valida (Ha Mintato Un Badge).
    function hasValidIdentity(address user) external view returns (bool) {
        bool hasIdentity = hasMinted[user];
        return hasIdentity;
    }

    // AA Funzione Per Implementare l'Interfaccia EIP-5192
    // Senza Questa Funzione Il Contratto Funzina Comunuqe, E
    // I Trasferimenti Sono Bloccati Grazie All'Override Di _update, Ma Le Piattaforme Esterne
    // Potrebbero Non Riconoscono Il Token Come Soulbound, Secondo Lo Standar EIP-5192.
    function locked(uint256 tokenId) external view returns (bool) {
        address owner = _ownerOf(tokenId);
        // Se Il Token Non Esiste, owner Sarà L'Indirizzo Zero
        if (owner == address(0)) {
            revert identityNotLocked();
        } else {
            // Se Il Token Esiste, owner Sarà Un Indirizzo Valido E Quindi Il Token È Bloccato (Soulbound)
            return true;
        }
    }

    // SS SEZIONE 6: Override Di Funzioni

    // AA Override Delle Funzioni Di Trasferimento (Blocco SBT)
    // Poiché Questo Token Deve Essere Soulbound, È Necessario Bloccare Tutti I Trasferimenti.
    // In OpenZeppelin v5.5.0 Tutte Le Funzioni Di Trasferimento (transferFrom, safeTransferFrom) Chiamano Internamente
    // La Funzione _update. Quindi Per Bloccare I Trasferimenti, È Sufficiente Eseguire L'Override Di Questa Funzione.
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721) returns (address) {
        // NN Ottenere L'Indirizzi:
        // Propietario Precedente (Se Zero Sa Venendo Creato, Se È Un Indirizzo Valido Sta Venendo Trasferito O Revocato)
        address prevOwner = _ownerOf(tokenId);
        // Indirizzo Destinatario (Se Zero Sta Venendo Revocato, Se È Un Indirizzo Valido Sta Venendo Trasferito O Creato)
        address nextOwner = to;
        // prevOwner = 0x000... --> nextOwner = userA   (Minting)
        // prevOwner = userA  --> nextOwner = 0x000...  (Burning)
        // prevOwner = userA  --> nextOwner = userB     (Trasferimento)
        // Essendo Soulbound, Vogliamo Permettere Solo Minting E Burning, Non Trasferimenti/Vendite

        // NN Se prevOwner E nextOwner Sono Entrambi Diversi Da Zero, Significa Che Si Sta Cercando Di Trasferire Il Token Quindi Si Annulla Tutto
        if (prevOwner != address(0) && nextOwner != address(0)) {
            revert transferDenied();
        }
        // NN Altrimenti, Se Si Sta Mintando O Bruciando, Procedere Chiamando La Funzione Di Trasferimento (Che È _update)
        return super._update(to, tokenId, auth);
    }

    // Sia ERC721 Che ERC721URIStorage Hanno Le Loro Implementazioni Delle Funzioni tokenURI E supportsInterface.
    // Il Compilatore Avendo Due Implementazioni Non Sa Quale Usare Quando Vengono Richiamate E Quindi Si Deve Eseguire L'Override
    // AA Override tokenURI
    // Questa Funzione Restituisce Il Link Al File JSON Che Contiene I Metadati Del Token
    // ERC721: Aggiunge Ad Un URI Base L'ID Del Token Per Creare Un URI Completo
    // ERC721URIStorage: Legge Da Un Mapping Gli URI Specifici Per Ogni Token
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    // AA Override supportsInterface
    // Sebbene L'Evento "Locked" E La Funzione "locked" Implementano La Logica Dello Standard EIP-5192, I Marketplace E Gli Indexer (Come Etherscan)
    // Interrogano La Funzione "supportsInterface" Per Riconoscere Ufficialmente Se Il Token È Un SBT EIP-5192. L'interface ID Dello Standard EIP-5192 È "0xb45a3c0e".
    // Solitamente, L'override Di ERC721 Ed ERC721URIStorage Gestisce Automaticamente Le Interfacce Supportate Tramite "super" (Se Uno Dei Genitori Le Supporta,
    // Restituisce "true"). Tuttavia, Poiché Nessuno Dei Due Contratti Genitori Include Nativamente Il Supporto A EIP-5192, Si Imposta Manualmente.
    // Grazie All' OR (||), Si Ottiene Una Doppia Verifica: Se Il Servizio Chiede Se È Un NFT Standard (ERC721), La Chiamata "super" Restituisce "true", Se Invece
    // Il Servizio Chiede Se È Un EIP-5192 (Soulbound), La Seconda Condizione Restituisce "true"
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        // Gli Eventi "Locked" E La Funzione "locked" Implementano La Logica EIP-5192, Ma I Marketplace E Gli Indexer (Come Etherscan) Interrogano La Funzione "supportsInterface" Per Capire Se Il Token È UN SBT EIP-5192
        // L'Interface ID Dello Standard EIP-5192 È "0xb45a3c0e"
        // Siccome Nella Funzione Si Fa L'Override Di "ERC721" E "ERC721URIStorage" Solidity Gestisce Automaticamente Le Interfacce Supportate
        // (Se Uno Dei Contratti Genitori Le Supporta, Viene Restituito True)
        return interfaceId == 0xb45a3c0e || super.supportsInterface(interfaceId);
    }
}

// Quando Si Usa Super In Un Contratto Con Ereditarietà Multipla, Solidity Segue Una Regola Specifica Chiamata "C3 Linearization" Per Determinare L'Ordine Di Chiamata Dei Genitori.
// L'Ordine È Quello In Cui Vengono Dichiarati I Contratti Genitori Dopo La Parola Chiave "is" Da Destra Verso Sinistra.
// In Questo Caso Prima Viene Considerato "Ownable", Poi "ERC721URIStorage", E Infine "ERC721"
