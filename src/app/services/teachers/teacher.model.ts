import { StudentClass } from "../shared/shared.model";

export interface Teacher {
    name: string;
    classes: Array<StudentClass>;
}

export interface APIAssignment {
    title: string;
    assignee: Array<string>;
    description: string;
    dueDate: Date;
}

export interface Assignment extends APIAssignment {
    id: number;
}
