<?php
trait Validation {
    public static function validateData($data) {
        if (!isset($data['name']) || empty($data['name'])) {
            throw new Exception('Name field is required');
          }
        
          if (preg_match('/[^a-zA-Z\s]/', $data['name'])) {
            throw new Exception('Name field should not contain special characters');
          }
          
          if (!isset($data['state']) || empty($data['state'])) {
            throw new Exception('State field is required');
          }
        
          if (!is_string($data['state'])) {
            throw new Exception('State must only contain alphabetic characters.');
          }

          if (strlen($data['state']) !== 2) {
            throw new Exception('State code should be two characters.');
          }
          
          
          if (!isset($data['zip']) || empty($data['zip'])) {
            throw new Exception('Zip field is required');
          }
          
          if (!is_numeric($data['zip'])) {
            throw new Exception('Zip field must be numeric');
          }

          if (!preg_match('/^[1-9][0-9]{5}$/', $data['zip'])) {
            throw new Exception('ZIP field should be in correct format');
          } 
          
          if (!isset($data['amount']) || empty($data['amount'])) {
            throw new Exception('Amount field is required');
          }
          
          if ( !is_float($data['amount'] + 0)) {
            throw new Exception('Amount field must be a float value');
          }
          
          
          if (!isset($data['qty']) || empty($data['qty'])) {
            throw new Exception('Qty field is required');
          }
          
          if (!is_numeric($data['qty'])) {
            throw new Exception('Qty field must be numeric');
          }
          
          if (!isset($data['item']) || empty($data['item'])) {
            throw new Exception('Item field is required');
          }
        
          if (!ctype_alnum($data['item'])) {
            throw new Exception('Item must be alphanumeric.');
          } 
    }
  }