import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsribeButtonComponent } from './subsribe-button.component';

describe('SubsribeButtonComponent', () => {
  let component: SubsribeButtonComponent;
  let fixture: ComponentFixture<SubsribeButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsribeButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsribeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
