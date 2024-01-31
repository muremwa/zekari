import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Student } from "./student.model";
import { environment } from "../../../enviroments/environment";
import { Observable, map, catchError, of } from "rxjs";
import { APIResponse } from "../shared/shared.model";

@Injectable({
    providedIn: 'root'
})
export class StudentService {

    constructor(private httpClient: HttpClient) {}

    getStudentDetails(username: string): Observable<APIResponse<Student>> {
        return this.httpClient.get<Student>(environment.studentUrl, { params: { username }}).pipe(
            map((data) => ({ success: true, data })),
            catchError((_) => of({ success: false, data: {} as Student }))
        );
    }
}
