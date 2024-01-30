type UserRole = "ADMIN" | "STUDENT" | "TEACHER";

export interface User {
    username: string;
    password: string;
    roles: Array<UserRole>;
}
