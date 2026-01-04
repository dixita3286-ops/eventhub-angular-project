import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminModifyEvents } from './admin-modify-events';

describe('AdminModifyEvents', () => {
  let component: AdminModifyEvents;
  let fixture: ComponentFixture<AdminModifyEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminModifyEvents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminModifyEvents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
