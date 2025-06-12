import { Component, Input, OnChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-bar-chart',
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent implements OnChanges {
  // @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // === Inputs for customization ===
  @Input() data: number[] = [];
  @Input() labels: string[] = [];
  @Input() xAxisLabel = '';
  @Input() yAxisLabel = '';
  @Input() chartTitle = '';
  @Input() barColor = 'rgba(75,192,192,0.8)';
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
      title: {
        display: !!this.chartTitle,
        text: this.chartTitle
      }
    },
    scales: {
      x: { title: { display: !!this.xAxisLabel, text: this.xAxisLabel } },
      y: { title: { display: !!this.yAxisLabel, text: this.yAxisLabel }, beginAtZero: true }
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
    this.barChartData = {
      labels: this.labels,
      datasets: [
        {
          data: this.data,
          backgroundColor: this.data.map(() => this.barColor)
        }
      ]
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
