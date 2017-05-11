import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgPickoutComponent } from './ng-pickout.component';

describe('NgPickoutComponent', () => {
  let component: NgPickoutComponent;
  let fixture: ComponentFixture<NgPickoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgPickoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgPickoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
