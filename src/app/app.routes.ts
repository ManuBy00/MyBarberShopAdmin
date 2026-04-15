import { Routes } from '@angular/router';
import { Layout } from './Shared/Components/layout/layout';
import { DashboardPage } from './Features/Pages/dashboard/dashboard-page';
import { Login } from './Features/Pages/login/login';
import { authGuard } from './Shared/services/auth/auth.guard';
import { AppoinmentsPage } from './Features/Pages/appoinments-page/appoinments-page';

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
            component: DashboardPage 
        },

        {
            path: 'appointments',
            component: AppoinmentsPage
        }
    ]
    }
];
