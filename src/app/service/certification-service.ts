
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { Certification } from '../models/cert.model';
import { Data } from '../data/data.mock';
import { environment } from '../../environments/environment.development';


@Injectable({ providedIn: 'root' })
export class CertificationService {
  private pageSize = environment.pagesize;
  private currentPageSubject = new BehaviorSubject<number>(1);
  currentPage$ = this.currentPageSubject.asObservable();

  getCertifications(): Observable<Certification[]> {
     return of(Data);
   }

  getPagedData(): Observable<Certification[]> {
    return this.currentPage$.pipe(
      map(page => {
        const start = (page - 1) * this.pageSize;
        return Data.slice(start, start + this.pageSize);
      })
    );
  }

  setPage(page: number) {
    this.currentPageSubject.next(page);
  }

  get totalPages(): number {
    return Math.ceil(Data.length / this.pageSize);
  }

  get portfolioAverage(): number {
    const total = Data.reduce((acc, curr) => acc + curr.rating, 0);
    return parseFloat((total / Data.length).toFixed(2));
  }
}
