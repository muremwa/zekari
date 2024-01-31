import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NgClass } from "@angular/common";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NgClass
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm = new FormGroup({
        "username": new FormControl("", { nonNullable: true, validators: [Validators.required]}),
        "password": new FormControl("", { nonNullable: true, validators: [Validators.required]})
    });
    $authUser: Subscription;
    accessError = false;

    constructor(private service: AuthService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit(): void {
        const _forward = ["/"];

        this.route.queryParams.subscribe(
            (_params: Params) => {
                const params = new Map(Object.entries(_params).filter(([_, v]) => Boolean(v)));
                _forward.splice(0, _forward.length, params.get("next") || "/");

                if (params.has("code") && params.get("code") === "access") {
                    this.loginForm.setErrors({ "accessDenied": true });
                    this.accessError = true;
                }
            }
        );

        this.$authUser = this.service.user.subscribe({
            next: (data) => {
                if (data) {
                    this.router.navigate(_forward).then((_) => localStorage.setItem('user', JSON.stringify(data)));
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.$authUser.unsubscribe();
    }

    checkInputInValidity(control: FormControl, form: FormGroupDirective): boolean {
        return (control.invalid && control.touched) || (control.invalid && form.submitted);
    }

    login() {
        if (this.loginForm.valid) {
            const value = this.loginForm.value;

            if (!this.service.signIn(value.username!, value.password!)) {
                this.loginForm.setErrors({ 'invalidDetails': true });
            }
        }
    }
}
