import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificationService } from '../../service/certification-service';
import { Certification } from '../../models/cert.model';
import { MatIconModule } from '@angular/material/icon';
import { ChartDashboard } from '../chart-dashboard/chart-dashboard';

@Component({
  selector: 'app-certification-component',
  standalone: true,
  imports: [CommonModule, MatIconModule, ChartDashboard],
  templateUrl: './certification-component.html',
  styleUrl: './certification-component.css',
})
export class CertificationsComponent implements OnInit {
  certs: Certification[] = [];
  portfolioAverage: number = 0;
  // Define these variables in your class
  currentPage: number = 1;
  pageSize: number = 10; // Items per page
  maxVisibleButtons: number = 3;

  constructor(public certService: CertificationService) {}

  ngOnInit() {
    this.certService.getCertifications().subscribe((data) => {
      this.certs = data;
      this.portfolioAverage = this.calculateAverage(data);
    });
  }
  formatDateString(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  calculateAverage(data: Certification[]): number {
    if (!data.length) return 0;
    const total = data.reduce((acc, curr) => acc + curr.rating, 0);
    return parseFloat((total / data.length).toFixed(2));
  }
  getStars(rating: number): number[] {
    return [1, 2, 3, 4, 5, 6];
  }

  getComparisonClass(val: string): string {
    if (!val) return 'text-muted';
    if (val.includes('+')) return 'text-success';
    if (val.includes('-')) return 'text-danger';
    return 'text-muted';
  }

  //pagination Logic start

  get totalPages(): number {
    return Math.ceil(this.certs.length / this.pageSize);
  }

  // Data to show on current page
  get pagedCerts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.certs.slice(startIndex, startIndex + this.pageSize);
  }

  // Logic to show only 3 buttons
  get visiblePages(): number[] {
    const total = this.totalPages;
    const max = this.maxVisibleButtons;
    let start = Math.max(1, this.currentPage - Math.floor(max / 2));
    let end = start + max - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - max + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  //pagination Logic end
}
