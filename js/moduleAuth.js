// moduleAuth.js
import { Blockchain } from './moduleBlockchain.js';

export const Auth = {


    async checkSBTStatus(userAddress) {
        // Usa Blockchain
        return hasIdentity;
    },

    // Funzione Che Gestisce La Connessione Al Wallet MetaMask
    async checkWallet() {
        // Recupera Elemento Del Pulsante Per La Connessione Al Wallet
        const connectWalletBtn = document.getElementById('connectWalletBtn');

        if (connectWalletBtn) {
            if (Blockchain.isProviderAvailable()) {
                try {
                    // Richiede L'Accesso Agli Account Del Wallet
                    const accounts = await Blockchain.requestAccounts();
                    const userAddress = accounts[0];

                    // Memorizza L'Indirizzo Localmente Per Gestire La Sessione
                    localStorage.setItem('walletAddress', userAddress);
                    console.log("VerifyData: Connessione Effettuata ->", userAddress);

                    // Reindirizza L'Utente Alla Dashboard Dopo Il Login Perchè Mi Serve Solo L'Indirizzo
                    window.location.href = 'profilo.html';
                } catch (error) {
                    if (error.code === 4001) {
                        // L'Utente Ha Rifiutato La Connessione
                        alert("Connessione Al Wallet Rifiutata Dall'Utente");
                    } else {
                        console.error("VerifyData: Errore Durante La Connessione Al Wallet", error);
                    }
                }
            } else {
                // Notifica L'Utente Se Il Provider Web3 Non Ã Installato
                alert("Per Favore Installa MetaMask!");
            }
        }
    },

    // Funzione Per Gestire Il Ciclo Di Vita Del Minting Dell'IdentitÃ  Digitale SBT
    mintIdentitySBT() {
        const mintSBTForm = document.getElementById('mintSBTForm');

        if (mintSBTForm) {
            // Ascolta L'Invio Del Modulo Per Avviare La Transazione
            mintSBTForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const userAddress = localStorage.getItem('walletAddress');
                console.log("VerifyData: Preparazione Transazione Per Address ->", userAddress);

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
