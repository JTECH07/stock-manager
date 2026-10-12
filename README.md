# Stock Management Application - React + NestJS

## Project Structure

```
/stockManager/              # Root project directory
  stockmanager/             # NestJS Backend
    src/
      main.ts               # Application entry point
      app.module.ts         # Root module
      app.controller.ts     # Root controller
      app.service.ts        # Root service
      
      products/             # Products module
        products.module.ts
        products.controller.ts
        products.service.ts
        entities/product.entity.ts
        dto/create-product.dto.ts
        dto/update-product.dto.ts
        interfaces/product.interface.ts
      
      categories/           # Categories module
        categories.module.ts
        categories.controller.ts
        categories.service.ts
        entities/category.entity.ts
        dto/create-category.dto.ts
        dto/update-category.dto.ts
        interfaces/category.interface.ts
      
      stock-movements/      # Stock movements module
        stock-movements.module.ts
        stock-movements.controller.ts
        stock-movements.service.ts
        entities/stock-movement.entity.ts
        dto/create-stock-movement.dto.ts
      
      alerts/               # Stock alerts module
        alerts.module.ts
        alerts.controller.ts
        alerts.service.ts
      
    nest-cli.json           # NestJS CLI config
    tsconfig.json           # TypeScript config
    package.json            # Dependencies
    
  stockManager/             # React Frontend (Vite + TS)
    client/
      vite.config.ts        # Vite configuration
      tsconfig.json         # TypeScript config
      package.json          # Dependencies
      src/
        App.tsx             # Main App component
        api.ts              # API service layer
        components/
          Layout.tsx        # Navigation layout
          Button.tsx       # Button component
          Table.tsx        # Table component
        features/
          products/
            product-list.page.tsx  # Products listing page
          categories/
            category-list.page.tsx # Categories listing page
          stock-movements/
            stock-movement.page.tsx # Stock movements page
          alerts/
            alerts.page.tsx      # Alerts/low stock page