import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ProductService } from 'src/app/services/product.service';
import { ConfirmDialogService } from 'src/app/confirm-dialog/confirm-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { ProductModel } from '../models/product';


@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent implements ICellRendererAngularComp {
  private params: any; //varible to store rendered row
  deleteProductId: any[] = []; //to store delete product Id
  @Output() editButtonClick: EventEmitter<ProductModel> = new EventEmitter<ProductModel>(); //get clicked row data to parent 

  constructor(private productService: ProductService, private confirmDialogService: ConfirmDialogService, private toastr: ToastrService) { }

  /**
   * Initializes the component with the provided parameters.
   * @param params The parameters for rendering this component.
   */
  agInit(params: any): void {
    this.params = params;
  }

  /**
   * Event handler for the delete button click.
   * @param event The event object.
   */
  btnClickedHandler(event: any) {
    this.deleteProductId.push(this.params.data.id); //push the id into deleteProductId that to be delete
    this.delete(this.deleteProductId); //call a function delete function to delete individual product
    const rowProduct: ProductModel = this.params.data; // Retrieve the data for the clicked row
    // Emit the deletion event
    this.productService.productDeletedSubject.next();
  }

  /**
   * Event handler for the edit button click.
   * Retrieves the data for the clicked row and emits the editButtonClick event.
   * @param event The event object.
   */
  btnEditClickedHandler(event: any) {
    const rowProduct: ProductModel = this.params.data; // Retrieve the data for the clicked row
    this.productService.transferRowProduct(rowProduct); // Transfer rowProduct to the data service
    this.editButtonClick.emit(this.params.node.data);
  }

  /**
   * Refreshes the component.
   * @returns A boolean indicating if the component should be refreshed.
   */
  refresh(): boolean {
    return false;
  }

  /**
   * Deletes the product with the provided ID.
   * @param value The ID of the product to be deleted.
   */
  delete(value: any) {
    this.productService.deleteProduct(value)
      .subscribe({
        next: (response: any) => {
          const result = response['data'];
          if (result == true) {
            setTimeout(() => {
              this.toastr.success('Product deleted successfully');
            }, 1000);
          } else {
            this.toastr.error('Something went wrong!');
          }
        },
        error: (err) => {
          this.toastr.error(err);
        }
      });

  }

  /**
   * Shows the confirm dialog for deleting the product.
   * @param event The event object.
   */
  showDialog(event: any) {
    this.confirmDialogService.confirmThis("Are you sure to delete?", () => {
      this.btnClickedHandler(event);
    }, function () {
    })
  }
}
