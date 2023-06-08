import { Component, Input } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass'],
})
export class ChartComponent {
  @Input() chartData!: ChartData<any, any[], string>;
  @Input() chartLabels: string[] = [];
  chartType = 'pie';
  chartOptions = {
    responsive: true,
  };
}
