import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneCollectionComponent } from './one-collection.component';

describe('OneCollectionComponent', () => {
  let component: OneCollectionComponent;
  let fixture: ComponentFixture<OneCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
