import { Component, OnInit, TemplateRef } from '@angular/core';
import { Teacher } from "../../../services/teachers/teacher.model";
import { Student, StudentResults } from "../../../services/students/student.model";
import { TeacherService } from "../../../services/teachers/teacher.service";
import { AuthService } from "../../../services/auth/auth.service";
import { User } from "../../../services/auth/auth.models";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TrendModalItems } from "../../../services/shared/shared.model";
import { Chart, registerables } from "chart.js";
import Utility from "../../../services/shared/Utility";

@Component({
    selector: 'app-teacher-dashboard',
    standalone: true,
    imports: [],
    templateUrl: './teacher-dashboard.component.html',
    styleUrl: './teacher-dashboard.component.scss'
})
export class TeacherDashboardComponent implements OnInit {
    loaders = { isLoadingDetails: false, isLoadingStudents: false };
    teacher: Teacher;
    students: Array<Student> = [];
    user: User;
    modal: NgbModalRef;
    modalDetails: TrendModalItems = {
        title: "Anaylse",
        labels: [],
        data: []
    }
    chart: Chart;

    constructor(private modalService: NgbModal, private service: TeacherService, private authService: AuthService) {
        Chart.register(...registerables);
    }

    ngOnInit(): void {
        this.user = this.authService.user.getValue()!;
        this.loaders.isLoadingDetails = true;

        this.service.getTeacherDetails(this.user.username).subscribe(
            (data) => {
                if (data.success) {
                    this.teacher = data.data;

                    this.loaders.isLoadingStudents = true;
                    this.service.getStudents(this.user.username).subscribe(
                        (studentsData) => {
                            this.students = studentsData.data;
                            this.loaders.isLoadingStudents = false;
                        }
                    );
                }
                this.loaders.isLoadingDetails = false;
            }
        );
    }

    calculateAverage(studentResult: StudentResults): number {
        const scores = Object.values(studentResult.results);
        return scores.length > 0? scores.reduce((a, b) => a + b) / scores.length: 0;
    }

    closeModal() {
        this.modalDetails = { labels: [], data: [], title: "Select a student" };
        if (this.chart) {
            this.chart.destroy();
        }
        this.modal.close();
    }

    openModal(ref: TemplateRef<void>, student: Student) {
        const details = Utility.processStudentChartDetails([...student.results].reverse());
        this.modalDetails = {
            title: `Analyse ${student.name}: Class ${student.grade}`,
            labels: details.labels,
            data: details.data
        };

        this.modal = this.modalService.open(ref, { size: "xl" });
        this.chart = Utility.loadChartDetails(
            (document.getElementById("trends-chart") as HTMLCanvasElement).getContext("2d")!,
            { labels: this.modalDetails.labels, data: this.modalDetails.data }
        );
    }
}
