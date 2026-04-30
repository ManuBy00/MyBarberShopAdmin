import { Routes } from '@angular/router';
import { Layout } from './shared/Components/layout/layout';
import { DashboardPage } from './features/dashboard/pages/dashboard-page/dashboard-page';
import { Login } from './features/login/login';
import { authGuard } from './core/auth/auth.guard';
import { AppoinmentsPage } from './features/appointment/pages/appoinments-page/appoinments-page';

export const routes: Routes = [
    { 
        path: 'login',
        component: Login, 
        canActivate: [] // No protegemos la ruta de login, cualquiera puede acceder
    },

    {
    path: '',
    component: Layout,
    canActivate: [authGuard], // Protegemos la ruta principal con el guard
    children: [
        {
            path: 'dashboard',
            loadComponent: () => import('./features/dashboard/pages/dashboard-page/dashboard-page').then(m => m.DashboardPage)
        },

        {
            path: 'appointments',
            loadComponent: () => import('./features/appointment/pages/appoinments-page/appoinments-page').then(m => m.AppoinmentsPage)
        },

        {
            path: 'employees',
            loadComponent: () => import('./features/employees/pages/employees-page/employees-page').then(m => m.EmployeesPage)
        }

        
    ]
    }
];
