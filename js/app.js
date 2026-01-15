// app.js
import { Auth } from './moduleAuth.js';
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

    // Logiche Specifiche In Base Alla Pagina
    const page = General.findPage();

    switch (page) {
        case 'index.html':
            HomeManager.init();
            break;
        case 'connessione.html':
            // Assegna la funzione al click del bottone se presente
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
            Verifier.init();

            break;
        default:
            // Nessuna azione specifica
            break;
    }
});