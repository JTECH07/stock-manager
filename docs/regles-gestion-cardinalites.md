# Regles de gestion et cardinalites

## Regles de gestion

| Code | Regle |
| --- | --- |
| RG-01 | Toute action metier protegee necessite un JWT valide. |
| RG-02 | Un email utilisateur est unique et stocke en minuscules. |
| RG-03 | Le mot de passe utilisateur est hache avec `bcryptjs` avant stockage. |
| RG-04 | Un utilisateur sans role explicite recoit le role `MAGASINIER`. |
| RG-05 | `MAGASINIER` peut consulter les donnees et enregistrer les entrees/sorties de stock. |
| RG-06 | `MANAGER` peut modifier produits/categories et enregistrer des mouvements de stock. |
| RG-07 | `ADMIN` a tous les droits, dont creation/suppression et gestion des utilisateurs. |
| RG-08 | Une quantite de mouvement doit etre strictement superieure a `0`. |
| RG-09 | Une sortie de stock (`OUT`) est refusee si la quantite demandee depasse le stock courant. |
| RG-10 | Une entree de stock (`IN`) augmente la quantite du produit cible. |
| RG-11 | Une sortie de stock (`OUT`) diminue la quantite du produit cible. |
| RG-12 | Chaque mouvement est historise apres mise a jour du produit. |
| RG-13 | Les alertes de stock sont calculees dynamiquement avec `quantity <= threshold`. |
| RG-14 | Le seuil d'alerte par defaut est `5`. |
| RG-15 | Une categorie supprimee ne supprime pas ses produits : leur `categoryId` passe a `NULL`. |
| RG-16 | Un produit supprime entraine la suppression de ses mouvements de stock. |
| RG-17 | Les listes produits/categories sont paginees avec `page` et `limit`. |

## Cardinalites detaillees

| Association | Minimum | Maximum | Implementation |
| --- | --- | --- | --- |
| Categorie -> Produit | 0 produit | n produits | `Category @OneToMany Product` |
| Produit -> Categorie | 0 categorie | 1 categorie | `Product @ManyToOne Category`, nullable |
| Produit -> Mouvement | 0 mouvement | n mouvements | `Product @OneToMany StockMovement` |
| Mouvement -> Produit | 1 produit | 1 produit | `StockMovement @ManyToOne Product` |
| Utilisateur -> Role | 1 role | 1 role | Enum `UserRole` stockee en colonne `role` |

## Endpoints et protections

| Endpoint | Methode | Roles |
| --- | --- | --- |
| `/auth/login` | `POST` | Public |
| `/auth/register` | `POST` | Public |
| `/auth/profile` | `GET` | Authentifie |
| `/products` | `GET` | Authentifie |
| `/products` | `POST` | `ADMIN` |
| `/products/:id` | `PUT` | `ADMIN`, `MANAGER` |
| `/products/:id` | `DELETE` | `ADMIN` |
| `/categories` | `GET` | Authentifie |
| `/categories` | `POST` | `ADMIN` |
| `/categories/:id` | `PUT` | `ADMIN`, `MANAGER` |
| `/categories/:id` | `DELETE` | `ADMIN` |
| `/stock-movements` | `GET` | Authentifie |
| `/stock-movements` | `POST` | `ADMIN`, `MANAGER`, `MAGASINIER` |
| `/alerts` | `GET` | Authentifie |
| `/alerts/low-stock` | `GET` | Authentifie |
| `/users` | `GET` | `ADMIN` |
| `/users/:id/role` | `PUT` | `ADMIN` |
| `/users/:id` | `DELETE` | `ADMIN` |
