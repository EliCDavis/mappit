import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTopoComponent } from './create-topo.component';

describe('CreateTopoComponent', () => {
  let component: CreateTopoComponent;
  let fixture: ComponentFixture<CreateTopoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTopoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTopoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
