
import { Component, OnInit, OnDestroy, inject, ElementRef, Input, Output, EventEmitter, ViewChild, AfterViewInit, NgModule } from '@angular/core';
import { Chart, registerables } from 'chart.js'; // Fixed typo
import { Subscription } from 'rxjs';
import { CertificationService } from '../../service/certification-service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';

Chart.register(...registerables);

@Component({
  selector: 'app-chart-dashboard',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './chart-dashboard.html',
  styleUrl: './chart-dashboard.css',
})
export class ChartDashboard implements OnInit, OnDestroy {
  // Use static: false to ensure the canvas is available after the view initializes
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() showAll: boolean = false;

  private certService = inject(CertificationService);
  private chart: Chart | undefined;
  private sub: Subscription | undefined;
  private chartData: any[] = [];
  private pendingIndex: number | null = null; 
  @Input() set activeIndex(value: number | null) {
    this.pendingIndex = value;
    this.applyVisualHighlight(value);
  }

  @Output() rowSelected = new EventEmitter<{ index: number | null, data?: any }>();

 // private readonly BASE_COLOR = environment.BASE_COLOR;
 // private readonly FADED_COLOR = environment.FADED_COLOR;
  private readonly reduceOpacityValue = environment.reduceOpacityValue;
 private readonly BASE_COLOR = environment.BASE_COLOR;
 private readonly originalOpacity = environment.originalOpacity;
    private readonly originalColor = environment.BASE_COLOR;
 

  ngOnInit() {
    const dataObservable = this.showAll
      ? this.certService.getCertifications()
      : this.certService.getPagedData();
    this.sub = dataObservable.subscribe((data) => {
    console.log('Data count received:', data.length);
      this.chartData = data;
      // Use a small timeout or wait for next tick to ensure ViewChild is ready
      setTimeout(() => {
        this.buildChart(data);
        if (this.pendingIndex !== null) this.applyVisualHighlight(this.pendingIndex);
      }, 0);
    });
  }

  private buildChart(data: any[]) {
    console.log(data.length);
    const canvas = this.chartCanvas?.nativeElement;
    if (!canvas) return;
    const dynamicHeight = data.length * 35;
    const container = canvas.parentElement;
    if (container) {
      container.style.height = `${dynamicHeight}px`;
    }

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.map((i) => i.buildingName),
        datasets: [{
          label: 'Rating',
          data: data.map((i) => i.rating),
          backgroundColor: data.map(() => this.originalColor),
          borderColor: 'rgb(1, 10, 15)',
          borderWidth: 1,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const clickedIndex = elements[0].index;
            this.rowSelected.emit({ index: clickedIndex, data: this.chartData[clickedIndex] });
          } else {
            this.rowSelected.emit({ index: null });
          }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  private applyVisualHighlight(index: number | null) {
    if (!this.chart) return;

    const dataset = this.chart.data.datasets[0];
    dataset.backgroundColor = this.chartData.map((_, i) =>{ 
     // index === null || i === index ? this.BASE_COLOR : this.FADED_COLOR

       if (index === null || i === index) {
           return this.reduceOpacity(this.originalColor, this.originalOpacity);
        }
          return this.reduceOpacity(this.originalColor, this.reduceOpacityValue);
      });
      
    this.chart.update('none');
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    if (this.chart) this.chart.destroy();
  }

  private reduceOpacity(color: string, opacity: number): string {
    const rgbaRegex = /rgba?\((\d+), (\d+), (\d+), (\d*\.?\d+)\)/;
    const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
 
    if (rgbaRegex.test(color)) {
      const match = color.match(rgbaRegex);
      if (match) return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${opacity})`;
    } else if (hexRegex.test(color)) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  }
 
}
