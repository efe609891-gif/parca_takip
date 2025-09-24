<?php
// Users endpoint devre dışı. Uygulama kullanıcı yönetimi olmadan çalışıyor.
header('Content-Type: application/json');
http_response_code(410);
echo json_encode([ 'message' => 'Users API disabled' ]);
?>

