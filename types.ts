
export enum AppState {
    Introduction,
    Questionnaire,
    Results,
}

export interface AnswerOption {
    text: string;
    score: number;
    description: string;
}

export interface EnneagramType {
    id: number;
    name: string;
    keywords: string;
    questions: string[];
}

export interface Scores {
    [key: string]: number;
}
