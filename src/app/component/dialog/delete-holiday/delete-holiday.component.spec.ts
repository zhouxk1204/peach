import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteHolidayComponent } from './delete-holiday.component';

describe('DeleteHolidayComponent', () => {
  let component: DeleteHolidayComponent;
  let fixture: ComponentFixture<DeleteHolidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteHolidayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
