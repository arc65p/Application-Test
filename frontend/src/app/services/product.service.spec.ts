import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { ProductModel } from '../models/product';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';


describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products', () => {
    const dummyResponse = {
      data: [
        {
          id: 1,
          name: 'John siwe',
          state: 'KL',
          zip: '202222',
          amount: 1033.10,
          qty: 10,
          item: 'AOIR20000'
        },
        {
          id: 2,
          name: 'Rahul s',
          state: 'UP',
          zip: '928943',
          amount: 1033.10,
          qty: 101,
          item: 'AOIR20000'
        },
        {
          id: 3,
          name: 'Goos j',
          state: 'MH',
          zip: '849384',
          amount: 1033.10,
          qty: 3,
          item: 'AOIR20000'
        }
      ]
    };

    service.getProduct().subscribe(products => {
      expect(products.length).toBe(3);
      expect(products[0].name).toBe('John siwe');
      expect(products[1].id).toBe(2);
    });

    const req = httpMock.expectOne(`${service.URL}get`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should transfer row product', () => {
    const product: ProductModel = {
      id: 3,
      name: 'John siwe',
      state: 'Maharastra',
      zip: '928943',
      amount: 1033.10,
      qty: 101,
      item: 'AOIR20000'
    };

    service.transferRowProduct(product);

    service.rowProduct$.subscribe(rowProduct => {
      expect(rowProduct).toEqual(product);
    });
  });

  it('should create a product', () => {
    const product: ProductModel = {
      id: 3,
      name: 'John siwe',
      state: 'Maharastra',
      zip: '928943',
      amount: 1033.10,
      qty: 101,
      item: 'AOIR20000'
    };

    service.createProduct(product).subscribe(createdProduct => {
      expect(createdProduct).toEqual(product);
    });

    const req = httpMock.expectOne(`${service.URL}add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(product);
    req.flush(product);
  });

  it('should update a product', () => {
    const product: ProductModel = {
      id: 3,
      name: 'John siwe',
      state: 'Maharastra',
      zip: '928943',
      amount: 1033.10,
      qty: 11,
      item: 'AOIR20000'
    };

    service.updateProduct(product).subscribe(updatedProduct => {
      expect(updatedProduct).toEqual(product);
    });

    const req = httpMock.expectOne(`${service.URL}edit`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(product);
    req.flush(product);
  });

  it('should delete a product', () => {
    const productId = 1;

    service.deleteProduct(productId).subscribe(deletedProduct => {
      expect(deletedProduct).toBeNull();
    });

    const req = httpMock.expectOne(`${service.URL}delete`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(productId);
    req.flush(null);

    service.productDeleted$.subscribe(() => {
      expect().nothing(); 
    });
  });
 
  it('should handle error when getting products', () => {
    const errorMessage = 'Error occurred while fetching products.';
    
    service.getProduct().subscribe(
      () => {
        fail('The request should have thrown an error.');
      },
      (error: HttpErrorResponse) => {
        expect(error.error).toBe(errorMessage);
      }
    );
  
    const req = httpMock.expectOne(`${service.URL}get`);
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle error when creating a product', () => {
    const product: ProductModel = {
      id: 3,
      name: 'John siwe',
      state: 'Maharastra',
      zip: '928943',
      amount: 1033.10,
      qty: 101,
      item: 'AOIR20000'
    };
    const errorMessage = 'Error occurred while creating the product.';
    
    service.createProduct(product).subscribe(
      () => {
        fail('The request should have thrown an error.');
      },
      (error: HttpErrorResponse) => {
        expect(error.error).toBe(errorMessage);
      }
    );
  
    const req = httpMock.expectOne(`${service.URL}add`);
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle error when deleting a product', () => {
  const productId = 1;
  const errorMessage = 'Error occurred while deleting the product.';
  
  service.deleteProduct(productId).subscribe(
    () => {
      fail('The request should have thrown an error.');
    },
    (error: HttpErrorResponse) => {
      expect(error.error).toBe(errorMessage);
    }
  );

  const req = httpMock.expectOne(`${service.URL}delete`);
  req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
});

it('should handle error when creating a product with invalid data', () => {
  const product: ProductModel = {
    id: 3,
    name: '',
    state: 'Maharastra',
    zip: '928943',
    amount: 1033.10,
    qty: 101,
    item: 'AOIR20000'
  };
  const errorMessage = 'Invalid product data.';
  
  service.createProduct(product).subscribe(
    () => {
      fail('The request should have thrown an error.');
    },
    (error: HttpErrorResponse) => {
      expect(error.error).toBe(errorMessage);
    }
  );
  
  const req = httpMock.expectOne(`${service.URL}add`);
  req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
});

it('should handle error when updating a non-existing product', () => {
  const product: ProductModel = {
    id: 99,
    name: 'John siwe',
    state: 'Maharastra',
    zip: '928943',
    amount: 1033.10,
    qty: 11,
    item: 'AOIR20000'
  };
  const errorMessage = 'Product not found.';
  
  service.updateProduct(product).subscribe(
    () => {
      fail('The request should have thrown an error.');
    },
    (error: HttpErrorResponse) => {
      expect(error.error).toBe(errorMessage);
    }
  );
  
  const req = httpMock.expectOne(`${service.URL}edit`);
  req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
});

it('should handle error when deleting a non-existing product', () => {
  const productId = 99;
  const errorMessage = 'Product not found.';
  
  service.deleteProduct(productId).subscribe(
    () => {
      fail('The request should have thrown an error.');
    },
    (error: HttpErrorResponse) => {
      expect(error.error).toBe(errorMessage);
    }
  );
  
  const req = httpMock.expectOne(`${service.URL}delete`);
  req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
});
it('should handle error when creating a product with duplicate data', () => {
  const product: ProductModel = {
    id: 3,
    name: 'John siwe',
    state: 'Maharastra',
    zip: '928943',
    amount: 1033.10,
    qty: 101,
    item: 'AOIR20000'
  };
  const errorMessage = 'Product with the same item already exists.';
  
  service.createProduct(product).subscribe(
    () => {
      fail('The request should have thrown an error.');
    },
    (error: HttpErrorResponse) => {
      expect(error.error).toBe(errorMessage);
    }
  );
  
  const req = httpMock.expectOne(`${service.URL}add`);
  req.flush(errorMessage, { status: 409, statusText: 'Conflict' });
});
it('should handle error when updating a product with server error', () => {
  const product: ProductModel = {
    id: 3,
    name: 'John siwe',
    state: 'Maharastra',
    zip: '928943',
    amount: 1033.10,
    qty: 11,
    item: 'AOIR20000'
  };
  const errorMessage = 'Internal server error occurred while updating the product.';
  
  service.updateProduct(product).subscribe(
    () => {
      fail('The request should have thrown an error.');
    },
    (error: HttpErrorResponse) => {
      expect(error.error).toBe(errorMessage);
    }
  );
  
  const req = httpMock.expectOne(`${service.URL}edit`);
  req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
});
it('should handle error when deleting a product with server error', () => {
  const productId = 1;
  const errorMessage = 'Internal server error occurred while deleting the product.';
  
  service.deleteProduct(productId).subscribe(
    () => {
      fail('The request should have thrown an error.');
    },
    (error: HttpErrorResponse) => {
      expect(error.error).toBe(errorMessage);
    }
  );
  
  const req = httpMock.expectOne(`${service.URL}delete`);
  req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
});



});
