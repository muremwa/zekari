import { Component, OnInit } from '@angular/core';
import { User } from "../../services/auth/auth.models";
import { AuthService } from "../../services/auth/auth.service";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [
        RouterLink
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    user: User;

    constructor(private service: AuthService) {}

    ngOnInit(): void {
        this.service.user.subscribe(
            (data) => {
                if (data) {
                    this.user = data;
                }
            }
        );
    }
}
