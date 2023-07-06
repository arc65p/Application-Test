<?php
ini_set('display_errors', 1); ini_set('display_startup_errors', 1); error_reporting(E_ALL);
require_once './models/Product.php';
// Report all errors

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Headers: Access-Control-Allow-Origin, Content-Type');
header('Access-Control-Allow-Origin: *');


// this will be your backend
// some things this file should do
// get query string 
// handle get requests
// open and read data.csv file
// handle post requests
// (optional) write to csv file. 
// format data into an array of objects 
// return all data for every request. 
// set content type of response.
// return JSON encoded data

$api = new Product(__DIR__.'/public_html/data/data.csv');

require_once './controllers/Api.php';
