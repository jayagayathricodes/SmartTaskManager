export interface Task {
    id?: number;
    title: string;
    description: string;
    category: string;
    dueDate: Date;
    isCompleted: boolean;
}