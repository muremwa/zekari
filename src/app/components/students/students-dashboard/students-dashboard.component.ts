import { Component, OnInit } from '@angular/core';
import { Student, StudentMetrics, StudentResults } from "../../../services/students/student.model";
import { AuthService } from "../../../services/auth/auth.service";
import { StudentService } from "../../../services/students/student.service";
import { User } from "../../../services/auth/auth.models";
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-students-dashboard',
  standalone: true,
    imports: [
        RouterOutlet,
        RouterLink
    ],
  templateUrl: './students-dashboard.component.html',
  styleUrl: './students-dashboard.component.scss'
})
export class StudentsDashboardComponent implements OnInit{
    isLoading = false;
    student: Student;
    user: User;
    latestResults: StudentResults | null = null;

    constructor(private authService: AuthService, private studentService: StudentService) {}

    ngOnInit(): void {
        this.user = this.authService.user.getValue()!;
        this.isLoading = true;
        this.studentService.getStudentDetails(this.user.username).subscribe(
            (data) => {
                if (data.success) {
                    this.student = data.data;
                    this.processLatestResults();
                } else {
                    this.student = null as any;
                }
                this.isLoading = false;
            }
        );
    }

    private processLatestResults() {
        if (this.student && Array.isArray(this.student.results) && this.student.results.length > 0) {
            this.latestResults = this.student.results[0];
        }
    }

    getResultsArray(res: StudentMetrics): Array<[string, number]> {
        return Object.entries(res);
    }

    calculateAverage(result: StudentMetrics): number {
        const items = this.getResultsArray(result).map(([_, r]) => r);
        return items.length > 0? items.reduce((a, b) => a + b) / items.length: 0;
    }
}
