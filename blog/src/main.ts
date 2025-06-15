import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import 'zone.js';
// Importing zone.js for Angular's change detection and async operations
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
