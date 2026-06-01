# AppMobile

Réseau social local géolocalisé — IUT INFO 2ème année, 2025-2026.

**Stack :** Nuxt 4 + Capacitor (Android) · Laravel 11 + Sanctum · MySQL · Docker

---

## Installation

### Prérequis

- Docker Desktop avec intégration WSL 2 activée
- Node.js ≥ 20 dans WSL (`node -v`)
- Android Studio (optionnel, pour le build mobile)

### 1. Cloner le dépôt

```bash
git clone https://github.com/Picsou06/appmobile.git
cd appmobile
```

### 2. Créer les fichiers `.env`

**`api/.env`** — copier depuis l'exemple :

```bash
cp api/.env.example api/.env
```

Vérifier que ces valeurs correspondent au `docker-compose.yml` :

```
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=app
DB_USERNAME=user
DB_PASSWORD=password
```

**`frontend/.env`** — créer manuellement :

```
APP_NAME=AppMobile
APP_ENV=web
WEBAPI_URL=http://localhost:8000
APPAPI_URL=http://10.0.2.2:8000
GOOGLE_MAPS_API_KEY=VOTRE_CLE_ICI
```

> Pour obtenir une clé Google Maps : [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Activer Maps SDK for Android + Maps JavaScript API + Routes API.

### 3. Lancer Docker

```bash
docker compose up -d
```

### 4. Initialiser la base de données

```bash
docker compose exec api php artisan key:generate
docker compose exec api php artisan migrate --seed
docker compose exec api php artisan storage:link
```

### 5. URLs d'accès

| Service | URL |
|---|---|
| Frontend (web) | http://localhost:3000 |
| API Laravel | http://localhost:8000 |
| PhpMyAdmin | http://localhost:8080 |

---

## Compte de test

| Email | Mot de passe |
|---|---|
| `test@test.com` | `password` |

> Tous les comptes générés par le seeder ont le mot de passe `password`. Les emails des autres comptes sont visibles dans PhpMyAdmin (`http://localhost:8080`).

---

## Données générées par le seeder

| Table | Quantité | Détail |
|---|---|---|
| `users` | 10 | 1 compte fixe (`test@test.com`) + 9 aléatoires |
| `posts` | 50 | Textes Faker, répartis entre les users |
| `ads` | 32 | 4 annonces × 8 villes (Paris, Lyon, Marseille, Nice, Bordeaux, Toulouse, Nantes, Strasbourg) |

---

## Architecture du projet

```
appmobile/
├── docker-compose.yml
├── api/                        → Laravel 11 (API REST + Sanctum)
│   ├── app/Http/Controllers/Api/
│   │   ├── UserController.php  → auth, profil, avatar
│   │   ├── PostController.php  → CRUD posts + likes/comments
│   │   ├── AdController.php    → CRUD annonces + distance GPS
│   │   ├── LikeController.php  → toggle like
│   │   └── CommentController.php
│   ├── database/
│   │   ├── migrations/         → users, posts, ads, likes, comments, tokens
│   │   └── seeders/            → DatabaseSeeder + AdSeeder
│   └── routes/api.php          → toutes les routes REST
│
└── frontend/                   → Nuxt 4 SPA + Capacitor
    └── app/
        ├── pages/              → login, index, post/, ads/, map, my-posts, settings
        ├── components/         → AppHeader, PostCard, PostDetail, CardAd, AdForm…
        ├── composables/        → useAuth, usePosts, useAds, useGeolocation,
        │                          useShare, useNotifications, useImagePicker
        └── layouts/            → default.vue (barre de navigation fixe)
```

---

## Plugins Capacitor utilisés

| Plugin | Usage dans l'app |
|---|---|
| `@capacitor/camera` | Photo de profil (avatar) et photo dans les posts — accès caméra ou galerie |
| `@capacitor/geolocation` | Récupération de la position GPS pour les annonces et la carte |
| `@capacitor/google-maps` | Carte interactive native avec marqueurs et itinéraire |
| `@capacitor/share` | Partage d'un post via les apps natives (SMS, WhatsApp, etc.) |
| `@capacitor/local-notifications` | Notifications locales pour les nouveaux likes et commentaires |

---

## Build Android (optionnel)

```bash
cd frontend

# 1. Builder le SPA
npm run build

# 2. Synchroniser Capacitor
npx cap sync android

# 3. Copier vers Windows pour Android Studio
npm run android
```

Puis ouvrir `C:/Users/<user>/Documents/appmobile-tp/android` dans Android Studio et lancer sur émulateur ou appareil.

> Pour tester sur téléphone réel branché en USB :
> ```bash
> adb -s <device> reverse tcp:8000 tcp:8000
> ```
> Laisser `APP_ENV=web` dans `frontend/.env`.

---

## Fonctionnalités

### Authentification
- Inscription / Connexion / Déconnexion
- Modification profil, mot de passe, avatar (caméra Capacitor)

### Posts
- Fil d'actualité avec pagination infinie
- Création avec photo (caméra/galerie Capacitor)
- Détail, modification, suppression (propriétaire uniquement)
- Likes et commentaires en temps réel (optimistic UI)
- Partage natif via Capacitor Share

### Annonces géolocalisées
- Listing trié par distance (fonction SQL `DISTANCE`)
- Création avec bouton "Ma position GPS" (Capacitor Geolocation)
- Détail, modification, suppression
- Vue "Mes annonces"

### Carte
- Page `/map` : carte native Capacitor Google Maps
- Marqueur utilisateur (point bleu) + marqueurs annonces
- Clic sur marqueur → popup + calcul d'itinéraire (Google Routes API)
- Tracé de l'itinéraire sur la carte (polyline)

### Notifications locales
- Déclenchées par polling toutes les 30 secondes
- Nouveau like sur un de vos posts → notification `@capacitor/local-notifications`
- Nouveau commentaire sur un de vos posts → notification

---

## Simuler les notifications

Les notifications sont déclenchées par **polling** : l'app interroge l'API toutes les **30 secondes** et envoie une notification si un nouveau like ou commentaire est détecté sur vos posts.

### Méthode 1 — Commande Artisan interactive

```bash
docker compose exec api php artisan app:send-notification
```

La commande liste les utilisateurs et posts, puis demande l'ID de l'acteur et l'ID du post à liker. L'auteur du post reçoit la notification au prochain cycle (max 30 s).

> Relancer avec les mêmes IDs pour supprimer le like (toggle).

### Méthode 2 — API REST directement

```bash
# Like (remplacer <TOKEN> et <POST_ID>)
curl -X POST http://localhost:8000/api/posts/<POST_ID>/like \
  -H "Authorization: Bearer <TOKEN>"

# Commentaire
curl -X POST http://localhost:8000/api/posts/<POST_ID>/comments \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"body": "Super post !"}'
```

### Comportement attendu

| Action | Notification reçue |
|---|---|
| Quelqu'un like votre post | `Nouveau like 👍 — Quelqu'un a aimé « Titre »` |
| Nouveau commentaire | `Nouveau commentaire 💬 — Nouveau commentaire sur « Titre »` |

> Pas d'auto-notification : l'acteur et l'auteur doivent être des utilisateurs différents.

---

## Navigation dans l'app

### Connexion / Inscription
Page `/login` — formulaire avec toggle Connexion / Inscription.

### Accueil — Feed
Page `/` — fil d'actualité avec posts et annonces intercalées. Bouton `+` en bas à droite pour créer un post.

### Détail d'un post
Cliquer sur un post dans le feed → `/post/[id]`. Bouton crayon si vous êtes l'auteur.

### Profil utilisateur
Cliquer sur le nom/avatar d'un auteur → `/user/[id]`.

### Mon Compte
Menu burger (bulle avatar en haut à droite) → **Mon Compte** → `/my-posts` : vos posts avec votre profil.

### Annonces
Menu burger → **Annonces** → `/ads`. Boutons : Ajouter · Mes annonces · 🗺 Carte.

### Carte
Page `/map` — accessible depuis le menu burger ou le bouton Carte de la page Annonces.

### Paramètres
Menu burger → **Paramètres** → `/settings` : modifier profil, mot de passe, avatar.
