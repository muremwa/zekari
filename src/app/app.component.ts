import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { User } from "./services/auth/auth.models";
import { Subscription } from "rxjs";
import { AuthService } from "./services/auth/auth.service";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, NgbCollapseModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
    isNavCollapsed = true;
    $authUser: Subscription;
    user: User | null;

    constructor(private authService: AuthService, public router: Router) {}

    ngOnInit(): void {
        this.router.events.subscribe(
            (_) => {
                this.isNavCollapsed = true;
            }
        );

        this.$authUser = this.authService.user.subscribe({
            next: (data) => this.user = data
        });

        const user = localStorage.getItem("user");
        if (user) {
            this.authService.user.next(JSON.parse(user));
        }
    }

    ngOnDestroy() {
        this.$authUser.unsubscribe();
    }

    signOut() {
        this.router.navigate(['sign-in']).then((_) => {
            this.authService.user.next(null);
            localStorage.removeItem("user")
        });
    }
}
