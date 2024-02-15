import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskToMemberComponent } from './add-task-to-member.component';

describe('AddTaskToMemberComponent', () => {
  let component: AddTaskToMemberComponent;
  let fixture: ComponentFixture<AddTaskToMemberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTaskToMemberComponent]
    });
    fixture = TestBed.createComponent(AddTaskToMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
