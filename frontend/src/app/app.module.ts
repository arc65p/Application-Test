import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './product-list/product-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CorsInterceptor } from '../app/cors.interceptor';
import { MatTableModule } from '@angular/material/table';
import { ValidateFloatDirective } from './validate-float.directive';
import { AgGridModule } from 'ag-grid-angular';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActionComponent } from './actions/action.component';
import { ConfirmDialogModule } from './confirm-dialog/confirm-dialog.module';
import { AlphanumericDirective } from './alphanumeric.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr';
import { AddProductComponent } from './add-product/add-product.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ValidateFloatDirective,
    ActionComponent,
    AlphanumericDirective,
    AddProductComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule,
    FormsModule,
    AgGridModule,
    MatSortModule,
    BrowserAnimationsModule,
    ConfirmDialogModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ToastrModule.forRoot({
      timeOut: 3000, // Set the timeout for each toast notification
      positionClass: 'toast-top-right', // Set the position of the toast notifications
      preventDuplicates: true, // Prevent duplicate toast notifications
      closeButton: true,

    }),
    ReactiveFormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: CorsInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
