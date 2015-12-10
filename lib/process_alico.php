<?php

/*
  The process here depends on your Excel sheet format. Change it when needed.

  IMPORTANT! Remove or disable access to this file after processing for security.
*/


define('ROOT', __DIR__.'/..' );
require_once ROOT.'/.env.php';

/** Include PHPExcel_IOFactory */
require_once ROOT.'/vendor/phpoffice/phpexcel/Classes/PHPExcel/IOFactory.php';

/*
  Read file
*/
echo "Loading PHPExcel ...", PHP_EOL;
echo "Reading xlsx file ...", PHP_EOL;

$inputFileName = ROOT.'/data/alico_sheet.xlsx';  // File to read
$objPHPExcel = PHPExcel_IOFactory::load($inputFileName);
$sheetData = $objPHPExcel->getActiveSheet()->toArray(null,true,true,true);

/*
  Save records to DB
*/
echo "Opening database connection ...", PHP_EOL;

$con = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);
// Check connection
if (mysqli_connect_errno($con)) {
  die("Error opening database: " . mysqli_connect_error());
}

echo "Creating a new table ...", PHP_EOL;

// drop table if there is one already, then create a new one
mysqli_query($con,"DROP TABLE IF EXISTS Places");
mysqli_query($con,"CREATE TABLE Places(id INT NOT NULL AUTO_INCREMENT
                     , PRIMARY KEY(id)
                     , City VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci
                     , District VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci
                     , Type VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci
                     , Name VARCHAR(150) CHARACTER SET utf8 COLLATE utf8_general_ci
                     , Speciality VARCHAR(150) CHARACTER SET utf8 COLLATE utf8_general_ci
                     , Address VARCHAR(150) CHARACTER SET utf8 COLLATE utf8_general_ci
                     , Phone1 VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci
                     , Phone2 VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci
                     , Fax VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_general_ci )") or die(mysql_error());

echo "Saving places in database ...", PHP_EOL;

$count = 0;
foreach($sheetData as $rec)
{
  $count += 1;
  if ($count == 1)
    continue; // skip data row

  $City = $rec['A'];
  $District = $rec['B'];
  $Type = $rec['C'];
  $Name = $rec['D'];
  $Speciality = $rec['E'];
  $Address = $rec['F'];
  $Phone1 = $rec['G'];
  $Phone2 = $rec['H'];
  $Fax = $rec['I'];
  $sql = "INSERT INTO Places
          (City, District, Type, Name, Speciality, Address, Phone1, Phone2, Fax)
          VALUES
          ('$City', '$District', '$Type', '$Name', '$Speciality', '$Address', '$Phone1', '$Phone2', '$Fax')";
  if (!mysqli_query($con, $sql)) {
    die("Could not save place #$count: " . mysqli_sqlstate());
  }
  echo ".";
}
echo PHP_EOL;
echo "Done! Total places: $count", PHP_EOL;
?>
