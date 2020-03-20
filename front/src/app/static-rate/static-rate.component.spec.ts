import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticRateComponent } from './static-rate.component';

describe('StaticRateComponent', () => {
  let component: StaticRateComponent;
  let fixture: ComponentFixture<StaticRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaticRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
