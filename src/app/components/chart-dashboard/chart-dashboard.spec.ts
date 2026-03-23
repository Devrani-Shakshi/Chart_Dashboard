import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartDashboard } from './chart-dashboard';

describe('ChartDashboard', () => {
  let component: ChartDashboard;
  let fixture: ComponentFixture<ChartDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
