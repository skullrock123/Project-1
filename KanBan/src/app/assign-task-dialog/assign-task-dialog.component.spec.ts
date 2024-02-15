import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTaskDialogComponent } from './assign-task-dialog.component';

describe('AssignTaskDialogComponent', () => {
  let component: AssignTaskDialogComponent;
  let fixture: ComponentFixture<AssignTaskDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignTaskDialogComponent]
    });
    fixture = TestBed.createComponent(AssignTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
