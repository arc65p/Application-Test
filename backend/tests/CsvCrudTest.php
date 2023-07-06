<?php
use \backend\index;

class CsvCrudTest extends \PHPUnit\Framework\TestCase {
    use CSVOperations;
    
    public function setUp(): void {
        parent::setUp();
        $this->filename = 'data.csv';
        $this->truncateFile();
    }
    
    public function tearDown(): void {
        parent::tearDown();
        $this->truncateFile();
    }
    
    public function testCreate() {
        $data = array(
            'name' => 'archana rathore',
            'state' => 'u.p',
            'zip' => '989322',
            'amount' => '1000',
            'qty' => '30',
            'item' => 'JSHD0920'
        );
        $result = $this->create($data);
        $this->assertNotNull($result);
        $this->assertArrayHasKey('id', $result);
        $this->assertEquals('archana rathore', $result['name']);
        $this->assertEquals('U.P', $result['state']);
        $this->assertEquals('989322', $result['zip']);
        $this->assertEquals('1000', $result['amount']);
        $this->assertEquals('30', $result['qty']);
        $this->assertEquals('JSHD0920', $result['item']);
    }

    public function testRead() {
        $data = array(
            'name' => 'pihu rathore',
            'state' => 'u.p',
            'zip' => '92893',
            'amount' => '3000',
            'qty' => '90',
            'item' => 'ARC87333'
        );
        $this->saveRecord($data);
        $result = $this->read(1);
        $this->assertNotNull($result);
        $this->assertEquals(1, $result['id']);
        $this->assertEquals('pihu rathore', $result['name']);
        $this->assertEquals('U.P', $result['state']);
        $this->assertEquals('989322', $result['zip']);
        $this->assertEquals('1000', $result['amount']);
        $this->assertEquals('30', $result['qty']);
        $this->assertEquals('JSHD0920', $result['item']);
    }

    public function testUpdate() {
        $data = array(
            'name' => 'jiw kjd',
            'state' => 'u.p',
            'zip' => '98394',
            'amount' => '3000',
            'qty' => '90',
            'item' => 'ARC87333'
        );
        $this->saveRecord($data);
        $data = array(
            'name' => 'owiue ajk',
            'state' => 'Karnataka',
            'zip' => '23239',
            'amount' => '5999',
            'qty' => '10',
            'item' => 'ARC84353'
        );
        $result = $this->update(1, $data);
        $this->assertNotNull($result);
        $this->assertEquals(1, $result['id']);
        $this->assertEquals('owiue ajk', $result['name']);
        $this->assertEquals('Karnataka', $result['state']);
        $this->assertEquals('23239', $result['zip']);
        $this->assertEquals('5999', $result['amount']);
        $this->assertEquals('10', $result['qty']);
        $this->assertEquals('ARC84353', $result['item']);
    }

    public function testDelete() {
        $data = array(
           'name' => 'owiue ajk',
            'state' => 'Karnataka',
            'zip' => '23239',
            'amount' => '5999',
            'qty' => '10',
            'item' => 'ARC84353'
        );
        $this->saveRecord($data);
        $result = $this->delete(1);
        $this->assertTrue($result);
        $result = $this->read(1);
        $this->assertNull($result);
    }
    
    protected function getRecords(): array {
        $rows = array_map('str_getcsv', file($this->filename));
        $keys = array_shift($rows);
        $records = array();
        foreach ($rows as $row) {
            $record = array_combine($keys, $row);
            $record['id'] = (int)$record['id'];
            $records[] = $record;
        }
        return $records;
    }
    
    protected function saveRecords(array $records): void {
        $fp = fopen($this->filename, 'w');
        fputcsv($fp, array_keys(reset($records)));
        foreach ($records as $record) {
            fputcsv($fp, $record);
        }
        fclose($fp);
    }
    
    protected function saveRecord(array $record): void {
        $records = $this->getRecords();
        $records[] = $record;
        $this->saveRecords($records);
    }
    
    protected function truncateFile(): void {
        $fp = fopen($this->filename, 'w');
        fclose($fp);
        }
        }
