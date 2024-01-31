import { Component, OnInit, TemplateRef } from '@angular/core';
import { Assignment, Teacher } from "../../../services/teachers/teacher.model";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { TeacherService } from "../../../services/teachers/teacher.service";
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from "@angular/forms";
import { DatePipe, NgClass, NgStyle } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-assignments',
  standalone: true,
    imports: [
        NgStyle,
        ReactiveFormsModule,
        NgClass,
        DatePipe,
        RouterLink
    ],
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.scss'
})
export class AssignmentsComponent implements OnInit {
    loaders = { isSaving: false, isLoadingDetails: false, isLoadingAssignments: false, isLoadingStudents: false };
    teacher: Teacher;
    studentNames: Array<string> = [];
    assignments: Array<Assignment> = [];
    modal: NgbModalRef;
    assignmentForm = new FormGroup({
        title: new FormControl("", { nonNullable: true, validators: [Validators.required]}),
        description: new FormControl([], { nonNullable: true, validators: [Validators.required]}),
        assignees: new FormControl("", { nonNullable: true, validators: [Validators.required]}),
        dueDate: new FormControl("", { nonNullable: true, validators: [Validators.required]})
    });
    expanded: Array<number> = [];

    constructor(private modalService: NgbModal, private service: TeacherService) {}

    ngOnInit(): void {
        this.loaders.isLoadingDetails = true;
        this.service.getTeacherDetails("").subscribe(
            (data) => {
                if (data.success) {
                    this.teacher = data.data;

                    this.loaders.isLoadingAssignments = true;
                    this.service.getAssignments(this.teacher.name).subscribe(
                        (assignData) => {
                            this.assignments = assignData.data;
                            this.loaders.isLoadingAssignments = false;
                        }
                    );
                }
                this.loaders.isLoadingDetails = false;
            }
        );
    }

    getStudents() {
        this.loaders.isLoadingStudents = true;
        this.service.getStudents(this.teacher.name).subscribe(
            (data) => {
                this.studentNames = data.data.map((student) => student.name);
                this.loaders.isLoadingStudents = false;
            }
        );
    }

    checkInputInValidity(control: FormControl, form: FormGroupDirective): boolean {
        return (control.invalid && control.touched) || (control.invalid && form.submitted);
    }

    openModal(ref: TemplateRef<void>) {
        if (this.studentNames.length < 1) {
            this.getStudents();
        }

        if (this.assignmentForm.touched) {
            this.assignmentForm.reset();
        }
        this.modal = this.modalService.open(ref, { size: "lg" });
    }

    closeModal() {
        this.modal.close();
    }

    addAssignment() {
        if (this.assignmentForm.valid) {
            this.loaders.isSaving = true;
            this.service.createAssignment(this.assignmentForm.value).subscribe(
                (data) => {
                    if (data.success) {
                        this.assignments.unshift({ ...data.data, id: this.assignments.length });
                        this.modal.close();
                    } else {
                        this.assignmentForm.setErrors({ 'saving': true });
                    }
                    this.loaders.isSaving = false;
                }
            );
        } else {
            this.assignmentForm.setErrors({ 'invalidDetails': true });
        }
    }

    expandDetails(id: number) {
        const index = this.expanded.findIndex((exp) => exp === id);

        if (index > -1) {
            this.expanded.splice(index, 1);
        } else {
            this.expanded.push(id);
        }
    }
}
