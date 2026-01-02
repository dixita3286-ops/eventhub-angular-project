import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyEventsOrg } from './modify-events-org';

describe('ModifyEventsOrg', () => {
  let component: ModifyEventsOrg;
  let fixture: ComponentFixture<ModifyEventsOrg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyEventsOrg]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyEventsOrg);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
