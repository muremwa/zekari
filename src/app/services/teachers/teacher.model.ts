import { StudentClass } from "../shared/shared.model";

export interface Teacher {
    name: string;
    classes: Array<StudentClass>;
}
