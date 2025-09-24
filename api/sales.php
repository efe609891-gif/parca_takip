<?php
require_once __DIR__ . '/_supabase.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET' && isset($_GET['report'])) {
    $start = $_GET['startDate'] ?? '';
    $end = $_GET['endDate'] ?? '';
    list($code, $resp) = supabase_request('GET', '/sales', [
        'select' => '*',
        'date' => 'gte.' . $start,
        'date' => 'lte.' . $end,
        'order' => 'date.asc'
    ]);
    http_response_code($code);
    echo $resp; exit;
}

if ($method === 'GET') {
    list($code, $resp) = supabase_request('GET', '/sales', [ 'select' => '*', 'order' => 'date.desc' ]);
    http_response_code($code);
    echo $resp; exit;
}

if ($method === 'POST') {
    $body = read_json_body();
    list($code, $resp) = supabase_request('POST', '/sales', [], $body);
    http_response_code($code);
    echo $resp; exit;
}

http_response_code(405);
echo json_encode([ 'message' => 'Method Not Allowed' ]);

