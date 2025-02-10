
const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const db = require('./database');

const app = express();
const PORT = 3000;


// Middleware pour parser le JSON
app.use(express.json());

// Configuration de la session et du stockage en mémoire
const memoryStore = new session.MemoryStore();
app.use(session({
  secret: 'api-secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// Configuration de Keycloak
const keycloak = new Keycloak({ store: memoryStore }, './keycloak-config.json');
app.use(keycloak.middleware());

// 1. Configuration CORS : Autoriser toutes les origines
app.use(cors());
// Pour restreindre aux domaines autorisés, décommentez et adaptez la ligne suivante :
// app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:4200'] }));

// 2. Configuration du Rate Limiting : 100 requêtes/15 min
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  message: 'Trop de requêtes effectuées depuis cette IP, veuillez réessayer après 15 minutes.'
});
app.use(limiter);

// Page d'accueil
app.get('/', (req, res) => {
  res.json({ message: "Registre de personnes! Utilisez les bonnes routes." });
});

// 🔹 Récupérer toutes les personnes
app.get('/personnes', (req, res) => {
  db.all("SELECT * FROM personnes", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erreur serveur", details: err.message });
    }
    res.json({ message: "Success", data: rows });
  });
});

// 🔹 Récupérer une personne par ID
app.get('/personnes/:id', (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM personnes WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Erreur serveur", details: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: `Aucune personne trouvée avec l'ID ${id}` });
    }
    res.json({ message: "Success", data: row });
  });
});

// 🔹 Créer une nouvelle personne
app.post('/personnes', (req, res) => {
  const { nom, adresse } = req.body;

  if (!nom) {
    return res.status(400).json({ error: "Le champ 'nom' est obligatoire." });
  }

  db.run(`INSERT INTO personnes (nom, adresse) VALUES (?, ?)`, [nom, adresse || ''], function (err) {
    if (err) {
      return res.status(500).json({ error: "Erreur serveur", details: err.message });
    }
    res.json({ message: "Success", data: { id: this.lastID, nom, adresse } });
  });
});

// 🔹 Mettre à jour une personne
app.put('/personnes/:id', (req, res) => {
  const id = req.params.id;
  const { nom, adresse } = req.body;

  if (!nom) {
    return res.status(400).json({ error: "Le champ 'nom' est obligatoire." });
  }

  db.get("SELECT * FROM personnes WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Erreur serveur", details: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: `Aucune personne trouvée avec l'ID ${id}` });
    }

    db.run(`UPDATE personnes SET nom = ?, adresse = ? WHERE id = ?`, [nom, adresse || '', id], function (err) {
      if (err) {
        return res.status(500).json({ error: "Erreur serveur", details: err.message });
      }
      res.json({ message: "Personne mise à jour", data: { id, nom, adresse } });
    });
  });
});

// 🔹 Supprimer une personne
app.delete('/personnes/:id', (req, res) => {
  const id = req.params.id;

  db.get("SELECT * FROM personnes WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Erreur serveur", details: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: `Aucune personne trouvée avec l'ID ${id}` });
    }

    db.run(`DELETE FROM personnes WHERE id = ?`, [id], function (err) {
      if (err) {
        return res.status(500).json({ error: "Erreur serveur", details: err.message });
      }
      res.json({ message: `Personne avec l'ID ${id} supprimée.` });
    });
  });
});

// Route sécurisée avec Keycloak
app.get('/secure', keycloak.protect(), (req, res) => {
  res.json({ message: 'Vous êtes authentifié !' });
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur en ligne sur http://localhost:${PORT}`);
});
