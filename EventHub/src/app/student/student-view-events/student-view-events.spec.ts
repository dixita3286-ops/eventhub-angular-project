import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentViewEvents } from './student-view-events';

describe('StudentViewEvents', () => {
  let component: StudentViewEvents;
  let fixture: ComponentFixture<StudentViewEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentViewEvents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentViewEvents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
