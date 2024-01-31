import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTrendsComponent } from './student-trends.component';

describe('StudentTrendsComponent', () => {
  let component: StudentTrendsComponent;
  let fixture: ComponentFixture<StudentTrendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentTrendsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
