import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCollectionComponent } from './add-new-collection.component';

describe('AddNewCollectionComponent', () => {
  let component: AddNewCollectionComponent;
  let fixture: ComponentFixture<AddNewCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
