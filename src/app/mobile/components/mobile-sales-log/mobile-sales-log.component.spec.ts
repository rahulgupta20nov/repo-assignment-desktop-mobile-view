import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileSalesLogComponent } from './mobile-sales-log.component';

describe('MobileSalesLogComponent', () => {
  let component: MobileSalesLogComponent;
  let fixture: ComponentFixture<MobileSalesLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileSalesLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileSalesLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
