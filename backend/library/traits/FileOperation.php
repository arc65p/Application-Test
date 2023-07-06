    <?php

    trait FileOperation {
    private $csvFilePath;

    public function __construct($csvFilePath) {
        $this->csvFilePath = $csvFilePath;
    }
    //this method is used to read the cvs row wise
    private function readCSV() {
        $rows = [];
        if (($handle = fopen($this->csvFilePath, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $rows[] = $data; //to read the rows from the csv file
            }
            fclose($handle);
        }
        return $rows;
    }

    //this method is used to write in the csv file
    private function writeCSV($rows) {
        if (($handle = fopen($this->csvFilePath, "w")) !== FALSE) {
            foreach ($rows as $row) {
                fputcsv($handle, $row); //to write the data into csv file one by one
            }
            fclose($handle);
        }
    }
    }