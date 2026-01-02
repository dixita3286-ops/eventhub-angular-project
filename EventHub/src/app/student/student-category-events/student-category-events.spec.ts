import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCategoryEvents } from './student-category-events';

describe('StudentCategoryEvents', () => {
  let component: StudentCategoryEvents;
  let fixture: ComponentFixture<StudentCategoryEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentCategoryEvents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentCategoryEvents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
