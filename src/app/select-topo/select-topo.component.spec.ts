import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTopoComponent } from './select-topo.component';

describe('SelectTopoComponent', () => {
  let component: SelectTopoComponent;
  let fixture: ComponentFixture<SelectTopoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTopoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTopoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
