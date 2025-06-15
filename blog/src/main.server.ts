import 'zone.js'; // ✨ THIS IS CRUCIAL FOR SSR! It must be the very first line.


import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;
