// moduleGeneral.js

export const General = {
    // Funzione Per Determinare La Pagina Corrente
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

    // Funzione Per Attivare Il Link Di Navigazione Corrente
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

    // Funzione Per Mostrare Il Modal Di Accesso Negato
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

    // Funzione Per Proteggere Le Pagine Private
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

    // Funzione Per Aggiornare Il Bottone Di Login In Base Alla Connessione Del Wallet
    updateLoginBtn() {
        const authBtn = document.getElementById('connectWalletBtn');
        const headerBtn = document.getElementById('headerActions');
        const walletConnected = localStorage.getItem('walletAddress') || "";

        // Aggiorna L'Interfaccia Utente Se Il Wallet Risulta Collegato
        if (walletConnected) {

            // Verifica L'esistenza Del Pulsante (Evita Errori Su connessione.html)
            if (authBtn) {

                const addr = walletConnected;
                const isMobile = window.innerWidth < 991.98;
                let shortenedAddress = "";

                if (isMobile) {
                    // Mostra 6 CaratteriIndirizzo
                    shortenedAddress = addr.substring(0, 4) + "..." + addr.substring(addr.length - 2);
                } else {
                    // Mostra 12 CaratteriIndirizzo
                    shortenedAddress = addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
                }

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

    // Funzione Per Mostrare Alert Personalizzato
    async showCustomAlert(message, title = "Avviso", iconClass = "bi-info-circle", btnText = "Chiudi") {
        return new Promise(async (resolve) => {
            const customAlert = document.getElementById('customAlertOverlay');

            if (!customAlert) {
                // Se Non È Presente, Crea E Mostra Il Modal

                // Seleziona il body In Modo Che Sia Sopra Tutto
                const mainContent = document.body;
                if (mainContent) {
                    // Crea Overlay
                    const overlayDiv = document.createElement('div');
                    overlayDiv.id = 'customAlertOverlay';
                    overlayDiv.className = 'd-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-75';
                    overlayDiv.style.zIndex = '1060';
                    overlayDiv.style.backdropFilter = 'blur(5px)';

                    // Richiesta Template HTML
                    try {
                        const response = await fetch('customAlert.html');
                        if (response.ok) {
                            const modalContent = await response.text();
                            overlayDiv.innerHTML = modalContent;
                            mainContent.appendChild(overlayDiv);

                            // Gestione Dati Dinamici
                            const modalTitle = document.getElementById('customAlertTitle');
                            const modalIcon = document.getElementById('customAlertIcon');
                            const modalMessage = document.getElementById('customAlertMessage');
                            const modalBtn = document.getElementById('customAlertBtn');


                            modalTitle.textContent = title;
                            modalIcon.className = `bi ${iconClass} display-1`;
                            modalMessage.textContent = message;
                            modalBtn.textContent = btnText;

                            // Colore Icona In Base Al Tipo Di Avviso
                            const iconContainer = document.getElementById('customAlertIconContainer');
                            if (iconClass.includes('exclamation') || title.toLowerCase().includes('errore')) {
                                // Rosso
                                iconContainer.classList.add('text-danger');
                            } else if (iconClass.includes('check')) {
                                // Verde
                                iconContainer.classList.add('text-success');
                            } else if (iconClass.includes('shield') || iconClass.includes('lock')) {
                                // Ciano
                                iconContainer.classList.add('text-primary');
                            } else {
                                // Giallo
                                iconContainer.classList.add('text-warning');
                            }

                            // Gestione Chiusura
                            // Chiusura Dal Button
                            const closeAndResolve = () => {
                                overlayDiv.remove(); // Rimuove dal DOM
                                resolve(true); // Risolve la Promise
                            };
                            modalBtn.addEventListener('click', closeAndResolve);

                            // Chiusura Cliccando Fuori Dal Modal
                            overlayDiv.addEventListener('click', (e) => {
                                if (e.target === overlayDiv) closeAndResolve();
                            });

                        } else {
                            console.error('Template customAlert.html Non Trovato:', response.status);
                            // Fallback in caso di errore fetch
                            resolve(true);
                        }
                    } catch (fetchError) {
                        console.error('Errore Caricamento customAlert:', fetchError);
                        resolve(true);
                    }
                }
            }
            // Appendiamo al body per essere sicuri che sia sopra tutto



            try {

            } catch (error) {

            }
        });
    }
};