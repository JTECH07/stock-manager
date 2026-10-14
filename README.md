# Stock Management Application - React + NestJS

## 🚀 Version 2.1 - FCFA, USER ROLE & RBAC Updates

This is a full-stack Stock Management application built with **React + Vite** and **NestJS**, featuring 4 pages, authentication, role-based access control, and FCFA (CFA Franc) currency formatting.

## 📋 Table des Matières

- [Installation](#-installation)
- [Démarrage](#-démarrage)
- [Pages Disponible](#-pages-disponibles)
- [API Endpoints](#-api-endpoints)
- [Authentification & RBAC](#-authentification--rbac)
- [Monnaie FCFA](#-monnaie-fcfa)
- [Dernières Mises à Jour](#-dernières-mises-à-jour)

## 🛠 Installation

### Backend (NestJS)

```bash
cd stockmanager
npm install
# Configurer la base de données dans ormconfig.json
npm run start:dev
```

### Frontend (React + Vite)

```bash
cd stockManager/client
npm install
npm run dev -- --port 3001
```

## 🚀 Démarrage

L'application sera accessible sur :
- **Frontend** : http://localhost:3001
- **Backend API** : http://localhost:3000

## 📱 Pages Disponibles

| Route | Description |
|-------|-------------|
| `/` | Page Produits - Liste des produits avec prix en FCFA |
| `/categories` | Gestion des catégories |
| `/stock` | Mouvements de stock - Avec contrôle RBAC |
| `/alerts` | Alertes de stock bas |

### Contrôle d'Accès (RBAC) :
- **ADMIN** : Accès complet (toutes les pages, gestion utilisateurs)
- **MANAGER** : Accès aux produits, catégories, mouvements stock
- **MAGASINIER** : Consultation opérationnelle et enregistrement des entrées/sorties de stock

## 🔐 Authentification & RBAC

L'application utilise une `AuthContext` avec les rôles suivants :
- `isAdmin` : Rôle administrateur
- `isManager` : Rôle manager
- `canModify` : ADMIN ou MANAGER peuvent modifier
- `canCreateOrDelete` : Seul ADMIN peut créer/supprimer

**Nouveau :** le rôle `USER` est remplacé par `MAGASINIER`. Le magasinier peut enregistrer les entrées et sorties de stock, sans créer/supprimer les produits, catégories ou utilisateurs.

## 💰 Monnaie FCFA

Tous les prix s'affichent en **Franc CFA (XOF)** au lieu de € :
- Formatage avec `Number(product.price).toLocaleString("fr-CF", {style: "currency", currency: "XOF"})`
- Affichage "Prix (FCFA)"

## 📊 Dernières Mises à Jour

- ✅ Correction erreur Vite `PARSE_ERROR` (suppression espace entre `}` et `onClick`)
- ✅ Passage € → FCFA dans l'affichage des prix
- ✅ Ajout de validations de formulaires précises (inscription)
- ✅ Contrôle RBAC sur page stock-movements (MAGASINIER autorisé pour IN/OUT)
- ✅ Design UI amélioré (Button, Table, Layout avec transitions)
- ✅ Responsive mobile (menu hamburger pour < 768px)
- ✅ Pagination backend déjà implémentée (page + limit query params)
