<?php
header('Content-Type: application/json');
$checks = [];
$checks['php'] = PHP_VERSION;
$checks['pdo_sqlite'] = extension_loaded('pdo_sqlite') ? 'OK' : 'MISSING';
$dataDir = __DIR__ . '/../data';
$checks['data_dir_writable'] = is_writable($dataDir) ? 'OK' : 'NOT_WRITABLE';
try {
    require_once __DIR__ . '/init-db.php';
    $db = getDB();
    $checks['db'] = 'OK';
    $checks['users'] = $db->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $checks['products'] = $db->query("SELECT COUNT(*) FROM products")->fetchColumn();
} catch (Exception $e) { $checks['db'] = 'ERROR: ' . $e->getMessage(); }
echo json_encode($checks, JSON_PRETTY_PRINT);
