# User Context

The UserContext provides easy access to user information stored in the application's storage. It offers both direct property access and function-based access to user data.

## Features

- Direct property access (e.g., `userInfo.name`, `userInfo._id`)
- Function-based access (e.g., `UserContext.getUserName()`)
- Automatic data retrieval from storage
- Type-safe access to user properties
- SSR-safe operations

## Usage

### Direct Property Access

```typescript
import userInfo from "../services/user-context";

// Access user properties directly
const userId = userInfo._id;
const userName = userInfo.name;
const userEmail = userInfo.email;
const userRole = userInfo.role;
const isLoggedIn = userInfo.isLoggedIn;
const isAdmin = userInfo.isAdmin;
```

### Function-Based Access

```typescript
import { UserContext } from "../services/user-context";

// Access user properties via functions
const userId = UserContext.getUserId();
const userName = UserContext.getUserName();
const userEmail = UserContext.getUserEmail();
const userRole = UserContext.getUserRole();
const isLoggedIn = UserContext.isLoggedIn();
const isAdmin = UserContext.isAdmin();
```

### Complete User Data

```typescript
import userInfo from "../services/user-context";

// Get complete user object
const userData = userInfo.data;
// or
const userData = UserContext.getUserData();
```

## Available Properties

- `_id`: User ID
- `name`: User name
- `email`: User email
- `role`: User role
- `avatar`: User avatar (optional)
- `isActive`: User active status
- `isLoggedIn`: Authentication status
- `isAdmin`: Admin status
- `data`: Complete user object

## Benefits

1. **Easy Access**: Simple dot notation access to user properties
2. **Type Safety**: Properly typed user data access
3. **Automatic Updates**: Always retrieves latest data from storage
4. **SSR Compatible**: Safe to use in server-side rendered applications
5. **Consistent API**: Unified interface for user data access

## Best Practices

1. Use `userInfo.property` for direct access in templates
2. Use `UserContext.function()` for programmatic access in components
3. Always check `userInfo.isLoggedIn` before accessing user data
4. Handle empty values appropriately (empty strings for missing data)
