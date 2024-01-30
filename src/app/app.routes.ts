import { Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { authGuard } from "./guards/auth/auth.guard";
import { StudentsDashboardComponent } from "./components/students/students-dashboard/students-dashboard.component";

export const routes: Routes = [
    { path: "sign-in", component: LoginComponent },
    { path: "students", component: StudentsDashboardComponent, canActivate: [authGuard] },
];
