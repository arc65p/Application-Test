import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog'; // Import MatDialogRef
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'; // Import FormBuilder and ReactiveFormsModule
import { AddProductComponent } from './add-product.component';
import { ProductListComponent } from '../product-list/product-list.component';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ToastrModule.forRoot()],
      declarations: [AddProductComponent, ProductListComponent],
      providers: [
        ToastrService,
        { provide: MatDialogRef, useValue: {} }, // Provide a mock MatDialogRef
        FormBuilder
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
