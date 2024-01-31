import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, map, catchError, of, BehaviorSubject } from "rxjs";
import { Student } from "../students/student.model";
import { APIResponse } from "../shared/shared.model";
import { environment } from "../../../enviroments/environment";
import { Teacher } from "./teacher.model";

@Injectable({
    providedIn: 'root'
})
export class TeacherService {
    students = new BehaviorSubject<Array<Student>>([]);

    constructor(private httpClient: HttpClient) {}

    getStudents(username: string):Observable<APIResponse<Array<Student>>> {
        return this.httpClient.get<Array<Student>>(environment.studentsUrl, { params: { username } }).pipe(
            map((data) => {
                this.students.next(data);
                return { success: false, data };
            }),
            catchError((_) => of({ success: false, data: [] }))
        );
    }

    getTeacherDetails(username: string): Observable<APIResponse<Teacher>> {
        return this.httpClient.get<Teacher>(environment.teacherUrl, { params: { username } }).pipe(
            map((data) => ({ success: true, data})),
            catchError((_) => of({ success: false, data: {} as Teacher }))
        );
    }
}
