// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// SS SEZIONE 1: IMPORTAZIONI E DIPENDENZE
// Importare "Ownable" per la gestione dei permessi amministrativi
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// AA Definizione Interfaccia Identity
// Serve per permettere a questo contratto di "parlare" con HexBadge e chiamare hasValidIdentity
// Interfaccia Per Permettere A Questo Contratto Di Interagire Con Il Contratto HexBadge (SBT)
interface HexBadgeInterface {
    function hasValidIdentity(address user) external view returns (bool);
}

// SS SEZIONE 2: DEFINIZIONE CONTRATTO

contract VerifyDataNotarizer is Ownable {
    // SS SEZIONE 2.1: Strutture Dati e Variabili di Stato

    // AA Struttura per il Documento Notarizzato
    struct Document {
        bytes32 hash;
        address author;
        uint256 timestamp;
        bool isValid;
    }

    // AA Stato del Contratto
    // identityContract: Variabile di tipo HexBadgeInterface per puntare al contratto SBT
    // mapping(bytes32 => Document) private notarizedDocuments: Mapping per salvare i documenti tramite il loro hash

    // SS SEZIONE 2.2: Etichette Errori
    // error NotAuthorizedNoSBT(): Errore se l'utente non ha l'identità
    // error DocumentAlreadyNotarized(): Errore se l'hash esiste già
    // error DocumentNotFound(): Errore per hash mai registrati
    // error NotDocumentAuthor(): Errore se qualcuno prova a revocare un documento non suo

    // SS SEZIONE 2.3: Eventi
    // event DocumentNotarized(bytes32 indexed hash, address indexed author, uint256 timestamp): Segnala una nuova notarizzazione
    // event DocumentRevoked(bytes32 indexed hash, address indexed author): Segnala la revoca logica

    // SS SEZIONE 2.4: Costruttore
    constructor(address initialOwner, address _identityContract) Ownable(initialOwner) {
        // TODO 1. Inizializzare l'indirizzo del contratto HexBadge (SBT) tramite l'interfaccia
    }

    // SS SEZIONE 2.5: Funzioni Core

    // AA Funzione di Notarizzazione
    // function notarize(bytes32 _hash) public {
    // TODO 1. Verificare tramite identityContract se msg.sender possiede un SBT valido (hasValidIdentity)
    // TODO 2. Verificare che l'hash non sia già stato registrato precedentemente
    // TODO 3. Creare una nuova istanza della struct Document
    // TODO 4. Salvare la struct nel mapping usando l'hash come chiave
    // TODO 5. Emettere l'evento DocumentNotarized
    // }

    // AA Funzione di Verifica Pubblica
    // function verify(bytes32 _hash) external view returns (address author, uint256 timestamp, bool isValid) {
    // TODO 1. Verificare che il documento esista nel mapping
    // TODO 2. Restituire i dettagli del documento (Autore, Data, Stato di validità)
    // }

    // AA Funzione di Revoca Logica
    // Permette all'autore di invalidare un documento (es. versione obsoleta)
    // function revoke(bytes32 _hash) external {
    // TODO 1. Verificare che il documento esista
    // TODO 2. Verificare che msg.sender sia l'effettivo autore del documento
    // TODO 3. Settare il campo isValid a false nella struct
    // TODO 4. Emettere l'evento DocumentRevoked
    // }

    // SS SEZIONE 2.6: Funzioni Amministrative

    // AA Aggiornamento Contratto Identity
    // function setIdentityContract(address _newAddress) external onlyOwner {
    // TODO Permettere al proprietario di aggiornare l'indirizzo del contratto SBT in caso di migrazione
    //}
}
