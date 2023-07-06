<?php

require_once './library/interfaces/ProductInterface.php';
require_once './library/traits/FileOperation.php';
require_once './library/traits/Validation.php';

class Product implements ProductInterface {
  use FileOperation,Validation;

  public function __construct($csvFilePath) {
    //create file if not exist
      if (!file_exists($csvFilePath)) {
        $file = fopen($csvFilePath, 'w');
        $header = array("id","name","state","zip","amount","qty","item");
        fputcsv($file, $header);
        fclose($file);
      }
        $this->csvFilePath = $csvFilePath;  
  }
  

//this method is used to add new user in csv
  public function create($data) {
   
    $this->validateData($data);

    $existingItems = array_column($this->readCSV(), 6);
    if (in_array($data['item'], $existingItems)) {
      throw new Exception('Item already exists.');
    }

    $rows = $this->readCSV();
   
    $lastId = end($rows)[0];
    
    unset($data['id']);
    $num_rows = count(file($this->csvFilePath));
    $id = $num_rows;
    if($id == 1){
    $lastId = 0;
    }

    // lastId is used to for autoincrement id
    $id = ++$lastId; 
    $ProductId = ['id' => $id]; //assigning auto increment value to id
    if(is_array($data)){
    $dataArr = array_merge($ProductId, $data);
    
    $rows[] = $dataArr; //assign product details to rows
    }
    
    $this->writeCSV($rows); //to add the new added product details in csv
    
    return $dataArr;
  }

  //this method is used to get all list from csv
  public function read() {
    $data = [];
    $rows = $this->readCSV();
    
    $count = 0;
      foreach ($rows as $row) {
        $count++;
        if($count == 1){
            continue; //to skip first row of csv i.e header
        }
        $data[] = array(
            'id' => $row[0],
            'name' => $row[1],
            'state' => $row[2],
            'zip' => $row[3],
            'amount' => $row[4],
            'qty' => $row[5],
            'item' => $row[6]
        );
          
      }
      return $data;
  }

  //this method is used to match the id and and update the data
  public function update($id, $data) {
    $this->validateData($data);
    $rows = $this->readCSV();
    $recordExist = 0;
    foreach ($rows as $k => $v) {
        if ($v[0] === $id) {
            $recordExist = 1;
        }
    }
    if ($recordExist == 0) {
        throw new Exception("Record not found with ID: " . $id);
    }
    foreach ($rows as &$row) {
        if ($row[0] == $id) {
            $row[1] = $data['name'];
            $row[2] = $data['state'];
            $row[3] = $data['zip'];
            $row[4] = $data['amount'];
            $row[5] = $data['qty'];
            $row[6] = $data['item'];
            $this->writeCSV($rows);
        }
    }
    return true;
  }

  //this method is used to delete the use row from csv
  public function delete($ids) {
     $ret = false;
      $rows = $this->readCSV();
     
      foreach ($rows as $index => $row) {
       
        if(in_array($row[0],$ids)){
              unset($rows[$index]); //unset row to delete from csv
              $this ->writeCSV($rows);
              $ret = true;
          }
      }
      return $ret;
  }
}