import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEvent } from './my-event';

describe('MyEvent', () => {
  let component: MyEvent;
  let fixture: ComponentFixture<MyEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyEvent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
