# Storage Service

The StorageService provides a centralized way to manage client-side storage operations in an Angular application. It abstracts direct localStorage access and provides SSR-safe operations.

## Features

- SSR-safe storage operations
- JSON serialization/deserialization
- Type-safe storage access
- Error handling for invalid JSON

## Installation

The StorageService is automatically available as a singleton service when imported.

## Usage

### Injecting the Service

```typescript
import { StorageService } from '../storage.service';

constructor(private storageService: StorageService) {}
```

### Basic Operations

```typescript
// Set a string value
this.storageService.setItem("key", "value");

// Get a string value
const value = this.storageService.getItem("key");

// Remove an item
this.storageService.removeItem("key");

// Clear all items
this.storageService.clear();
```

### Object Operations

```typescript
// Store an object
const userProfile = { name: "John", email: "john@example.com" };
this.storageService.setObject("userProfile", userProfile);

// Retrieve an object
const storedProfile = this.storageService.getObject<UserProfile>("userProfile");

// Check if a key exists
const exists = this.storageService.hasKey("userProfile");
```

## Benefits

1. **SSR Compatibility**: Safe to use in server-side rendered applications
2. **Centralized Management**: All storage operations go through a single service
3. **Type Safety**: Generic methods for type-safe object storage
4. **Error Handling**: Graceful handling of JSON parsing errors
5. **Consistent API**: Unified interface for all storage operations

## Best Practices

1. Always use the StorageService instead of direct localStorage access
2. Use typed objects with getObject<T>() for better type safety
3. Handle null return values appropriately
4. Use hasKey() to check for existence before accessing items
