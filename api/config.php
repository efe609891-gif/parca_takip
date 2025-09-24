<?php
// Rename this file to config.php and fill values
// Supabase REST configuration
define('SUPABASE_URL', getenv('SUPABASE_URL') ?: 'https://wivsljnoaplcvkxlurql.supabase.co');
define('SUPABASE_SERVICE_KEY', getenv('SUPABASE_SERVICE_KEY') ?: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpdnNsam5vYXBsY3ZreGx1cnFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODcwMDI1MiwiZXhwIjoyMDc0Mjc2MjUyfQ.pF_x8KGHnWDpoNYlhoGsGhVMGDR6s81cnqrrpiEYvb8');

// Optional: CORS for local dev
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }



