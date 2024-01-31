import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { Chart, ChartDataset, registerables } from "chart.js";
import { StudentService } from "../../../services/students/student.service";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-student-trends',
    standalone: true,
    imports: [],
    templateUrl: './student-trends.component.html',
    styleUrl: './student-trends.component.scss'
})
export class StudentTrendsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild("trendsModal") trendsModal: TemplateRef<HTMLDivElement>;
    $resultsSub: Subscription;
    modal: NgbModalRef;
    chart: Chart;
    data: Array<ChartDataset> = [];
    labels: Array<string> = [];

    constructor(private modalService: NgbModal, private router: Router, private service: StudentService) {
        Chart.register(...registerables);
    }

    ngOnInit(): void {
        this.$resultsSub = this.service.results.subscribe(
            (_data) => {
                const data = [..._data].reverse();

                if (data.length > 0) {
                    this.labels = data.map((res) => res.period);
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

                    this.data = datasetLabels.map((label, i) => {
                        const labelColour = `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')}`;

                        return {
                            label,
                            data: rawData[i],
                            backgroundColor: labelColour,
                            borderColor: labelColour,
                            yAxisID: 'yAxis1'
                        }
                    });
                    const canvas = this.getCanvas();
                    if (canvas) {
                        this.loadChart(canvas);
                    }
                }
            }
        );
    }

    ngOnDestroy(): void {
        this.$resultsSub.unsubscribe();
    }

    ngAfterViewInit(): void {
        if (this.trendsModal) {
            this.modal = this.modalService.open(this.trendsModal, { size: "xl", keyboard: false, backdrop: "static" });

            const canvas = this.getCanvas();
            if (!this.chart && canvas) {
                this.loadChart(canvas);
            }
        }
    }

    getCanvas() {
        const c = (document.getElementById("trends-chart") as HTMLCanvasElement);
        return c? c.getContext('2d'): null;
    }

    closeModal() {
        this.router.navigate(['students']).then((_) => this.modal.close());
    }

    loadChart(canvas: CanvasRenderingContext2D) {
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(canvas, {
            type: 'line',
            data: { labels: this.labels, datasets: this.data },
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
}
