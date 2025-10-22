import { HttpContextToken } from '@angular/common/http';

export const LOADER_CONTEXT = new HttpContextToken<boolean>(() => true);
