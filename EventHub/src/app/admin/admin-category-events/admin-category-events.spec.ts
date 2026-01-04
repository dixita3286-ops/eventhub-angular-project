import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCategoryEvents } from './admin-category-events';

describe('AdminCategoryEvents', () => {
  let component: AdminCategoryEvents;
  let fixture: ComponentFixture<AdminCategoryEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCategoryEvents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCategoryEvents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
