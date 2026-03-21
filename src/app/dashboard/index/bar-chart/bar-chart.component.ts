import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartType,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController
} from 'chart.js';

//  ──────────────────────────────────────────────────────────────────────────────
//  Register the controllers, elements, scales, and plugins you need
//  ──────────────────────────────────────────────────────────────────────────────
Chart.register(
  CategoryScale,    // <-- x-axis "category" scale
  LinearScale,      // <-- y-axis "linear" scale
  BarController,
  BarElement,       // <-- the bars themselves
  Title,            // <-- plugin: chart title
  Tooltip,          // <-- plugin: tooltips
  Legend            // <-- plugin: legend
);

@Component({
  selector: 'app-bar-chart',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent implements OnChanges {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  @Input() data: number[] = [];
  @Input() labels: string[] = [];
  @Input() xAxisLabel = '';
  @Input() yAxisLabel = '';
  @Input() chartTitle = '';
  @Input() barColor = 'rgba(70,90,247,0.8)';
  @Input() displayLegend = false;

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }]
  };
  public barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: this.displayLegend },
      title: { display: !!this.chartTitle, text: this.chartTitle }
    },
    scales: {
      // now Chart.js knows what "category" and "linear" mean
      x: { title: { display: !!this.xAxisLabel, text: this.xAxisLabel }, grid: { display: false } },
      y: { title: { display: !!this.yAxisLabel, text: this.yAxisLabel }, beginAtZero: true, grid: { display: false } }
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['data'] ||
      changes['labels'] ||
      changes['barColor'] ||
      changes['chartTitle'] ||
      changes['xAxisLabel'] ||
      changes['yAxisLabel'] ||
      changes['displayLegend']
    ) {
      this.updateChart();
    }
  }

  private updateChart() {
    const bg = Array.isArray(this.barColor)
      ? this.barColor
      : this.data.map(() => this.barColor);

    this.barChartData = {
      labels: this.labels,
      datasets: [{
        data: this.data,
        backgroundColor: bg //this.data.map(() => this.barColor)
      }]
    };

    this.barChartOptions = {
      responsive: true,
      plugins: {
        legend: { display: this.displayLegend },
        title: { display: !!this.chartTitle, text: this.chartTitle }
      },
      scales: {
        x: { title: { display: !!this.xAxisLabel, text: this.xAxisLabel } },
        y: { title: { display: !!this.yAxisLabel, text: this.yAxisLabel }, beginAtZero: true }
      }
    };

    this.chart?.update();
  }
}
