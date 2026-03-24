
// import { Component, OnInit, OnDestroy, inject, ElementRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
// import { Chart, registerables } from 'chart.js';
// import { Subscription } from 'rxjs';
// import { CertificationService } from '../../service/certification-service';

// Chart.register(...registerables);

// @Component({
//   selector: 'app-chart-dashboard',
//   standalone: true,
// templateUrl: './chart-dashboard.html',
//  styleUrl: './chart-dashboard.css',
// })
// export class ChartDashboard implements OnInit, OnDestroy {

//    @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
//    // New Input to toggle between Paginated and Full data
//   @Input() showAll: boolean = false;

//   private certService = inject(CertificationService);
//   private el = inject(ElementRef);
//   private chart: Chart | undefined;
//   private sub: Subscription | undefined;

//   // This handles the highlight when coming FROM the parent (table row click)
//   @Input() set activeIndex(value: number | null) {
//     this.applyVisualHighlight(value);
//   }

//   @Output() rowSelected = new EventEmitter<{ index: number | null, data?: any }>();

//   private readonly BASE_COLOR = 'rgba(99, 8, 94, 0.7)';
//   private readonly FADED_COLOR = 'rgba(99, 8, 94, 0.15)';
//   private chartData: any[] = [];

//   // ngOnInit() {
//   //   this.sub = this.certService.getPagedData().subscribe((data) => {
//   //     this.chartData = data;
//   //     this.buildChart(data);
//   //   });
//   // }


//   ngOnInit() {
//     // Logic to select the correct data stream
//     const dataObservable = this.showAll 
//       ? this.certService.getCertifications()  // Assume you have this method in your service
//       : this.certService.getPagedData();

//     this.sub = dataObservable.subscribe((data) => {
//       console.log(data);
//       this.chartData = data;
//       this.buildChart(data);
//     });
//   }


//   private buildChart(data: any[]) {
//    // const canvas = document.getElementById('certificateChart') as HTMLCanvasElement;
//      const canvas = this.chartCanvas.nativeElement;
//     if (!canvas) return;

//     if (this.chart) this.chart.destroy();

//     this.chart = new Chart(canvas, {
//       type: 'bar',
//       data: {
//         labels: data.map((i) => i.buildingName),
//         datasets: [{
//           label: 'Rating',
//           data: data.map((i) => i.rating),
//           // Initialize with base colors for all
//           backgroundColor: data.map(() => this.BASE_COLOR),
//           borderColor: 'rgb(1, 10, 15)',
//           borderWidth: 1,
//         }],
//       },
//       options: {
//         indexAxis: 'y',
//         responsive: true,
//         maintainAspectRatio: false,
//         onClick: (event, elements) => {
//           if (elements.length > 0) {
//             // Chart.js 4.x uses elements[0].index
//             const clickedIndex = elements[0].index;
//             this.rowSelected.emit({ index: clickedIndex, data: this.chartData[clickedIndex] });
//           } else {
//             this.rowSelected.emit({ index: null });
//           }
//         },
//         plugins: { legend: { display: false } }
//       }
//     });
//   }

//   private applyVisualHighlight(index: number | null) {
//     if (!this.chart) return;
    
//     const dataset = this.chart.data.datasets[0];
    
//     if (index === null) {
//       // RESET: Everyone gets BASE_COLOR
//       dataset.backgroundColor = this.chartData.map(() => this.BASE_COLOR);
//     } else {
//       // HIGHLIGHT: Logic to set colors row by row
//       dataset.backgroundColor = this.chartData.map((_, i) => 
//         i === index ? this.BASE_COLOR : this.FADED_COLOR
//       );
//     }
    
//     this.chart.update('none'); // Update without re-triggering entrance animations
//   }

//   ngOnDestroy() {
//     this.sub?.unsubscribe();
//     if (this.chart) this.chart.destroy();
//   }
// }
import { Component, OnInit, OnDestroy, inject, ElementRef, Input, Output, EventEmitter, ViewChild, AfterViewInit, NgModule } from '@angular/core';
import { Chart, registerables } from 'chart.js'; // Fixed typo
import { Subscription } from 'rxjs';
import { CertificationService } from '../../service/certification-service';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-chart-dashboard',
  imports : [CommonModule],
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
  private pendingIndex: number | null = null; // Store index if it arrives before chart is ready

  @Input() set activeIndex(value: number | null) {
    this.pendingIndex = value;
    this.applyVisualHighlight(value);
  }

  @Output() rowSelected = new EventEmitter<{ index: number | null, data?: any }>();

  private readonly BASE_COLOR = 'rgba(99, 8, 94, 0.7)';
  private readonly FADED_COLOR = 'rgba(99, 8, 94, 0.15)';

  ngOnInit() {
    const dataObservable = this.showAll 
      ? this.certService.getCertifications() 
      : this.certService.getPagedData();

    this.sub = dataObservable.subscribe((data) => {
   //  console.log('Data count received:', data.length);
      this.chartData = data;
      // Use a small timeout or wait for next tick to ensure ViewChild is ready
      setTimeout(() => {
        this.buildChart(data);
        // Apply highlight if one was requested while data was loading
        if (this.pendingIndex !== null) this.applyVisualHighlight(this.pendingIndex);
      }, 0);
    });
  }

  private buildChart(data: any[]) {
    debugger;
    console.log(data.length);
    const canvas = this.chartCanvas?.nativeElement;
    if (!canvas) return;

// const wrapper = document.getElementById('chartCanvas');
//     if (wrapper) {
//       wrapper.style.height = `${data.length * 40}px`;
//     }


    if (this.chart) this.chart.destroy();

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.map((i) => i.buildingName),
        datasets: [{
          label: 'Rating',
          data: data.map((i) => i.rating),
          backgroundColor: data.map(() => this.BASE_COLOR),
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
    dataset.backgroundColor = this.chartData.map((_, i) => 
      index === null || i === index ? this.BASE_COLOR : this.FADED_COLOR
    );
    
    this.chart.update('none'); 
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    if (this.chart) this.chart.destroy();
  }
}
