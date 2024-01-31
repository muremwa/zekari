import { StudentClass } from "../shared/shared.model";

export type StudentMetrics = { [subject: string ]: number };

export interface StudentResults {
    period: string;
    results: StudentMetrics;
}

export interface Student {
    name: string;
    grade: StudentClass;
    results: Array<StudentResults>;
}
