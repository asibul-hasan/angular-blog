import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../auth/auth.service';

export interface Module {
  _id?: string;
  name: string;
  description?: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Form {
  _id?: string;
  name: string;
  description?: string;
  moduleId: string;
  route: string;
  icon?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ModuleAccess {
  _id?: string;
  roleId: string;
  companyId: string;
  moduleId: string;
  permissions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserAccess {
  _id?: string;
  userId: string;
  companyId: string;
  formId: string;
  permissions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserPermissions {
  moduleAccess: ModuleAccess[];
  userAccess: UserAccess[];
}

@Injectable({
  providedIn: 'root',
})
export class AccessService {
  private apiUrl = environment.apiUrl + '/access';
  private authService = inject(AuthService);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // Module operations
  getModules(): Observable<any> {
    return this.http.get(`${this.apiUrl}/modules`);
  }

  getModuleById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/modules/${id}`);
  }

  createModule(module: Module): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      // Check permission before creating
      return this.authService.hasPermission('access-control', 'create').then((hasPermission: boolean) => {
        if (hasPermission) {
          return this.http.post(`${this.apiUrl}/modules`, module);
        } else {
          throw new Error('Permission denied: You do not have permission to create modules');
        }
      }) as any;
    }
    return of(null);
  }

  updateModule(id: string, module: Partial<Module>): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      // Check permission before updating
      return this.authService.hasPermission('access-control', 'edit').then((hasPermission: boolean) => {
        if (hasPermission) {
          return this.http.put(`${this.apiUrl}/modules/${id}`, module);
        } else {
          throw new Error('Permission denied: You do not have permission to edit modules');
        }
      }) as any;
    }
    return of(null);
  }

  deleteModule(id: string): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      // Check permission before deleting
      return this.authService.hasPermission('access-control', 'delete').then((hasPermission: boolean) => {
        if (hasPermission) {
          return this.http.delete(`${this.apiUrl}/modules/${id}`);
        } else {
          throw new Error('Permission denied: You do not have permission to delete modules');
        }
      }) as any;
    }
    return of(null);
  }

  // Form operations
  getForms(): Observable<any> {
    return this.http.get(`${this.apiUrl}/forms`);
  }

  getFormById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/forms/${id}`);
  }

  createForm(form: Form): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      // Check permission before creating
      return this.authService.hasPermission('access-control', 'create').then((hasPermission: boolean) => {
        if (hasPermission) {
          return this.http.post(`${this.apiUrl}/forms`, form);
        } else {
          throw new Error('Permission denied: You do not have permission to create forms');
        }
      }) as any;
    }
    return of(null);
  }

