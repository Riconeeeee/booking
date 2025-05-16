<?php
    header('Content-Type: application/json');

    $data = json_decode(file_get_contents("php://input"), true);

    if ($_SERVER["REQUEST_METHOD"] != "POST") {
      http_response_code(405);
      echo json_encode(['message' => 'Method Not Allowed']);
      exit;
    }

    if (empty($data['motorcycleId']) || empty($data['startDate']) || empty($data['endDate']) || empty($data['name']) || empty($data['email']) || empty($data['phone'])) {
      http_response_code(400);
      echo json_encode(['message' => 'All fields are required']);
      exit;
    }

    $motorcycleId = intval($data['motorcycleId']);
    $startDate = $data['startDate'];
    $endDate = $data['endDate'];
    $name = htmlspecialchars($data['name']);
    $email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars($data['phone']);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      http_response_code(400);
      echo json_encode(['message' => 'Invalid email format']);
      exit;
    }

    $motorcycles = [
      1 => ['name' => 'Honda CBR600RR', 'price' => 75],
      2 => ['name' => 'Yamaha R6', 'price' => 80],
      3 => ['name' => 'Kawasaki Ninja ZX-6R', 'price' => 85]
    ];

    if (!array_key_exists($motorcycleId, $motorcycles)) {
      http_response_code(400);
      echo json_encode(['message' => 'Invalid motorcycle selection']);
      exit;
    }

    $startDateTimestamp = strtotime($startDate);
    $endDateTimestamp = strtotime($endDate);

    if ($startDateTimestamp === false || $endDateTimestamp === false) {
      http_response_code(400);
      echo json_encode(['message' => 'Invalid date format']);
      exit;
    }

    if ($startDateTimestamp >= $endDateTimestamp) {
      http_response_code(400);
      echo json_encode(['message' => 'End date must be after start date']);
      exit;
    }

    $diffInDays = ($endDateTimestamp - $startDateTimestamp) / (60 * 60 * 24);
    $totalPrice = $motorcycles[$motorcycleId]['price'] * $diffInDays;

    $confirmation = [
      'motorcycleId' => $motorcycleId,
      'startDate' => $startDate,
      'endDate' => $endDate,
      'name' => $name,
      'email' => $email,
      'phone' => $phone,
      'totalPrice' => $totalPrice
    ];

    echo json_encode($confirmation);
    ?>
