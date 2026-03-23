import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-chart-dashboard',
  imports: [],
  templateUrl: './chart-dashboard.html',
  styleUrl: './chart-dashboard.css',
})
export class ChartDashboard {

   chart: any = [];
  sampleData = [
    { hoseNo: 'H001', total_Receivable: 1000, total_Received: 700, due_Amount: 300, status: 'pending', last_Payment_Date: '2024-07-01', last_Payment_Days: 10 },
    { hoseNo: 'H002', total_Receivable: 1500, total_Received: 1500, due_Amount: 0, status: 'completed', last_Payment_Date: '2024-06-25', last_Payment_Days: 16 },
    { hoseNo: 'H003', total_Receivable: 1200, total_Received: 1000, due_Amount: 200, status: 'pending', last_Payment_Date: '2024-06-30', last_Payment_Days: 11 },
    { hoseNo: 'H004', total_Receivable: 1800, total_Received: 1800, due_Amount: 0, status: 'completed', last_Payment_Date: '2024-07-05', last_Payment_Days: 6 },
    { hoseNo: 'H005', total_Receivable: 1300, total_Received: 900, due_Amount: 400, status: 'pending', last_Payment_Date: '2024-07-02', last_Payment_Days: 9 }
  ];

    private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.prepareCharts();
  }

  private prepareCharts() { 
    this.cdr.detectChanges();
    this.initBarChart();
  }

  private initBarChart() {
    const ctx = document.getElementById('receivablesVsReceivedChart') as HTMLCanvasElement;
    const labels = this.sampleData.map(item => item.hoseNo);
    const receivableData = this.sampleData.map(item => item.total_Receivable);
    const receivedData = this.sampleData.map(item => item.total_Received);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total Receivable',
            data: receivableData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Total Received',
            data: receivedData,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}
