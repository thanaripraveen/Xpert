import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedocumentsComponent } from './savedocuments.component';

describe('SavedocumentsComponent', () => {
  let component: SavedocumentsComponent;
  let fixture: ComponentFixture<SavedocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavedocumentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavedocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
