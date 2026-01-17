// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

// SS SEZIONE 1: IMPORTAZIONI E DIPENDENZE
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// AA Definizione Interfaccia Identity
// Interfaccia Necessaria Per Interagire Con Il Contratto Esterno "CypherSoul" (SBT)
// Permette Di Verificare Se Un Indirizzo Possiede Un'Identità Valida Senza Conoscere L'Intero Codice Dell'Altro Contratto
interface HexBadgeInterface {
    function hasValidIdentity(address user) external view returns (bool);
}

// SS SEZIONE 2: DEFINIZIONE CONTRATTO

contract CypherSealNotarizer is Ownable {
    // SS SEZIONE 2.1: Strutture Dati e Variabili di Stato

    // AA Struttura per il Documento Notarizzato
    // Definisce Il Modello Dati Di Un Certificato Digitale
    // Raggruppa Tutte Le Informazioni Rilevanti Di Un Singolo Documento
    struct Document {
        // L'Impronta Digitale SHA-256 Del File (Chiave Univoca)
        // Per Recuperare La Struct Si Deve Usare L'Hash Quindi Non Serve Memorizzarlo Di Nuovo (Risparmiando Anche Gas)

        // L'Indirizzo Wallet Di Chi Ha Notarizzato Il Documento
        address author;
        // Block Timestamp Della Creazione
        uint256 timestamp;
        // Block Timestamp Della Revoca (0 Se Non Revocato)
        uint256 revocationTimestamp;
        // Flag Di Validità (True = Valido, False = Revocato)
        bool isCertified;
    }

    // AA Stato del Contratto
    // Variabile Che Memorizza L'Istanza Del Contratto Identity (SBT)
    // Viene Usata Per Effettuare Le Chiamate (es. identityContract.hasValidIdentity(address))
    HexBadgeInterface public identityContract;

    // Associa L'Hash Del Documento Ai Suoi Metadati
    // Usiamo Un Mapping Perchè Garantisce Accesso Istantaneo E Risparmio Di Gas Rispetto Agli Array
    mapping(bytes32 => Document) private notarizedDocument;

    // SS SEZIONE 2.2: Etichette Errori
    // Errore: Quando Un Utente Senza Identity Badge Tenta Di Notarizzare
    error NotAuthorizedNoSBT();
    // Errore: Quando Si Tenta Di Registrare Un Hash Già Presente Nel Registro
    error DocumentAlreadyNotarized();
    // Errore: Quando Si Tenta Di Revocare Un Documento Già Revocato
    error DocumentAlreadyRevoked();
    // Errore: Quando Si Cerca O Si Revoca Un Documento Che Non Esiste
    error DocumentNotFound();
    // Errore: Quando Qualcuno Tenta Di Revocare Un Documento Non Suo
    error NotDocumentAuthor();
    // Errore: Quando Si Fornisce Un Indirizzo Non Valido Per Il Contratto Identity
    error InvalidIdentityContractAddress();

    // SS SEZIONE 2.3: Eventi
    // AA Eventi Di Log
    // Evento Emesso Alla Creazione Di Una Nuova Notarizzazione
    // indexed Serve Per Permettere Al Frontend Di Filtrare Lo Storico Per Hash O Per Autore
    event DocumentNotarized(bytes32 indexed _hash, address indexed author, uint256 timestamp);

    // Evento Emesso Quando Un Autore Invalida Un Proprio Documento
    // Segnala Alla Rete Che Il Documento Non È Più Considerato Valido
    event DocumentRevoked(bytes32 indexed _hash, address indexed author);

    // SS SEZIONE 2.4: Costruttore
    // Al Deploy Del Contratto, Viene Chiamato Il Costruttore Che:
    // 1. Richiama Il Costruttore Di Ownable Per Impostare L'Owner Iniziale Del Contratto (Owner Iniziale È Chi Fa Il Deploy)
    // 2. Esegue Il Suo Codice Personalizzato (Quello Dentro Le Graffe)
    constructor(address initialOwner, address _identityContract) Ownable(initialOwner) {
        // Collegare Questo Contratto A identityContract
        identityContract = HexBadgeInterface(_identityContract);
        // Si Imposta Uguale A HexBadgeInterface(_identityContract) Per Abilitare Le Chiamate Alle Funzioni
    }

    // SS SEZIONE 2.5: Funzioni Core
    // Controlli - Scrittura Dati - Eventi

    // AA Funzione di Notarizzazione
    // Definisce Il Processo Di Notarizzazione Di Un Documento
    // Dato Che Questa Funzione Verrà Chiamata Dal JavaScript Della DApp, Si Usa external Invece Di public Che
    // Permette Anche Di Risparmiare Gas Perché I Dati (calldata) Non Vengono Copiati In Memoria
    function notarize(bytes32 _hash) external {
        bytes32 docHash = _hash;
        // NN Verificare Se msg.sender Possiede Un SBT Valido
        if (!identityContract.hasValidIdentity(msg.sender)) {
            revert NotAuthorizedNoSBT();
        }
        // NN Verificare Che Il Documento Non Sia Già Stato Notarizzato
        if (notarizedDocument[docHash].timestamp != 0) {
            // Se Il Timestamp È Diverso Da 0, Il Documento Esiste Già (Valido O Revocato Che Sia)
            // Quindi Non Può Essere Notarizzato Di Nuovo Perché L'Hash Deve Essere Unico E Non Può Essere Sovrascritto
            revert DocumentAlreadyNotarized();
        }
        // NN Effettuare La Notarizzazione
        // Se L'Esecuzione Raggiunge Questo Punto, Significa Che Tutti I Controlli Sono Passati Correttamente
        // Creo Una Nuova Istanza Della Struct Document E La Popolo Con I Dati Necessari
        Document memory newCertifiedDocument = Document({author: msg.sender, timestamp: block.timestamp, revocationTimestamp: 0, isCertified: true});
        // Memorizzo La Nuova Notarizzazione Nel Mapping
        notarizedDocument[docHash] = newCertifiedDocument;

        // NN Emettere L'Evento Di Notarizzazione
        emit DocumentNotarized(docHash, msg.sender, block.timestamp);
    }

    // AA Funzione di Revoca Logica
    // Definisce Il Processo Di Revoca Della Certificazione Di Un Documento Notarizzato
    // È Impossibile Cancellare Completamente I Dati Dalla Blockchain, Quindi Si Imposta Una Flag Che
    // Indica Che Il Documento Non È Più Valido
    function revoke(bytes32 _hash) external {
        // NN Verificare Che Il Documento Esista
        Document storage certDocument = notarizedDocument[_hash];
        if (certDocument.timestamp == 0) {
            // Se Il Timestamp È 0, Il Documento Non Esiste
            revert DocumentNotFound();
        } else if (!certDocument.isCertified) {
            // Se Il Documento Esiste Ma Il Campo isCertified È False, Significa Che È Stato Già Revocato
            revert DocumentAlreadyRevoked();
            // Uso Questo Errore Cosi Evito Che Qualcuno Tenti Di Revocare Più Volte Lo Stesso Documento
            // Che Comporterebbe Solo Uno Spreco Di Gas E Che La Data Di Revoca Cambierebbe Alterandone La Storia
        } else if (certDocument.author != msg.sender) {
            // NN Verificare Che Chi Vuole Effettuare La Revoca Sia L'Autore Del Documento
            // Se Chi Sta Chiamando La Funzione Non È L'Autore Del Documento Non Può Effettuare La Revoca
            revert NotDocumentAuthor();
        } else {
            // NN Effettuare La Revoca
            // Poichè Si Sta Usando storage, Si Può Usare Direttamente certDocument Per Modificare I Dati Nella Blockchain
            // In Quanto È Un Puntatore Ai Dati Nell Blockchain

            // Impostare La Flag A False Per Indicare Che Il Documento Non È Più Valido
            certDocument.isCertified = false;
            // Impostare Il Timestamp Di Revoca
            certDocument.revocationTimestamp = block.timestamp;

            // NN Emettere L'Evento Di Revoca
            emit DocumentRevoked(_hash, msg.sender);
        }
    }

    // AA Funzione di Verifica Pubblica
    // Definisce Il Processo Di Verifica Di Un Documento Notarizzato (Interrogazione Blockchain)
    function verify(bytes32 _hash) external view returns (bytes32 docHash, address author, uint256 timestamp, uint256 revocationTimestamp, bool isCertified) {
        // NN Verificare Che Il Documento Esista
        Document memory certDocument = notarizedDocument[_hash];
        if (certDocument.timestamp == 0) {
            // Se Il Timestamp È 0, Il Documento Non Esiste
            revert DocumentNotFound();
        } else {
            // NN Recuperare I Dettagli Del Documento
            // L'Hash Che Devo Restituire È Quello Passato Come Argomento Perchè L'Obiettivo È Quello
            // Di Verificare Che L'Hash Sia Presente E Le Informazioni Relative

            // Non Mi Serve Differenziare Tra isCertified True O False Qui, Si Può Fare Direttamente Nel Javascript
            address certAuthor = certDocument.author;
            uint256 certTimestamp = certDocument.timestamp;
            uint256 certRevocationTimestamp = certDocument.revocationTimestamp;
            bool certStatus = certDocument.isCertified;

            // Restituire I Dettagli Del Documento (Hash, Autore, Data, Stato Di Validità)
            return (_hash, certAuthor, certTimestamp, certRevocationTimestamp, certStatus);
        }
    }

    // SS SEZIONE 2.6: Funzioni Amministrative

    // AA Aggiornamento Contratto Identity
    // Funzione Che Permette Al Proprietario Del Contratto Di Aggiornare L'Indirizzo Del Contratto SBT
    // Questa Funzione Permette Al Proprietario Di Aggiornare L'Indirizzo Di identityContract Nel Caso In Cui Si Voglia Aggiornare Il Contratto
    // Per L'Identità Digitale (Ad Esempio Per Aggiungere Nuove Funzionalità)

    // Il Parametro onlyOwner Garantisce Che Solo Il Proprietario Del Contratto (Admin) Possa Eseguire Questa Funzione
    function setIdentityContract(address _newAddress) external onlyOwner {
        if (_newAddress == address(0)) {
            // Evitare Di Impostare Come Nuovo Indirizzo Un Indirizzo Vuoto
            // revert("Indirizzo Non Valido");
            revert InvalidIdentityContractAddress();
        } else {
            // Aggiornare L'Indirizzo Del Contratto Identity Covertendo L'Indirizzo Passato Nell'Interfaccia In Modo
            // Da Permettere Le Chiamate Alle Sue Funzioni
            identityContract = HexBadgeInterface(_newAddress);
        }
    }
}

// memory: Prende Il Dato Dalla Blockchain, E Fa Una Copia In RAM. Se Si Vogliono Salvare Le Modifiche Si Deve Sostituire Il Dato Con La Copia In RAM
//         (Costo: Copia + Sostituzione)
// storage: Prende Il Dato Dalla Blockchain. Modifica Direttamente Il Dato Nella Blockchain
//         (Costo: Modifica)
