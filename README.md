# OAuth2-progetto-sicurezza-informazione-m

<img width="1151" height="830" alt="Image" src="https://github.com/user-attachments/assets/483c02cc-7a14-452a-9d61-20ad993ce0c8" />

Questo piccolo progetto realizza una semplice interfaccia di login federato tramite il protocollo OAuth2, usando l’accesso con Google come metodo di autenticazione.

La web app si compone di un server node.js, realizzato con Express, e sfrutta il modulo passport.js, un middleware che consente di integrare facilmente OAuth2.

All’interno di server.js risiede l’intera logica del programma. Inizialmente si importano i moduli necessari (express, express-session, passport, passport-google-oauth20) e la Strategy di Google per l’autenticazione.

Si inizializza quindi passport: i metodi serializeUser e deserializeUser consentono di fare save e retrieve dei dati dell’utente nella/dalla sessione. Il metodo use predispone la Strategy da usare e definisce la funzione callback di verifica, che viene chiamata ogni volta che si esegue l’autenticazione e restituisce le informazioni all’utente, attraverso un accessToken (generato da Google dopo l’autenticazione).

Nel primo parametro del metodo passport.use(...) si istanzia un oggetto della classe GoogleStrategy, che contiene all’interno le property clientID, clientSecret e callbackURL. Le prime due sono l’identificativo e il segreto del client OAuth creato per questa applicazione web. 
Su cloud.google.com è possibile, mediante un account Google, definire un client OAuth, in modo da poter dotare la propria applicazione di questo metodo di login federato. In questo caso, il client è configurato in modo da consentire l’accesso soltanto a degli account Google “tester” aggiunti manualmente dallo sviluppatore. Grazie all’ID client e al client secret, l’URL di “entra con Google” reindirizza l’utente verso una pagina di autenticazione di Google, finalizzata all’accesso presso la web app. Il callbackURL è l’indirizzo a cui si viene reindirizzati una volta effettuata l’autenticazione.

Si predispongono quindi tutti i comportamenti della web app: sull’home page è presente una schermata di benvenuto con il tasto “entra con Google”, tale link conduce alla vera schermata di autenticazione di Google che mostra l’app presso cui ci si sta autenticando e a quali dati potrà accedere (in questo caso nome competo dell’utente e indirizzo mail, come specificato nella proprietà scope del metodo passport.authenticate). In caso di login effettuato con successo, il server reindirizza l’utente su una pagina index.html che mostra i dati dell’utente autenticato e consente anche di effettuare il logout.
