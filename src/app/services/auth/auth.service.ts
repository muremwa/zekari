import { Injectable } from '@angular/core';
import { User } from "./auth.models";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    users: Array<User> = [
        {
            username: "john",
            password: "john123",
            roles: ["TEACHER", "ADMIN"]
        },
        {
            username: "jane",
            password: "jane123",
            roles: ["ADMIN"]
        },
        {
            username: "doe",
            password: "doe123",
            roles: ["STUDENT"]
        }
    ];
    user = new BehaviorSubject<User|null>(null);

    signIn(username: string, password: string): boolean {
        const userIndex = this.users.findIndex((user) => user.username === username && user.password === password);

        if (userIndex > -1) {
            this.user.next(this.users[userIndex]);
            return true;
        }
        return false;
    }
}
