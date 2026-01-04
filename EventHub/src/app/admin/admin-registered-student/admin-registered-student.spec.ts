import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRegisteredStudent } from './admin-registered-student';

describe('AdminRegisteredStudent', () => {
  let component: AdminRegisteredStudent;
  let fixture: ComponentFixture<AdminRegisteredStudent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRegisteredStudent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRegisteredStudent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
