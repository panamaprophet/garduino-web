export type SummaryInterval = '10m' | '1h' | '1d';

export interface Reading {
    min: number;
    max: number;
    avg: number;
}

export interface SummaryBucket {
    start: string;
    end: string;
    readings: Partial<Record<string, Reading>>;
    events: Partial<Record<string, number>>;
}
