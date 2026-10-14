# Diagramme de classes

Ce diagramme represente les entites principales, les services NestJS et les dependances metier du projet StockManager.

```mermaid
classDiagram
    direction LR

    class User {
        +number id
        +string email
        +string name
        +string password
        +UserRole role
        +Date createdAt
    }

    class UserRole {
        <<enumeration>>
        ADMIN
        MANAGER
        MAGASINIER
    }

    class Category {
        +number id
        +string name
        +string? description
        +Date createdAt
        +Product[] products
    }

    class Product {
        +number id
        +string name
        +string? description
        +number price
        +number quantity
        +number? categoryId
        +Category? category
        +StockMovement[] movements
        +Date createdAt
    }

    class StockMovement {
        +number id
        +number productId
        +string type
        +number quantity
        +Date date
        +Product? product
    }

    class Alert {
        <<DTO>>
        +number productId
        +string productName
        +number currentQuantity
        +number threshold
        +string categoryName
        +string message
    }

    class AuthService {
        +validateUser(email, pass) User
        +login(dto) AuthResponse
        +register(dto) AuthResponse
    }

    class ProductsService {
        +findAll(page, limit, categoryId) PaginatedProducts
        +findOne(id) Product
        +create(dto) Product
        +update(id, dto) Product
        +remove(id) Result
    }

    class CategoriesService {
        +findAll(page, limit) PaginatedCategories
        +findOne(id) Category
        +create(dto) Category
        +update(id, dto) Category
        +remove(id) Result
    }

    class StockMovementsService {
        +create(dto) StockMovement
        +findAll(productId) StockMovement[]
    }

    class AlertsService {
        +checkAlerts(productId) Alert[]
        +getLowStockItems(threshold, productId) Alert[]
    }

    User --> UserRole : role
    Category "0..1" <-- "0..*" Product : category
    Product "1" <-- "0..*" StockMovement : product

    AuthService ..> User
    ProductsService ..> Product
    CategoriesService ..> Category
    StockMovementsService ..> Product
    StockMovementsService ..> StockMovement
    AlertsService ..> Product
    AlertsService ..> Alert
```

## Lecture rapide

- `Product` est l'entite centrale du stock.
- `Category` regroupe des produits, mais un produit peut exister sans categorie.
- `StockMovement` conserve l'historique des entrees et sorties d'un produit.
- `Alert` n'est pas une table : c'est un objet calcule par `AlertsService`.
- `UserRole` pilote les permissions applicatives et API.
