// moduleAuth.js
import { Blockchain } from './moduleBlockchain.js';
import { General } from './moduleGeneral.js';

export const Auth = {

    // Funzione Che Gestisce La Connessione Al Wallet MetaMask
    async checkWallet() {
        // Non serve Recuperare Il Bottone Qui, Lo Faccio In App.js
        if (Blockchain.isProviderAvailable()) {
            try {
                // Richiede All'Utente Di Connettere Il Sito Al Wallet
                const accounts = await Blockchain.requestAccounts();

                // Controllo Di Sicurezza Per Verificare Che Ci Sia Almeno Un Account
                if (accounts && accounts.length > 0) {
                    const userAddress = accounts[0];

                    // Memorizza L'Indirizzo Localmente Per Gestire La Sessione
                    localStorage.setItem('walletAddress', userAddress);
                    console.log("CypherSeal: Connessione Effettuata ->", userAddress);

                    // Reindirizza L'Utente Alla Dashboard Dopo Il Login Perchè Mi Serve Solo L'Indirizzo
                    window.location.href = 'profilo.html';
                } else {
                    console.error("CypherSeal: Nessun Account Trovato Dopo La Richiesta Di Connessione");
                }
            } catch (error) {
                if (error.code === "ACTION_REJECTED" || error.info.error.code === 4001) {
                    // L'Utente Ha Rifiutato La Connessione
                    await General.showCustomAlert(
                        "Hai Rifiutato La Richiesta Di Connessione Su MetaMask. Riprova Per Accedere.",
                        "Connessione Rifiutata",
                        "bi-x-circle-fill"
                    );

                } else {
                    console.error("CypherSeal: Errore Durante La Connessione Al Wallet", error);
                }
            }
        } else {
            // Notifica L'Utente Se Il Provider Web3 Non È Installato
            await General.showCustomAlert(
                "Nessun Provider Web3 Rilevato. Installa L'Estensione MetaMask Per Continuare.",
                "MetaMask Non Trovato",
                "bi-puzzle-fill"
            );
        }
    },

    // Funzione Per Gestire Il Ciclo Di Vita Del Minting Dell'Identità  Digitale SBT
    mintIdentitySBT() {
        const mintSBTForm = document.getElementById('mintSBTForm');

        if (mintSBTForm) {
            // Ascolta L'Invio Del Modulo Per Avviare La Transazione
            mintSBTForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const userAddress = localStorage.getItem('walletAddress');
                console.log("CypherSeal: Preparazione Transazione Per Address ->", userAddress);

                const submitBtn = e.target.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Minting in corso...';

                // SS Interazione Con La Blockchain
                await Blockchain.mintSBT(userAddress);

                // Simulazione Del Successo Della Transazione Su Blockchain
                localStorage.setItem('identitySBT', 'true');

                // Ricarica La Pagina Per Aggiornare L'Interfaccia Con I Nuovi Dati
                window.location.reload();
            });
        }
    }

};
