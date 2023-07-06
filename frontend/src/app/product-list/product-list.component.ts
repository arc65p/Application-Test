import { Component, OnInit, Input, ViewChild, SimpleChanges } from '@angular/core';
import { ProductModel } from '../models/product';
import { ProductService } from '../services/product.service';
import { CellClickedEvent, ColDef, GridReadyEvent, IRowNode, IsRowSelectable, GridOptions, ColGroupDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { ActionComponent } from '../actions/action.component';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { AddProductComponent } from '../add-product/add-product.component';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, delay, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';




@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent {
  title = 'Green IT Application Challenge';

  //ag-grid columns details
  public columnDefs: (ColDef | ColGroupDef)[] = [

    {
      headerCheckboxSelection: true,
      checkboxSelection: true, field: 'id'
    },
    { field: 'name' },
    { field: 'state' },
    { field: 'zip', comparator: (valueA, valueB, nodeA, nodeB, isDescending) => valueA - valueB },
    { field: 'amount', comparator: (valueA, valueB, nodeA, nodeB, isDescending) => valueA - valueB },
    { field: 'qty', headerName: 'Quantity', comparator: (valueA, valueB, nodeA, nodeB, isDescending) => valueA - valueB },
    { field: 'item' },
    {
      field: 'Action',
      cellRenderer: ActionComponent,
    }
  ];

  // Default column definition for Ag-Grid
  public defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    filter: true,
  };

  public rowSelection: 'single' | 'multiple' = 'multiple';    // Row selection mode
  gridApiActive: any;    // Variable to store Ag-Grid API reference
  public paginationPageSize = 10; // Number of rows per page in pagination
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular; // Reference to Ag-Grid component
  searchText: any; // Variable to store the search text
  public ProductDetails!: ProductModel[];   // Array to store product details 
  selectedProducts: any = []; // Array to store selected products
  productIds: any[] = []; // Array to store the IDs of selected products for deletion
  gridOptions: GridOptions; // Grid options for Ag-Grid
  disable: boolean = true; // Variable to manage the delete button's disabled state
  private destroy$ = new Subject<void>(); // Subject for managing component destruction


  constructor(private productService: ProductService, private confirmDialogService: ConfirmDialogService, private toastr: ToastrService, public dialog: MatDialog) {
    this.gridOptions = {
      // GridOptions configuration
      onRowClicked: (event) => this.onRowClicked(event),
      suppressRowClickSelection: true,
    };
    this.ProductDetails = [];

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ProductDetails'] && changes['ProductDetails'].currentValue) {
      this.setRowData(changes['ProductDetails'].currentValue);
    }
  }

  /**
  * Sets the row data for the grid.
  * @param rowData The data to be set as row data.
  */
  private setRowData(rowData: ProductModel[]): void {
    if (this.gridApiActive) {
      this.gridApiActive.setRowData(rowData);
    }
  }

  ngOnInit() {

    this.getListProduct();
    this.subscribeToProductDeletion();

  }

  /**
  * Event handler for the grid's "onGridReady" event.
  * @param params The GridReadyEvent object containing the API reference.
  */
  onGridReady(params: GridReadyEvent<ProductModel[]>) {
    this.gridApiActive = params.api; // store product details in gridApiActive
  }

  /**
   * Retrieves the list of products from the ProductService.
   */
  getListProduct() {
    this.productService.getProduct().subscribe((result: ProductModel[]) => {
      this.ProductDetails = result;
    });
  }

  /**
   * Filters the grid based on the entered search text.
   */
  onFilterTextBoxChanged() {
    this.gridApiActive.setQuickFilter(this.searchText) // to search the text from all product details stored in gridApiActive variable

  }

  /**
  * Clears the selection of rows in the grid.
  */
  clearSelection(): void {
    this.agGrid.api.deselectAll();
  }

  /**
  * Event handler for the grid's "selectionChanged" event.
  * Updates the selectedProducts array and enables/disables the delete button.
  */
  onSelectionChanged() {
    this.disable = true;
    if (this.gridApiActive.getSelectedRows().length > 0) {
      this.disable = false;
    }
    this.selectedProducts = this.gridApiActive.getSelectedRows(); // store all select products in selectedProducts variable

  }

  /**
  * Removes the selected products from the list and triggers the delete operation.
  */
  removeProduct() {
    //extracting id from selected products
    this.selectedProducts.forEach((selectedProduct: any, index: number) => {
      //checking for duplicate id if not found then push the id to productIds variable
      if (this.productIds.indexOf(selectedProduct.id) === -1) {
        this.productIds.push(selectedProduct.id); // push all the product productIds to productIds variable to delete
      }
    });
    this.delete(this.productIds); // to delete multiple productIds
    this.disable = true;

  }


  /**
   * Deletes the selected products using the ProductService.
   * @param value The IDs of the products to be deleted.
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
  * Event handler for row click events in the grid.
  * Opens the edit product dialog when the "edit" action is clicked.
  * @param event The row click event.
  */
  onRowClicked(event: any): void {
    if (event.event.target.innerText === 'edit') {

      this.openEditProductDialog(event.data);
    }
  }

  /**
   * Displays a confirmation dialog before removing the selected products.
   */
  showDialog() {
    this.confirmDialogService.confirmThis("Are you sure to delete?", () => {
      this.removeProduct();
    }, function () {
    })
  }

  /**
  * Opens the dialog for adding a new product.
  */
  openAddProductDialog(): void {
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '800px',
      data: {} // Pass an empty object as data to the dialog
    });

    dialogRef.afterOpened().subscribe(() => {
      // Set the user object to have no values
      dialogRef.componentInstance.productForm.reset();

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getListProduct();
      }
    });
  }

  /**
  * Opens the dialog for editing a product.
  * @param product The product to be edited.
  */
  openEditProductDialog(product: ProductModel): void {
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '800px',
      data: product // Pass the product details as data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getListProduct();
      }
    });
  }

  /**
   * Subscribes to the product deletion event and updates the product list when a deletion occurs.
   */
  private subscribeToProductDeletion(): void {
    this.productService.productDeleted$
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300) // Add a delay of 300 milliseconds
      )
      .subscribe(() => {
        this.getListProduct();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
