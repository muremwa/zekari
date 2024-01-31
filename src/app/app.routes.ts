import { Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { authGuard } from "./guards/auth/auth.guard";
import { StudentsDashboardComponent } from "./components/students/students-dashboard/students-dashboard.component";
import { TeacherDashboardComponent } from "./components/teachers/teacher-dashboard/teacher-dashboard.component";
import { AdminDashboardComponent } from "./components/admins/admin-dashboard/admin-dashboard.component";

export const routes: Routes = [
    { path: "sign-in", component: LoginComponent },
    { path: "students", component: StudentsDashboardComponent, canActivate: [authGuard] },
    { path: "teachers", component: TeacherDashboardComponent, canActivate: [authGuard] },
    { path: "admin", component: AdminDashboardComponent, canActivate: [authGuard] }
];
