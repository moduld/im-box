import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewImageComponent } from './add-new-image.component';

describe('AddNewImageComponent', () => {
  let component: AddNewImageComponent;
  let fixture: ComponentFixture<AddNewImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
