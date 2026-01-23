// app.js
import { Auth } from './moduleAuth.js';
import { Blockchain } from './moduleBlockchain.js';
import { General } from './moduleGeneral.js';
import { HomeManager } from './moduleIndex.js';
import { Notarizer } from './moduleNotarizer.js';
import { Profile } from './moduleProfile.js';
import { Verifier } from './moduleVerifier.js';

document.addEventListener('DOMContentLoaded', async () => {

    // Logiche Generali Per Tutte Le Pagine
    General.activeNavLink();
    await General.protectPrivatePages();
    General.updateLoginBtn();

    // Controllo Silenzioso Dello Stato Di Connessione Al Caricamento Della Pagina
    console.log("CypherSeal: Controllo Se L'Utente Ha Già Autorizzato Il Sito...");
    const accounts = await Blockchain.getAuthorizedAccounts();

    // Logiche Specifiche In Base Alla Pagina
    const page = General.findPage();

    switch (page) {
        case 'index.html':
            HomeManager.handleHome();
            break;
        case 'connessione.html':
            // Assegna La Funzione Di Connessione Al Bottone
            const btn = document.getElementById('connectWalletBtn');
            if (btn) {
                btn.addEventListener('click', () => Auth.checkWallet());
            }
            break;
        case 'profilo.html':
            Profile.updateProfileInterface();
            Profile.copyAddressToClipboard();
            Auth.mintIdentitySBT();
            break;
        case 'certifica.html':
            Notarizer.renderIdentityStatus();
            Notarizer.manageFileUpload();
            Notarizer.copyHashToClipboard();
            Notarizer.handleNotarization();
            break;
        case 'verifica.html':
            Notarizer.manageFileUpload();
            Notarizer.copyHashToClipboard();
            Verifier.handleVerification();

            break;
        default:
            // Nessuna azione specifica
            break;
    }
});