# Guide de navigation — AppMobile

---

## Connexion

**Page :** `/login`

Au lancement de l'app, vous arrivez directement sur la page de connexion si vous n'êtes pas connecté. Remplissez votre email et mot de passe, puis appuyez sur **Se connecter**.

---

## Accueil — Feed

**Page :** `/`

C'est la page principale après connexion. Vous y voyez le fil d'actualité avec les posts des autres utilisateurs et des annonces intercalées.

---

## Créer un post

**Page :** `/post/create`

Depuis l'**Accueil**, cliquez sur le **bouton rond `+`** en bas à droite de l'écran. Vous pouvez ajouter un titre, une description et une photo (optionnelle).

---

## Voir le détail d'un post

**Page :** `/post/[id]`

Depuis l'**Accueil**, cliquez sur n'importe quel post dans le feed pour l'ouvrir en plein écran. Si vous êtes l'auteur du post, un **bouton crayon** apparaît en haut à droite pour le modifier.

---

## Voir le profil d'un utilisateur

**Page :** `/user/[id]`

- Depuis un post du feed, cliquez sur le **nom ou l'avatar** de l'auteur du post.
- Depuis le menu en haut à droite (bulle avatar), cliquez sur **Mon Compte** pour voir votre propre profil.

---

## Annonces

**Page :** `/ads`

Ouvrez le menu en cliquant sur votre **bulle avatar** (en haut à droite), puis sélectionnez **Annonces**. Vous voyez toutes les annonces à proximité.

Depuis cette page, trois boutons sont disponibles en haut :

| Bouton | Destination |
|---|---|
| **Ajouter** | Créer une nouvelle annonce |
| **Mes annonces** | Voir et gérer vos propres annonces |
| **🗺 Carte** | Voir les annonces sur une carte interactive |

---

## Créer une annonce

**Page :** `/ads/create`

Depuis la page **Annonces**, cliquez sur le bouton **Ajouter**. Remplissez le titre, la ville, les coordonnées GPS et la description.

---

## Mes annonces

**Page :** `/ads/my`

Depuis la page **Annonces**, cliquez sur **Mes annonces**. Vous voyez la liste de vos annonces publiées. Pour en modifier une, cliquez sur le bouton **Modifier** à droite de l'annonce.

---

## Carte des annonces

**Page :** `/ads/map`

Depuis la page **Annonces**, cliquez sur **🗺 Carte**. La carte affiche votre position (point bleu) et les épingles des annonces autour de vous. Cliquez sur une épingle pour voir l'annonce et calculer l'itinéraire depuis votre position.

---

## Paramètres

**Page :** `/settings`

Cliquez sur votre **bulle avatar** en haut à droite, puis sur **Paramètres**. Vous pouvez y modifier :

- Votre prénom / nom / email
- Votre mot de passe
- Votre photo de profil (avatar)

---

## Déconnexion

Cliquez sur votre **bulle avatar** en haut à droite, puis sur **Déconnexion** (en rouge en bas du menu).

---

## Tester le système de notifications

Les notifications sont déclenchées par **polling** : l'app interroge l'API toutes les **30 secondes** et envoie une notification locale si un nouveau like ou commentaire est détecté sur vos posts.

### Commande Artisan — simuler un like

Depuis le dossier `api/`, lancez la commande interactive :

```bash
cd api
php artisan app:send-notification
```

La commande affiche la liste des utilisateurs et des posts, puis demande :
1. **L'ID de l'utilisateur** qui ajoute le like (l'acteur)
2. **L'ID du post** à liker

Elle ajoute (ou supprime si déjà présent) le like en base. L'auteur du post recevra la notification au prochain cycle de polling (max 30 s).

> Si vous relancez la commande avec les mêmes IDs, elle **supprime** le like (toggle), ce qui permet de tester aussi la disparition.

### Tester un like via l'API REST

```bash
# Remplacez <TOKEN> par le Bearer token de l'utilisateur connecté
# et <POST_ID> par l'ID du post à liker

curl -X POST http://localhost:8000/api/posts/<POST_ID>/like \
  -H "Authorization: Bearer <TOKEN>"
```

### Tester un commentaire via l'API REST

```bash
curl -X POST http://localhost:8000/api/posts/<POST_ID>/comments \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"body": "Super post !"}'
```

### Comportement attendu

| Action | Notification reçue (par l'auteur du post) |
|---|---|
| Quelqu'un like votre post | `Nouveau like 👍 — Quelqu'un a aimé « Titre »` |
| Plusieurs likes en une fois | `Nouveau like 👍 — X personnes ont aimé « Titre »` |
| Nouveau commentaire | `Nouveau commentaire 💬 — Nouveau commentaire sur « Titre »` |
| Plusieurs commentaires | `Nouveau commentaire 💬 — X nouveaux commentaires sur « Titre »` |

> Les notifications n'apparaissent **pas** si l'acteur du like/commentaire est le même que l'auteur du post (pas d'auto-notification).
