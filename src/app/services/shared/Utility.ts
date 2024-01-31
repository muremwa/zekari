import { Chart } from "chart.js";
import { StudentResults } from "../students/student.model";
import { TrendChartData } from "./shared.model";

export default class Utility {
    static loadChartDetails(canvas: CanvasRenderingContext2D, details: TrendChartData): Chart {
        return  new Chart(canvas, {
            type: 'line',
            data: { labels: details.labels, datasets: details.data },
            options: {
                plugins: {
                    legend: { display: true, position: 'right' }
                },
                scales: {
                    yAxis1: { type: 'linear', position: 'left' },
                    yAxis2: { type: 'linear', position: 'right' },
                }
            }
        });
    }

    static processStudentChartDetails(data: Array<StudentResults>): TrendChartData {
        const labels = data.map((res) => res.period);
        const datasetLabels = [...new Set(data.map((res) => Object.keys(res.results)).flat())];
        const rawData: Array<Array<number>> = Array.from(Array(datasetLabels.length), () => []);

        data.forEach((res) => {
            const items = Object.entries(res.results);

            items.forEach(([subject, score]) => {
                const subjectIndex = datasetLabels.findIndex((label) => label === subject);

                if (subjectIndex > -1) {
                    rawData[subjectIndex].push(score)
                }
            })
        });

        const dataset = datasetLabels.map((label, i) => {
            const labelColour = `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`;

            return {
                label,
                data: rawData[i],
                backgroundColor: labelColour,
                borderColor: labelColour,
                yAxisID: 'yAxis1'
            }
        });

        // averages
        dataset.push({
            label: 'Average',
            data: data.map((res) => {
                const scores = Object.entries(res.results).map(([_, sc]) => sc);
                return scores.length > 0 ? (scores.reduce((a, b) => a + b) / scores.length) : 0;
            }),
            backgroundColor: "#008080",
            borderColor: "#0b1111",
            yAxisID: "yAxis2"
        })

        return { labels, data: dataset }
    }
}
