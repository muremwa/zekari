import { Component, OnInit } from '@angular/core';
import { Student } from "../../../services/students/student.model";
import { Teacher } from "../../../services/teachers/teacher.model";
import { TeacherService } from "../../../services/teachers/teacher.service";
import { AdminService } from "../../../services/admin/admin.service";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
    loaders = { isLoadingStudents: false, isLoadingTeachers: false };
    students: Array<Student> = [];
    teachers: Array<Teacher> = [];
    analytics: { periods: Array<string>; subjects: Array<string>; averages: Array<Array<number>> } = {
        periods: [],
        subjects: [],
        averages: []
    };

    constructor(private teacherService: TeacherService, private service: AdminService) {}

    ngOnInit(): void {
        this.loaders.isLoadingStudents = true;
        this.teacherService.getStudents("").subscribe(
            (data) => {
                this.students = data.data;
                this.loaders.isLoadingStudents = false;
                this.calculateResultsAverage();
            }
        );

        this.loaders.isLoadingTeachers = true;
        this.service.getTeachers().subscribe(
            (data) => {
                this.teachers = data.data;
                this.loaders.isLoadingTeachers = false;
            }
        );

    }

    calculateResultsAverage() {
        const res = this.students.map((st) => st.results).flat();
        const periods = [...new Set(res.map((r) => r.period))];
        const subjects = [...new Set(res.map((r) => Object.keys(r.results)).flat())];
        const rawData: Array<Array<number>> = Array.from(Array(periods.length), () => []);

        // loop through all periods
        periods.forEach((p, pi) => {
            // these are the results for all students in each period
            const periodResults = res.filter((r) => r.period === p).map((r) => r.results);

            // loop through all subjects, and get all score for the subject by all students
            rawData[pi] = subjects.map((s) => {
                const scores = periodResults.map((personResult) => {
                    const sc = Object.entries(personResult).find(([sb, sc]) => sb === s);
                    return sc? sc[1]: 0
                });
                return scores.length > 0? scores.reduce((a, b) => a + b) / scores.length: 0;
            });
        });

        this.analytics = {
            periods,
            subjects,
            averages: rawData,
        }

        console.log(this.analytics)
    }

    combineAveragesAndPeriods(averages: Array<Array<number>>, periods: Array<string>): Array<Array<string | number>> {
        return averages.map((av, i) => [periods[i], ...av])
    }
}
