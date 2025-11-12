/**
 * Barrel file for shared services.
 * 
 * Re-exports core services from src/app/core/services for compatibility.
 * Import core services directly from 'src/app/core/services' in new code.
 * 
 * Example:
 *   import { StorageService, ToastService } from 'src/app/core/services';
 */

// Re-export core services (provides backward compatibility)
export * from '../../core/services';

// Feature-specific services that remain in shared
export * from './blog';
export * from './category';
export * from './chatbot';
export * from './company';
export * from './contact';
export * from './job';
export * from './language';
export * from './login-activity';
export * from './permission';
export * from './seo';
export * from './service';
export * from './social-links';
export * from './access';
