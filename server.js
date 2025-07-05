// importo i moduli necessari -> express e passport (modulo che consente di implementare OAuth2 in un progetto Node.js)
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));


// Configura la sessione per gestire lo stato dell'utente autenticato
app.use(session({
  secret: 'segreto', // Chiave segreta con cui firmare il session cookie
  resave: false, // mi chiede se voglio risalvare la sessione ad ogni richiesta
  saveUninitialized: true // se voglio salvare sessioni nuove (non inizializzate)
}));

// Inizializza Passport (middleware per autenticazione)
app.use(passport.initialize());
app.use(passport.session());

// Serializzazione: salviamo i dati dell'utente nella sessione
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserializzazione: recuperiamo i dati dell'utente dalla sessione
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Configura la strategia OAuth2 con Google
// il metodo use di passport serve ad imnplementare una strategia di autenticazione, in questo caso quella di Google
// contiene ID e segreto che ho creato sulla mia piattaforma Google Cloud per la mia applicazione
// callbackURL e' l'indirizzo che raggiungo una volta che ho completato l'autenticazione

// il secondo parametro e' la callback di verifica, funzione che passport chiama
// una volta che Google ha effettuato l'autenticazione e fornisce le informazioni sull'utente
// qui e' contenuto il famoso token
passport.use(new GoogleStrategy({
    clientID: '1033392736928-b7b2joj8pm0k06qusivfqrj3bb8olhro.apps.googleusercontent.com',           // client ID
    clientSecret: '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',                                             // client secret
    callbackURL: '/auth/google/callback'                                                             // URL di callback dopo login
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile); // Passiamo il profilo Google all'app
  }
));

// Homepage: se autenticato mostra i dati, altrimenti mostra login
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    const { displayName, emails } = req.user;
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
	        <link rel="stylesheet" href="styles.css">
  	      <title>Login con Google</title>
      </head>

      <body>
        <h2>OAuth 2 demo project</h2>
        <div class="container" id="container">
          <div class="form-container sign-up-container">
            <form action="#">
              <h1>Create Account</h1>
              <div class="social-container">
                </div>
            </form>
          </div>
        <div class="form-container sign-in-container">
            <form action="#">
              <h1>Benvenuto!</h1>
              <div class="social-container">
              </div>
              <span>hai effettuato l'accesso con Google.</span>
            </form>
          </div>
          <div class="overlay-container">
            <div class="overlay">
              <div class="overlay-panel overlay-right">
                <h1>Le tue informazioni</h1>
                <p>Nome: <b>${displayName}</b></p>
                    <p>Email: <b>${emails[0].value}</b></p>
                <a href="/logout">
                    <button class="ghost">Logout</button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
    `);
  } else {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  }
});

// Inizio login con Google
// authenticate attiva il flusso di autenticazione con la strategia scelta (Google)
// con lo scope indichiamo a quali permessi vogliamo accedere
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


// Callback dopo il login
// l'opzione failureRedirect indica dove tornare in caso di auth fallita
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Logout: distrugge la sessione
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Avvio del server
app.listen(3000, () => {
  console.log('Server avviato su http://localhost:3000');
});
