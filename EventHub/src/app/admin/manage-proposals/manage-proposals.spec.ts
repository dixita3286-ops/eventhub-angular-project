import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProposals } from './manage-proposals';

describe('ManageProposals', () => {
  let component: ManageProposals;
  let fixture: ComponentFixture<ManageProposals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageProposals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProposals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
