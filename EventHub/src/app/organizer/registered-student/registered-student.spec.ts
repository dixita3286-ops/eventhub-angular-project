import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredStudent } from './registered-student';

describe('RegisteredStudent', () => {
  let component: RegisteredStudent;
  let fixture: ComponentFixture<RegisteredStudent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisteredStudent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisteredStudent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
