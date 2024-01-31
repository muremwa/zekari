import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, map, catchError, of } from "rxjs";
import { Student } from "../students/student.model";
import { APIResponse } from "../shared/shared.model";
import { environment } from "../../../enviroments/environment";
import { APIAssignment, Assignment, Teacher } from "./teacher.model";

@Injectable({
    providedIn: 'root'
})
export class TeacherService {
    constructor(private httpClient: HttpClient) {}

    getStudents(username: string):Observable<APIResponse<Array<Student>>> {
        return this.httpClient.get<Array<Student>>(environment.studentsUrl, { params: { username } }).pipe(
            map((data) => ({ success: false, data })),
            catchError((_) => of({ success: false, data: [] }))
        );
    }

    getTeacherDetails(username: string): Observable<APIResponse<Teacher>> {
        return this.httpClient.get<Teacher>(environment.teacherUrl, { params: { username } }).pipe(
            map((data) => ({ success: true, data})),
            catchError((_) => of({ success: false, data: {} as Teacher }))
        );
    }

    getAssignments(username: string): Observable<APIResponse<Array<Assignment>>> {
        return this.httpClient.get<Array<APIAssignment>>(environment.assignments, { params: { username } }).pipe(
            map((data) => ({
                success: true,
                data: data.map((d, i) => ({...d, id: i + 1}))
            })),
            catchError((_) => of({ success: false, data: [] }))
        );
    }

    createAssignment(data: object): Observable<APIResponse<APIAssignment>> {
        return this.httpClient.post<APIAssignment>(environment.addAssignment, data).pipe(
            map((data) => ({ success: true, data })),
            catchError((_) => of({ success: false, data: {} as APIAssignment }))
        );
    }
}
