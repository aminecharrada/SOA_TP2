
# Registre de Personnes - API Node.js avec SQLite et Keycloak  

### Description  
Ce projet est une API REST développée en **Node.js** utilisant **SQLite** comme base de données locale. Elle permet de gérer un registre de personnes (CRUD) avec une sécurité fournie par **Keycloak**. L'API inclut la gestion de sessions, la limitation du taux de requêtes et le support de **CORS**.  

### Fonctionnalités  
- **Créer, lire, mettre à jour et supprimer** des personnes dans la base de données SQLite.  
- **Protection des routes** avec Keycloak pour une sécurité avancée.  
- **Limitation du taux de requêtes** pour éviter les abus (100 requêtes par 15 minutes).  
- **Support CORS** pour accepter les requêtes externes.  

### Technologies Utilisées  
- **Node.js**  
- **Express**  
- **SQLite**  
- **Keycloak**  
- **express-session**  
- **express-rate-limit**  
- **CORS**  

### Installation  

1. **Cloner le dépôt**  
   ```bash
   git clone https://github.com/aminecharrada/SOA_TP2.git
   cd SOA_TP2
   ```

2. **Installer les dépendances**  
   ```bash
   npm install
   ```

3. **Configurer Keycloak**  
   Placez votre fichier `keycloak-config.json` dans le répertoire racine du projet. Ce fichier doit contenir la configuration nécessaire pour vous connecter à votre serveur Keycloak.  

4. **Lancer l'application**  
   ```bash
   node app.js
   ```
   Le serveur sera accessible sur [http://localhost:3000](http://localhost:3000).  

### Endpoints de l'API  

| Méthode | Route                | Description                                   |
|---------|-----------------------|-----------------------------------------------|
| GET     | `/`                   | Page d'accueil avec un message de bienvenue.  |
| GET     | `/personnes`          | Récupérer toutes les personnes.               |
| GET     | `/personnes/:id`      | Récupérer une personne par ID.                |
| POST    | `/personnes`          | Créer une nouvelle personne.                  |
| PUT     | `/personnes/:id`      | Mettre à jour une personne par ID.            |
| DELETE  | `/personnes/:id`      | Supprimer une personne par ID.                |
| GET     | `/secure`             | Route sécurisée avec Keycloak.                |

### Exemple de Requête  

**Créer une personne** :  
```bash
POST /personnes
Content-Type: application/json

{
  "nom": "John Doe",
  "adresse": "123 Rue Principale"
}
```

**Réponse** :  
```json
{
  "message": "Success",
  "data": {
    "id": 1,
    "nom": "John Doe",
    "adresse": "123 Rue Principale"
  }
}
```

### Sécurité  
- **Authentification** : L'authentification est gérée par **Keycloak**.  
- **CORS** : Activé pour accepter toutes les origines (modifiable pour restreindre les domaines autorisés).  
- **Rate Limiting** : 100 requêtes maximum par IP toutes les 15 minutes.  

### Dépendances Principales  
- `express`  
- `sqlite3`  
- `express-session`  
- `keycloak-connect`  
- `express-rate-limit`  
- `cors`  

### Contribution  
Les contributions sont les bienvenues ! Ouvrez une issue ou soumettez une pull request pour toute amélioration.  

### Auteur  
- **Amine Charrada**  



