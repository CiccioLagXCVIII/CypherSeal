// moduleGeneral.js

export const General = {
    findPage() {
        const path = window.location.pathname;
        if (path.includes('/index.html')) {
            return 'index.html';
        } else if (path.includes('/connessione.html')) {
            return 'connessione.html';
        } else if (path.includes('/profilo.html')) {
            return 'profilo.html';
        } else if (path.includes('/certifica.html')) {
            return 'certifica.html';
        } else if (path.includes('/verifica.html')) {
            return 'verifica.html';
        } else if (path === '/' || path.endsWith('/')) {
            return 'index.html';
        }
        else {
            return 'index.html';
        }

    },

    activeNavLink() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPage = this.findPage();

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Confronta L'href Del Link Con La Variabile Globale Della Pagina
            if (currentPage === href) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    async showAccessDeniedModal() {
        const accessDeniedModal = document.getElementById('accessDeniedModal');

        if (!accessDeniedModal) {
            // Se Non È Presente, Crea E Mostra Il Modal
            const mainContent = document.getElementById('mainContent');
            if (mainContent) {
                mainContent.style.position = 'relative';

                const overlayDiv = document.createElement('div');
                overlayDiv.className = 'd-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100 z-3 bg-dark bg-opacity-50';
                overlayDiv.id = 'accessDeniedModal';

                try {
                    const response = await fetch('alertAccessoNegato.html');
                    if (response.ok) {
                        const modalContent = await response.text();
                        overlayDiv.innerHTML = modalContent;
                        mainContent.appendChild(overlayDiv);
                    } else {
                        console.error('File Del Modal Di Accesso Negato Non Trovato:', response.status);
                        window.location.href = 'connessione.html';
                    }
                } catch (error) {
                    console.error('Errore Nel Caricamento Del Modal Di Accesso Negato:', error);
                    window.location.href = 'connessione.html';
                }
            } else {
                console.error('Elemento mainContent Non Trovato.');
                return;
            }
        } else {
            // Se Presente, Non Duplicarlo
            return;
        }
    },

    async protectPrivatePages() {
        const privatePages = ['profilo.html', 'certifica.html'];
        const walletConnected = localStorage.getItem('walletAddress') || "";
        const currentPage = this.findPage();

        // Reindirizza L'Utente Se Prova Ad Accedere A Pagine Private Senza Wallet
        if (privatePages.includes(currentPage)) {
            const mainContent = document.getElementById('mainContent');

            if (!walletConnected) {
                // Se Il Wallet Non È Collegato, Mostra Un Overlay Di Protezione

                if (mainContent) {
                    mainContent.classList.add('protected-overlay');
                    mainContent.style.visibility = 'visible';
                }
                // Mostra Il Modal Sopra La Pagina Con Overlay
                await this.showAccessDeniedModal();

            } else {

                // SS Interazione Blockchain
                console.log("Richiesta Dati In Base A Indirizzo: Verifica Validità  Sessione Provider");

                // Se Il Wallet È Collegato, Rimuovi L'Overlay Di Protezione
                if (mainContent) {
                    const modal = document.getElementById('accessDeniedModal');
                    if (modal) {
                        modal.remove();
                    }

                    mainContent.classList.remove('protected-overlay');
                    mainContent.style.visibility = 'visible';
                }
            }
        }
    },

    updateLoginBtn() {
        const authBtn = document.getElementById('connectWalletBtn');
        const headerBtn = document.getElementById('headerActions');
        const walletConnected = localStorage.getItem('walletAddress') || "";

        // Aggiorna L'Interfaccia Utente Se Il Wallet Risulta Collegato
        if (walletConnected) {

            // Verifica L'esistenza Del Pulsante (Evita Errori Su connessione.html)
            if (authBtn) {
                const addr = walletConnected;
                const shortenedAddress = addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);

                authBtn.innerHTML = `<i class="bi bi-person-check-fill me-2"></i> ${shortenedAddress}`;
                authBtn.href = "profilo.html";
                authBtn.classList.replace('btn-outline-primary', 'btn-primary');
            }

            // Crea Dinamicamente Il Pulsante Di Logout Solo Se Esiste Il Contenitore Header
            if (headerBtn && !document.getElementById('logoutBtn')) {
                const logoutBtn = document.createElement('button');
                logoutBtn.type = 'button';
                logoutBtn.id = 'logoutBtn';
                logoutBtn.className = 'btn btn-danger btn-sm rounded-pill ms-2';
                logoutBtn.innerHTML = '<i class="bi bi-box-arrow-right"></i>';

                // Gestisce L'evento Di Disconnessione (Logica Accorpata Qui Per Evitare Conflitti)
                logoutBtn.addEventListener('click', () => {
                    localStorage.removeItem('walletAddress');
                    localStorage.removeItem('identitySBT');
                    window.location.href = 'index.html';
                });

                headerBtn.appendChild(logoutBtn);
            }
        }
    },

    // Altre Funzioni Se Necessario
};