import { Routes } from '@angular/router';
import { CertificationsComponent } from './components/certification-component/certification-component';
import { ChartDashboard } from './components/chart-dashboard/chart-dashboard';

export const routes: Routes = [
    { path: '', component: CertificationsComponent, title: 'DashBoard' },
       { path: '', component: ChartDashboard, title: 'Chart-DashBoard' },
];
