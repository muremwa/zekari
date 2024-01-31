import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { APIResponse } from "../shared/shared.model";
import { Teacher } from "../teachers/teacher.model";
import { Observable, map, of, catchError } from "rxjs";
import { environment } from "../../../enviroments/environment";

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    constructor(private httpClient: HttpClient) {}

    getTeachers(): Observable<APIResponse<Array<Teacher>>> {
        return this.httpClient.get<Array<Teacher>>(environment.teachersUrl).pipe(
            map((data) => ({ success: true, data })),
            catchError((_) => of({ success: false, data: [] }))
        );
    }
}
