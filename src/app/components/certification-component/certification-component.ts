import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ChartDashboard } from '../chart-dashboard/chart-dashboard';
import { CertificationService } from '../../service/certification-service';
import { Certification } from '../../models/cert.model';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-certification-component',
  standalone: true,
  imports: [CommonModule, MatIconModule, ChartDashboard],
  templateUrl: './certification-component.html',
  styleUrl: './certification-component.css',
})
export class CertificationsComponent implements OnInit {
  private certService = inject(CertificationService);
  pagedCerts: Certification[] = [];
  public allCertifications: Certification[] = [];
  currentPage = 1;
  portfolioAverage: number = 0;
  maxVisibleButtons = environment.maxVisibleButtons;
  selectedRowIndex: number | null = null;
  ngOnInit() {
    this.certService.getPagedData().subscribe((data) => {
      this.pagedCerts = data;
      this.portfolioAverage = this.calculateAverage(data);
    });

    this.certService.currentPage$.subscribe((page) => (this.currentPage = page));
    this.certService.getCertifications().subscribe((data) => {
      this.allCertifications = data;
    });
  }

  // 1. Handle selection coming FROM the Chart
  handleChartSelection(event: { index: number | null }) {
    this.selectedRowIndex = event.index;
  }

  // 2. Handle selection coming FROM a Grid Row click
  onRowClick(index: number, event: MouseEvent) {
    event.stopPropagation(); // Prevents the global "click away" reset
    this.selectedRowIndex = index;
  }

  // 3. Global Click: Reset if user clicks anywhere else on the page
  @HostListener('document:click')
  onGlobalClick() {
    this.selectedRowIndex = null;
  }

  calculateAverage(certs: Certification[]): number {
    if (!certs.length) return 0;
    const total = certs.reduce((sum, cert) => sum + (cert.rating || 0), 0);
    return parseFloat((total / certs.length).toFixed(2));
  }
  

getStars(rating: number) {
  return Array.from({ length: rating }, (_, i) => i + 1);
}
 



  formatDateString(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  getComparisonClass(val: string) {
    if (val?.includes('+')) return 'text-success';
    if (val?.includes('-')) return 'text-danger';
    return 'text-muted';
  }

  // pagination
  get totalPages() {
    return this.certService.totalPages;
  }
  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.certService.setPage(page);
    }
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const max = this.maxVisibleButtons;

    // Calculate sliding window
    let start = Math.max(1, this.currentPage - Math.floor(max / 2));
    let end = start + max - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - max + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
