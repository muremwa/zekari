import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";


export const authGuard: CanActivateFn = (route, state) => {
    const user = inject(AuthService).user.getValue();

    if (user) {
        if (user.roles.includes("ADMIN")) {
            return true;
        }

        if (user.roles.includes("STUDENT") && state.url.startsWith("/students")) {
            return true;
        }

        if (user.roles.includes("TEACHER") && state.url.startsWith("/teachers")) {
            return true;
        }

        return inject(Router).createUrlTree(
            ['sign-in'],
            { queryParams: { 'code': 'access' }, queryParamsHandling: 'merge' }
        );
    }

    return inject(Router).createUrlTree(
        ['sign-in'],
        { queryParams: { 'next': state.url }, queryParamsHandling: 'merge' }
    );
};