  updateForm(id: string, form: Partial<Form>): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      // Check permission before updating
      return this.authService.hasPermission('access-control', 'edit').then((hasPermission: boolean) => {
        if (hasPermission) {
          return this.http.put(`${this.apiUrl}/forms/${id}`, form);
        } else {
          throw new Error('Permission denied: You do not have permission to edit forms');
        }
      }) as any;
    }
    return of(null);
  }

  deleteForm(id: string): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      // Check permission before deleting
      return this.authService.hasPermission('access-control', 'delete').then((hasPermission: boolean) => {
        if (hasPermission) {
          return this.http.delete(`${this.apiUrl}/forms/${id}`);
        } else {
          throw new Error('Permission denied: You do not have permission to delete forms');
        }
      }) as any;
    }
    return of(null);
  }

  // Module Access operations
  getModuleAccessList(): Observable<any> {
    // Check permission before getting module access list
    return this.authService.hasPermission('access-control', 'view').then((hasPermission: boolean) => {
      if (hasPermission) {
        return this.http.get(`${this.apiUrl}/module-access`);
      } else {
        throw new Error('Permission denied: You do not have permission to view module access');
      }
    }) as any;
  }

  getModuleAccess(id: string): Observable<any> {
    // Check permission before getting module access
    return this.authService.hasPermission('access-control', 'view').then((hasPermission: boolean) => {
      if (hasPermission) {
        return this.http.get(`${this.apiUrl}/module-access/${id}`);
      } else {
        throw new Error('Permission denied: You do not have permission to view module access');
      }
    }) as any;
  }

  createModuleAccess(moduleAccess: ModuleAccess): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      // Check permission before creating
      return this.authService.hasPermission('access-control', 'create').then((hasPermission: boolean) => {
        if (hasPermission) {
          return this.http.post(`${this.apiUrl}/module-access`, moduleAccess);
        } else {
          throw new Error('Permission denied: You do not have permission to create module access');
        }
      }) as any;
    }
    return of(null);
  }

  updateModuleAccess(id: string, moduleAccess: Partial<ModuleAccess>): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      // Check permission before updating
      return this.authService.hasPermission('access-control', 'edit').then((hasPermission: boolean) => {
        if (hasPermission) {
          return this.http.put(`${this.apiUrl}/module-access/${id}`, moduleAccess);
        } else {
          throw new Error('Permission denied: You do not have permission to edit module access');
        }
      }) as any;
    }
    return of(null);
  }

  deleteModuleAccess(id: string): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      // Check permission before deleting
      return this.authService.hasPermission('access-control', 'delete').then((hasPermission: boolean) => {
        if (hasPermission) {
          return this.http.delete(`${this.apiUrl}/module-access/${id}`);
        } else {
          throw new Error('Permission denied: You do not have permission to delete module access');
        }
      }) as any;
    }
    return of(null);
  }

  // User Access operations
  getUserAccessList(): Observable<any> {
    // Check permission before getting user access list
    return this.authService.hasPermission('access-control', 'view').then((hasPermission: boolean) => {
      if (hasPermission) {
        return this.http.get(`${this.apiUrl}/user-access`);
      } else {
        throw new Error('Permission denied: You do not have permission to view user access');
      }
    }) as any;
  }

  getUserAccess(id: string): Observable<any> {
    // Check permission before getting user access
    return this.authService.hasPermission('access-control', 'view').then((hasPermission: boolean) => {
      if (hasPermission) {
        return this.http.get(`${this.apiUrl}/user-access/${id}`);
      } else {
        throw new Error('Permission denied: You do not have permission to view user access');
      }
    }) as any;
  }

  createUserAccess(userAccess: UserAccess): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      // Check permission before creating
      return this.authService.hasPermission('access-control', 'create').then((hasPermission: boolean) => {
        if (hasPermission) {
          return this.http.post(`${this.apiUrl}/user-access`, userAccess);
        } else {
          throw new Error('Permission denied: You do not have permission to create user access');
        }
      }) as any;
    }
    return of(null);
  }

  updateUserAccess(id: string, userAccess: Partial<UserAccess>): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      // Check permission before updating
      return this.authService.hasPermission('access-control', 'edit').then((hasPermission: boolean) => {
        if (hasPermission) {
          return this.http.put(`${this.apiUrl}/user-access/${id}`, userAccess);
        } else {
          throw new Error('Permission denied: You do not have permission to edit user access');
        }
      }) as any;
    }
    return of(null);
  }

  deleteUserAccess(id: string): Observable<any> {
    if (isPlatformBrowser(this.platformId)) {
      // Check permission before deleting
      return this.authService.hasPermission('access-control', 'delete').then((hasPermission: boolean) => {
        if (hasPermission) {
          return this.http.delete(`${this.apiUrl}/user-access/${id}`);
        } else {
          throw new Error('Permission denied: You do not have permission to delete user access');
        }
      }) as any;
    }
    return of(null);
  }

  // Permission checking
  getUserPermissions(userId: string, companyId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/permissions/${userId}/${companyId}`);
  }

  checkUserPermission(userId: string, companyId: string, formRoute: string, permission: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/check-permission/${userId}/${companyId}/${formRoute}/${permission}`);
  }

  // Client-side permission checking (for better performance)
  async hasPermission(companyId: string, formRoute: string, permission: string): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    // Get user ID from local storage or auth service
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      return false;
    }

    let userId: string;
    try {
      const userObj = JSON.parse(currentUser);
      userId = userObj._id;
    } catch (e) {
      return false;
    }

    // Check permission
    return new Promise<boolean>((resolve) => {
      this.checkUserPermission(userId, companyId, formRoute, permission).subscribe({
        next: (response) => {
          resolve(response.body?.hasPermission || false);
        },
        error: () => {
          resolve(false);
        }
      });
    });
  }
}