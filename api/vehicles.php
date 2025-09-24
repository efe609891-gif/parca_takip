<?php
require_once __DIR__ . '/_supabase.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if ($method === 'GET' && !$id) {
    list($code, $resp) = supabase_request('GET', '/vehicles', [ 'select' => '*', 'order' => 'date_added.desc' ]);
    http_response_code($code);
    echo $resp; exit;
}

if ($method === 'GET' && $id) {
    list($codeV, $respV) = supabase_request('GET', '/vehicles', [ 'id' => 'eq.' . $id, 'select' => '*' ]);
    $vehicles = json_decode($respV, true);
    if ($codeV >= 400 || empty($vehicles)) { http_response_code(404); echo json_encode([ 'message' => 'Not found' ]); exit; }
    list($codeP, $respP) = supabase_request('GET', '/parts', [ 'vehicle_id' => 'eq.' . $id, 'select' => '*', 'order' => 'id.desc' ]);
    $parts = ($codeP < 400) ? json_decode($respP, true) : [];
    echo json_encode(array_merge($vehicles[0], [ 'parts' => $parts ]));
    exit;
}

// parts nested routes via query params (ÖNCE ele alınmalı)
if ($method === 'POST' && isset($_GET['part']) && $id) {
    $body = read_json_body();
    $payload = [
        // id gönderme; DB BIGINT otomatik doldurur
        'vehicle_id' => $id,
        'name' => $body['name'] ?? null,
        'price' => isset($body['price']) ? (float)$body['price'] : null,
        'description' => $body['description'] ?? null
        // date sütunu şemada farklı olabilir; gönderme, DB default kullansın
    ];
    list($code, $resp) = supabase_request('POST', '/parts', [], $payload);
    http_response_code($code);
    echo $resp; exit;
}

if ($method === 'POST') {
    $body = read_json_body();
    $payload = [
        'brand' => isset($body['brand']) ? (string)$body['brand'] : null,
        'model' => isset($body['model']) ? (string)$body['model'] : null,
        'year' => isset($body['year']) ? (int)$body['year'] : null,
        'fuel' => isset($body['fuel']) ? (string)$body['fuel'] : null,
        'km' => isset($body['km']) ? (int)$body['km'] : null,
        'price' => isset($body['price']) ? (float)$body['price'] : null,
        'color' => isset($body['color']) ? (string)$body['color'] : null,
        'vin' => isset($body['vin']) ? (string)$body['vin'] : null,
        'condition' => isset($body['condition']) ? (string)$body['condition'] : null,
        'description' => $body['description'] ?? null,
        'photo' => $body['photo'] ?? null,
        'total_sales' => isset($body['totalSales']) ? (float)$body['totalSales'] : 0,
        'status' => isset($body['status']) ? (string)$body['status'] : 'active',
        'date_added' => $body['dateAdded'] ?? null
    ];
    list($code, $resp) = supabase_request('POST', '/vehicles', [], $payload);
    http_response_code($code);
    echo $resp; exit;
}

if ($method === 'PUT' && $id) {
    $body = read_json_body();
    $payload = [
        'brand' => isset($body['brand']) ? (string)$body['brand'] : null,
        'model' => isset($body['model']) ? (string)$body['model'] : null,
        'year' => isset($body['year']) ? (int)$body['year'] : null,
        'fuel' => isset($body['fuel']) ? (string)$body['fuel'] : null,
        'km' => isset($body['km']) ? (int)$body['km'] : null,
        'price' => isset($body['price']) ? (float)$body['price'] : null,
        'color' => isset($body['color']) ? (string)$body['color'] : null,
        'vin' => isset($body['vin']) ? (string)$body['vin'] : null,
        'condition' => isset($body['condition']) ? (string)$body['condition'] : null,
        'description' => $body['description'] ?? null,
        'photo' => $body['photo'] ?? null,
        'total_sales' => array_key_exists('totalSales', $body) ? (float)$body['totalSales'] : null,
        'status' => isset($body['status']) ? (string)$body['status'] : null,
        'date_added' => $body['dateAdded'] ?? null
    ];
    $payload = array_filter($payload, function($v){ return !is_null($v); });
    list($code, $resp) = supabase_request('PATCH', '/vehicles', [ 'id' => 'eq.' . $id ], $payload);
    http_response_code($code);
    echo $resp; exit;
}

// Parça silme (ÖNCE)
if ($method === 'DELETE' && isset($_GET['partId']) && $id) {
    $partId = $_GET['partId'];
    list($code, $resp) = supabase_request('DELETE', '/parts', [ 'id' => 'eq.' . $partId, 'vehicle_id' => 'eq.' . $id ], null);
    http_response_code($code);
    echo $resp; exit;
}

if ($method === 'DELETE' && $id) {
    list($code, $resp) = supabase_request('DELETE', '/vehicles', [ 'id' => 'eq.' . $id ], null);
    http_response_code($code);
    echo $resp; exit;
}

http_response_code(405);
echo json_encode([ 'message' => 'Method Not Allowed' ]);

