import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartData,
  ChartOptions,
  ChartType,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  PieController
} from 'chart.js';

// register just what we need
Chart.register(PieController, ArcElement, Tooltip, Legend, Title);
@Component({
  selector: 'app-pie-chart',
  imports: [
    BaseChartDirective
  ],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.scss'
})
export class PieChartComponent implements OnChanges {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  /** numeric values for each slice */
  @Input() data: number[] = [];

  /** labels for each slice */
  @Input() labels: string[] = [];

  /** colors for each slice (one-to-one with `data`) */
  @Input() backgroundColors: string[] = [];

  /** chart title */
  @Input() title = '';

  /** whether to show the legend */
  @Input() displayLegend = true;

  public pieChartType: ChartType = 'pie';

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: []
      }
    ]
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      title: {
        display: !!this.title,
        text: this.title
      },
      legend: {
        display: this.displayLegend,
        position: 'bottom'
      },
      tooltip: {
        enabled: true
      }
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['data'] ||
      changes['labels'] ||
      changes['backgroundColors'] ||
      changes['title'] ||
      changes['displayLegend']
    ) {
      this.updateChart();
    }
  }

  private updateChart() {
    this.pieChartData = {
      labels: this.labels,
      datasets: [
        {
          data: this.data,
          backgroundColor: this.backgroundColors.length
            ? this.backgroundColors
            : this.data.map((_, i) => this.defaultColor(i))
        }
      ]
    };

    this.pieChartOptions = {
      responsive: true,
      plugins: {
        title: { display: !!this.title, text: this.title },
        legend: { display: this.displayLegend, position: 'bottom' },
        tooltip: { enabled: true }
      }
    };

    this.chart?.update();
  }

  /** fallback color palette */
  private defaultColor(index: number): string {
    const palette = [
      '#3366CC', '#DC3912', '#FF9900', '#109618',
      '#990099', '#3B3EAC', '#0099C6', '#DD4477'
    ];
    return palette[index % palette.length];
  }
}
