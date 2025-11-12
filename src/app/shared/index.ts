/**
 * Shared public API barrel.
 *
 * Use this to import commonly-used shared artifacts from a single location.
 * Examples:
 *   import SHARED_IMPORTS from 'src/app/shared';
 *   import { StorageService } from 'src/app/shared/services';
 */

export { default as SHARED_IMPORTS } from './shared-imports';
export * from './services';
export * from './directives';
export * from './components';
