<?php
define("ROOT", __DIR__ );
require ROOT.'/.env.php';
require ROOT.'/vendor/autoload.php';

function connect_db() {
  $db = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);

  if (mysqli_connect_errno($db))
  {
    die("Database error!");
  } else {
    return $db;
  }
}

/**
 * RedBean PHP for database.
 */
$container = new Slim\Container;

/**
 * Use Twig templates.
 */
$container['view'] = function ($c) {
  $view = new Slim\Views\Twig(ROOT.'/views/', [
    'cache' => ROOT.'/cache/',
    'auto_reload' => true
  ]);
  $view->addExtension(new \Slim\Views\TwigExtension(
    $c['router'],
    $c['request']->getUri()
  ));
  return $view;
};

//Override the default Slim Not Found Handler
$container['notFoundHandler'] = function ($c) {
  return function ($request, $response) use ($c) {
    return $c['view']->render($response, '404.html', [])->withStatus(404);
  };
};

if(!DEBUG_MODE) {
  //Override the default Slim Error Handler
  $container['errorHandler'] = function ($c) {
    return function ($request, $response, $exception) use ($c) {
      return $c['view']->render($response, '500.html', [])->withStatus(500);
    };
  };

  // Handle other PHP exceptions
  function errorHandler() {
    header("Location: http://$_SERVER[HTTP_HOST]/500");
    die();
  }
}

/**
 * Initialize the app.
 */
$app = new Slim\App($container);

/**
 * Routes
 */
$app->get('/', function ($request, $response, $args) {
  return $this->view->render($response, 'index.html', []);
})->setName('home');

$app->get('/cities', function ($request, $response, $args) {
  $reply = array('error' => 0, 'data' => []);
  $sql = "SELECT City FROM Places GROUP BY City ;";
  $result = mysqli_query(connect_db(), $sql);

  $cities = [];
  while($row = mysqli_fetch_array($result)) {
    $city = htmlspecialchars(trim($row['City']));
    if(strlen($city) > 0) {
      array_push($cities, $city);
    }
  }
  sort($cities);
  $reply['data'] = $cities;

  return $response->withStatus(200)
    ->withHeader('Content-Type', 'application/json; charset=utf-8')
    ->write(json_encode($reply));
})->setName('cities');

$app->get('/types', function ($request, $response, $args) {
  $reply = array('error' => 0, 'data' => []);
  $sql = "SELECT Type FROM Places GROUP BY Type ;";
  $result = mysqli_query(connect_db(), $sql);

  $types = [];
  while($row = mysqli_fetch_array($result)) {
    $type = htmlspecialchars(trim($row['Type']));
    if(strlen($type) > 0) {
      array_push($types, $type);
    }
  }
  sort($types);
  array_unshift($types, SELECT_ALL_VALUE);
  $reply['data'] = $types;

  return $response->withStatus(200)
    ->withHeader('Content-Type', 'application/json; charset=utf-8')
    ->write(json_encode($reply));
})->setName('types');

$app->get('/specialities', function ($request, $response, $args) {
  $reply = array('error' => 0, 'data' => []);
  $sql = "SELECT Speciality FROM Places GROUP BY Speciality ;";
  $result = mysqli_query(connect_db(), $sql);

  $specialities = [];
  while($row = mysqli_fetch_array($result)) {
    $speciality = htmlspecialchars(trim($row['Speciality']));
    if(strlen($speciality) > 0) {
      array_push($specialities, $speciality);
    }
  }
  sort($specialities);
  array_unshift($specialities, SELECT_ALL_VALUE);
  $reply['data'] = $specialities;

  return $response->withStatus(200)
    ->withHeader('Content-Type', 'application/json; charset=utf-8')
    ->write(json_encode($reply));
})->setName('specialities');

$app->get('/districts', function ($request, $response, $args) {
  $reply = array('error' => 0, 'data' => []);
  $city = $request->getQueryParams()['city'];
  if(strlen($city) > 0)
	{
		$sql = "SELECT District FROM Places WHERE City LIKE '%$city%' GROUP BY District ;";
		$result = mysqli_query(connect_db(), $sql);

		if (!$result) {
      $reply['error'] = "حدث خطأ في البحث";
		} else {
			$districts = [];
			while($row = mysqli_fetch_array($result)) {
	  		$district = htmlspecialchars(trim($row['District']));
	  		if(strlen($district) > 0) {
	  			array_push($districts, $district);
	  		}
	  	}
      sort($districts);
      array_unshift($districts, SELECT_ALL_VALUE);
		  $reply['data'] = $districts;
		}
	} else {
		$reply['error'] = 'البيانات غير صحيحة';
	}

  return $response->withStatus(200)
    ->withHeader('Content-Type', 'application/json; charset=utf-8')
    ->write(json_encode($reply));
})->setName('districts');

$app->get('/places', function ($request, $response, $args) {
  $reply = array('error' => 0, 'data' => []);
  $selectors = array();
	$selector = "";

	$city = $request->getQueryParams()['city'];
	$district = $request->getQueryParams()['district'];
	$type = $request->getQueryParams()['type'];
	$speciality = $request->getQueryParams()['speciality'];

	if(strlen($city) > 0)
		array_push($selectors, "City LIKE '%$city%'");

	if( (strlen($district) > 0) && ($district != SELECT_ALL_VALUE) )
		array_push($selectors, "District LIKE '%$district%'");

	if( (strlen($type) > 0) && ($type != SELECT_ALL_VALUE) )
		array_push($selectors, "Type LIKE '%$type%'");

	if( (strlen($speciality) > 0) && ($speciality != SELECT_ALL_VALUE) )
		array_push($selectors, "Speciality LIKE '%$speciality%'");

	$selector = implode(" AND ", $selectors);
	$sql = "SELECT * FROM Places WHERE $selector ;";

	$result = mysqli_query(connect_db(), $sql);

	if (!$result) {
		$reply['error'] = "حدث خطأ في البحث";
	}
	else {
		$data = array();
		while($row = mysqli_fetch_array($result)) {
  		//populate data
  		$arr = array(
				'City' => htmlspecialchars($row['City']),
				'District' => htmlspecialchars($row['District']),
				'Type' => htmlspecialchars($row['Type']),
				'Name' => htmlspecialchars($row['Name']),
				'Speciality' => htmlspecialchars($row['Speciality']),
				'Address' => htmlspecialchars($row['Address']),
				'Phone1' => htmlspecialchars($row['Phone1']),
				'Phone2' => htmlspecialchars($row['Phone2'])
				);
  		array_push($data, $arr);
	  }
	  $reply['data'] = $data;
	}

  return $response->withStatus(200)
    ->withHeader('Content-Type', 'application/json; charset=utf-8')
    ->write(json_encode($reply));
})->setName('places');

$app->get('/500', function ($request, $response, $args) {
  return $this->view->render($response, '500.html')->withStatus(500);
})->setName('500');

/**
 * Run the app
 */
$app->run();

// mysqli_close($con);
?>
