import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortAllImagesComponent } from './sort-all-images.component';

describe('SortAllImagesComponent', () => {
  let component: SortAllImagesComponent;
  let fixture: ComponentFixture<SortAllImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortAllImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortAllImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
