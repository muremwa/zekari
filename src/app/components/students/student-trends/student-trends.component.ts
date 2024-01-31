import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { Chart, ChartDataset, registerables } from "chart.js";
import { StudentService } from "../../../services/students/student.service";
import { Subscription } from "rxjs";
import Utility from "../../../services/shared/Utility";

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
                    const trends = Utility.processStudentChartDetails(data);
                    this.labels = trends.labels;
                    this.data = trends.data;

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
        this.chart = Utility.loadChartDetails(canvas, { labels: this.labels, data: this.data });
    }
}
