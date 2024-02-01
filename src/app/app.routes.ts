import { Routes } from '@angular/router';
import { LoginComponent } from "./components/login/login.component";
import { authGuard } from "./guards/auth/auth.guard";
import { StudentsDashboardComponent } from "./components/students/students-dashboard/students-dashboard.component";
import { TeacherDashboardComponent } from "./components/teachers/teacher-dashboard/teacher-dashboard.component";
import { AdminDashboardComponent } from "./components/admins/admin-dashboard/admin-dashboard.component";
import { StudentTrendsComponent } from "./components/students/student-trends/student-trends.component";
import { AssignmentsComponent } from "./components/teachers/assignments/assignments.component";
import { HomeComponent } from "./components/home/home.component";

export const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "sign-in", component: LoginComponent },
    {
        path: "students",
        component: StudentsDashboardComponent,
        canActivate: [authGuard],
        canActivateChild: [authGuard],
        children: [{ path: "trends", component: StudentTrendsComponent }]
    },
    { path: "teachers", component: TeacherDashboardComponent, canActivate: [authGuard] },
    { path: "teachers/assignments", component: AssignmentsComponent, canActivate: [authGuard] },
    { path: "admin", component: AdminDashboardComponent, canActivate: [authGuard] }
];
