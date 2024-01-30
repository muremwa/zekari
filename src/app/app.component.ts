import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { User } from "./services/auth/auth.models";
import { Subscription } from "rxjs";
import { AuthService } from "./services/auth/auth.service";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
    $authUser: Subscription;
    user: User | null;

    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.$authUser = this.authService.user.subscribe({
            next: (data) => this.user = data
        });
    }

    ngOnDestroy() {
        this.$authUser.unsubscribe();
    }

    signOut() {
        this.router.navigate(['sign-in']).then((_) => this.authService.user.next(null));
    }
}
