import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPayment } from './student-payment';

describe('StudentPayment', () => {
  let component: StudentPayment;
  let fixture: ComponentFixture<StudentPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentPayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
