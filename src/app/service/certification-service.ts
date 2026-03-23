
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Certification } from '../models/cert.model';
import { Data } from '../data/data.mock';
 
@Injectable({
    providedIn : 'root'
})
 
export class CertificationService {
    constructor() {}
   
     getCertifications(): Observable<Certification[]> {
      return of(Data);
  }
} 