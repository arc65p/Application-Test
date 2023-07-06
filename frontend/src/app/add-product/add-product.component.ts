import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../services/product.service';
import { ProductModel } from '../models/product';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  isEditMode: boolean = false;

  Product: ProductModel = {
    id: 0,
    name: '',
    state: '',
    zip: '',
    amount: 0,
    qty: 0,
    item: '',
  };
  productDetails: any; //variable to store data in observable to update row in data list
  productList: ProductModel[] = [];
  productForm!: FormGroup;


  constructor(private productService: ProductService, private toastr: ToastrService, public dialogRef: MatDialogRef<AddProductComponent>, private formBuilder: FormBuilder) {
  }

  ngOnInit() {

    // on click on every edit button product details populating to the form
    this.productService.rowProduct$.subscribe((productDetails: ProductModel[]) => {
      this.productDetails = productDetails; // Receive updated productDetails from the data service
    });

    this.productService.productList$.subscribe((response: ProductModel[]) => {
      this.productList = response; // Update the local productList variable with the received data
    });

    this.productForm = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      state: ['', [Validators.required, Validators.maxLength(2)]],
      zip: ['', [Validators.required, Validators.pattern('[1-9][0-9]{5}')]],
      amount: ['', [Validators.required, Validators.pattern('[0-9]+(\.[0-9]{1,2})?')]],
      qty: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      item: ['', [Validators.required]]
    });

    this.setFormValues();

  }

  /**
   * Handles the form submission.
   * If the form is valid, it either creates a new product or updates an existing product based on the form values.
   */
  onSubmit() {
    if (this.productForm.valid) {

      const productItem = this.productForm.value.item;
      const productId = this.productForm.value.id;

      // Check if the ID already exists in the productList
      const idExists = this.productList.find((product: ProductModel) => product.item === productItem && product.id !== productId);

      if (idExists) {
        this.toastr.error('Item already exist');
      }
      else {
        if (this.productForm.value.id == null) {
          //if value of form id is null then add user will work
          this.productService.createProduct(this.productForm.value)
            .subscribe({
              next: (response: any) => {
                const status = response['status'];
                if (status == 200) {
                  setTimeout(() => {
                    this.toastr.success('Product saved successfully');
                  }, 1000);
                  this.dialogRef.close(true);
                } else {
                  this.toastr.error(response['message']);
                }
              },
              error: (err) => {
                this.toastr.error(err);
              }
            });
        } else {
          //if vlaue of form id is not null then update user will work
          this.productService.updateProduct(this.productForm.value)
            .subscribe({
              next: (response: any) => {
                const data = response['data'];
                if (data) {
                  setTimeout(() => {
                    this.toastr.success('Product updated successfully');
                  }, 1000);
                  this.dialogRef.close(true);
                } else {
                  this.toastr.error("something went wrong!");
                }
              },
              error: (err) => {
                this.toastr.error(err);
              }
            });
        }
        this.productForm.reset();
      }
    }


  }

  /**
   * Sets the form values based on the product details.
   * If productDetails exist, it populates the form with the details for editing.
   * If productDetails are null, it resets the form.
   */

  setFormValues() {
    if (this.productDetails) {
      this.productForm.patchValue({
        id: this.productDetails.id,
        name: this.productDetails.name,
        state: this.productDetails.state,
        zip: this.productDetails.zip,
        amount: this.productDetails.amount,
        qty: this.productDetails.qty,
        item: this.productDetails.item
      });
      this.isEditMode = true;
    } else {
      this.isEditMode = false;
    }
  }

  /**
   * Closes the dialog and clears the form inputs.
   */
  onCancel(): void {
    this.dialogRef.close();
  }
}
