<?php


$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uriSegments = explode( '/', $uri );
$methodName = $uriSegments[4];
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true); 
$result = array("status"=>200);

// mehods will be called on the basis of called apis
switch ($methodName) {
  case 'get':
    //this method is called to get user list
    $productList = $api->read();

    $result["message"] = "user list";
    $result["data"] = $productList;

      break;
  case 'add':
   try {
    //this method is called to create new user
      $createdProduct = $api->create($data);
     
      $result["message"] = "added successfully!";
      $result["data"] = $createdProduct;
     
    } catch (Exception $e) {
      $result = array("status"=>400,"message"=> $e->getMessage());
    }
      break;
  case 'edit':
    try{
    //this method is called to update existing user
      $updatedProduct = $api->update($data['id'],$data);

      $result["message"] = "updated successfully!";
      $result["data"] = $updatedProduct;
     


    } catch(Exception $e) {
      $result = array("status"=>400,"message"=> $e->getMessage());

    }
      break;
  case 'delete':
    try{
      //this method is called to delete user
      $deletedProduct = $api->delete($data);
     
      $result["message"] = "deleted successfully!";
      $result["data"] = $deletedProduct;

    } catch(Exception $e) {
      $result = array("status"=>400,"message"=> $e->getMessage());
    }
      break;
  default:
    $result = array('status'=>400,'message'=> 'no such method found');
      break;
}
echo json_encode($result,true);


  
