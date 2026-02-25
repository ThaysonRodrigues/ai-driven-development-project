import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PatientsComponent } from './patients/patients.component';
import { MedicinesComponent } from './medicines/medicines.component';
import { AlertsComponent } from './alerts/alerts.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'registrar', component: RegisterComponent },
    { path: 'pacientes', component: PatientsComponent },
    { path: 'remedios', component: MedicinesComponent },
    { path: 'alertas', component: AlertsComponent },
    { path: 'perfil', component: ProfileComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
