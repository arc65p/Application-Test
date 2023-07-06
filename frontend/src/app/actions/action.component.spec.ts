import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionComponent } from './action.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { ToastrService } from 'ngx-toastr';


describe('ActionComponent', () => {
  let component: ActionComponent;
  let fixture: ComponentFixture<ActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ActionComponent ],
      providers: [ConfirmDialogService,
        ToastrService,
        { provide: ToastrService, useValue: {} }
      ]

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
