<?php
use Codeception\Test\Unit;

require_once './models/Product.php';

class ProductTest extends Unit
{
    /**
     * @var \UnitTester
     */
    protected $tester;

    protected function _before()
    {
         $this->csvFilePath = './public_html/data/dataTest.csv';
         $this->product = new Product($this->csvFilePath);
         touch($this->csvFilePath);
        
    }


    public function testCreateProductWithValidData()
    {
        $data = [
            'name' => 'Product onne',
            'state' => 'UK',
            'zip' => '123456',
            'amount' => '10.99',
            'qty' => '5',
            'item' => 'Item011'
        ];

        $result = $this->product->create($data);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('id', $result, 'The created product should have an ID');
        $this->assertEquals($data['name'], $result['name'], 'The created product name does not match');
        $this->assertEquals($data['state'], $result['state'], 'The created product state does not match');
        $this->assertEquals($data['zip'], $result['zip'], 'The created product zip does not match');
        $this->assertEquals($data['amount'], $result['amount'], 'The created product amount does not match');
        $this->assertEquals($data['qty'], $result['qty'], 'The created product quantity does not match');
        $this->assertEquals($data['item'], $result['item'], 'The created product item does not match');
    }

    public function testCreateProductWithInvalidData()
    {
        $data = [
            'name' => '', // Invalid: empty name
            'state' => 'UK',
            'zip' => 'abcdef', // Invalid: non-numeric zip
            'amount' => '10.99',
            'qty' => '5',
            'item' => 'Item 1'
        ];

        $this->expectException(Exception::class);

         $this->product->create($data);
    }

    public function testReadProducts()
    {
        $result =  $this->product->read();
        $this->assertIsArray($result);
        $this->assertNotEmpty($result);
        foreach ($result as $product) {
            $this->assertArrayHasKey('id', $product, 'The product should have an ID');
            $this->assertArrayHasKey('name', $product, 'The product should have a name');
            $this->assertArrayHasKey('state', $product, 'The product should have a state');
            $this->assertArrayHasKey('zip', $product, 'The product should have a zip code');
            $this->assertArrayHasKey('amount', $product, 'The product should have an amount');
            $this->assertArrayHasKey('qty', $product, 'The product should have a quantity');
            $this->assertArrayHasKey('item', $product, 'The product should have an item');
        }
    }
    
    public function testUpdateProduct()
    {
        $productId = "1"; 
        $data = [
            'name' => 'Updated Product',
            'state' => 'FK',
            'zip' => '654321',
            'amount' => '19.99',
            'qty' => '10',
            'item' => 'Item002'
        ];
    
        $result =  $this->product->update($productId, $data);
       

        $this->assertTrue($result);
    }
    
    public function testUpdateNonExistingProduct()
    {
        $nonExistingProductId = 999; 
    
        $this->expectException(Exception::class);
    
         $this->product->update($nonExistingProductId, []);
    }
    
    public function testDeleteProduct()
    {
        
        $productId = 1; 
        $result =  $this->product->delete([$productId]);
    
        $this->assertTrue($result);
    }
    
    
    public function testDeleteNonExistingProduct()
    {
        $nonExistingProductId = 999; // Assuming there's no product with ID 999
    
        $result =  $this->product->delete([$nonExistingProductId]);
    
        $this->assertFalse($result);
    }

    public function testCreateProductWithSpecialCharactersInName()
    {
        $data = [
            'name' => 'Product #1', // Invalid: special characters in name
            'state' => 'UK',
            'zip' => '123456',
            'amount' => '10.99',
            'qty' => '5',
            'item' => 'Item 1'
        ];

        $this->expectException(Exception::class);
        $this->product->create($data);
    }

    public function testCreateProductWithNonAlphanumericItem()
    {
        // Test creating a product with non-alphanumeric item
        $data = [
            'name' => 'Product one',
            'state' => 'UK',
            'zip' => '123456',
            'amount' => '10.99',
            'qty' => '5',
            'item' => 'Item #1' // Invalid: non-alphanumeric item
        ];

        $this->expectException(Exception::class);

        $this->product->create($data);
    }

    public function testReadEmptyProducts()
    {

        $result =  $this->product->read();

        $this->assertIsArray($result);
        $this->assertEmpty($result);
        $this->assertSame([], $result);
    }

    public function testUpdateProductWithInvalidData()
    {
        $productId = 1; // Assuming there's a product with ID 1 in the CSV
        $data = [
            'name' => '', // Invalid: empty name
            'state' => 'FK',
            'zip' => 'abcdef', // Invalid: non-numeric zip
            'amount' => '19.99',
            'qty' => '10',
            'item' => 'Updated Item'
        ];

        $this->expectException(Exception::class);

         $this->product->update($productId, $data);
    }

    public function testReadProductsEmptyFile()
    {

        $result =  $this->product->read();

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function testCreateProductWithNonNumericZip()
    {
        $data = [
            'name' => 'Product 1',
            'state' => 'UK',
            'zip' => 'ABC123', // Invalid: non-numeric zip
            'amount' => '10.99',
            'qty' => '5',
            'item' => 'Item 1'
        ];

        $this->expectException(Exception::class);

        $this->product->create($data);
        $this->expectExceptionMessage("Zip code must be a numeric value");

    }

    public function testCreateProductWithNegativeAmount()
    {
        $data = [
            'name' => 'Product 1',
            'state' => 'UK',
            'zip' => '123456',
            'amount' => '-10.99', // Invalid: negative amount
            'qty' => '5',
            'item' => 'Item 1'
        ];

        $this->expectException(Exception::class);

        $this->product->create($data);
        $this->expectExceptionMessage("Amount must be a positive number");
    }

    public function testCreateProductWithNegativeQty()
    {
        $data = [
            'name' => 'Product 1',
            'state' => 'UK',
            'zip' => '123456',
            'amount' => '10.99',
            'qty' => '-5', // Invalid: negative quantity
            'item' => 'Item 1'
        ];

        $this->expectException(Exception::class);

        $this->product->create($data);
        $this->expectExceptionMessage("Quantity must be a positive number");
    }

    public function testCreateProductWithInvalidState()
    {
        $data = [
            'name' => 'Product 1',
            'state' => 'XYZV1', // Invalid: Unknown state
            'zip' => '123456',
            'amount' => '10.99',
            'qty' => '5',
            'item' => 'Item 1'
        ];

        $this->expectException(Exception::class);

        $this->product->create($data);
    }

    public function testUpdateProductWithEmptyData()
    {
        $productId = 1; 
        
        $this->expectException(Exception::class);
        
         $this->product->update($productId, []);
    }
    
    public function testDeleteMultipleProductsIncludingNonExisting()
    {
        $productIds = [1, 999]; // Assuming there's a product with ID 1 and no product with ID 999
    
        $result =  $this->product->delete($productIds);
    
        $this->assertFalse($result);
    }
    

}
