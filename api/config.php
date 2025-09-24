<?php
// Rename this file to config.php and fill values
// Supabase REST configuration
define('SUPABASE_URL', getenv('SUPABASE_URL') ?: 'https://ulhhmmeqpobpjllautqb.supabase.co');
define('SUPABASE_SERVICE_KEY', getenv('SUPABASE_SERVICE_KEY') ?: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsaGhtbWVxcG9icGpsbGF1dHFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODYzOTY4MCwiZXhwIjoyMDc0MjE1NjgwfQ.nUK6m6yN_ZDPL3GyjDjnbEj9r_id2dxNAL5gIOCS_Nk');

// Optional: CORS for local dev
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }


