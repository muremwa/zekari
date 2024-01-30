import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { Router } from "@angular/router";
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

    constructor(private service: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.$authUser = this.service.user.subscribe({
            next: (data) => {
                console.log(data)
                if (data) {
                    this.router.navigate(['/']).then((_) => void 0);
                }
            }
        })
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
