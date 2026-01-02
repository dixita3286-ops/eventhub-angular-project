import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEventDetails } from './student-event-details';

describe('StudentEventDetails', () => {
  let component: StudentEventDetails;
  let fixture: ComponentFixture<StudentEventDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentEventDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentEventDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
