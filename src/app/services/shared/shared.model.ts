import { ChartDataset } from "chart.js";

export type StudentClass = "BABY CLASS" | "NURSERY" | "PRE-UNIT" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

export interface APIResponse<T> {
    success: boolean;
    data: T
}

export interface TrendModalItems {
    title: string;
    labels: Array<string>;
    data: Array<ChartDataset>;
}

export interface TrendChartData {
    labels: Array<string>,
    data: Array<ChartDataset>
}
