import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryEvent } from './category-event';

describe('CategoryEvent', () => {
  let component: CategoryEvent;
  let fixture: ComponentFixture<CategoryEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryEvent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
