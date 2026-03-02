<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

// ===== Admin PIN (change this to your preferred PIN) =====
define('ADMIN_PIN', '1234');

function checkPin($pin) { return $pin === ADMIN_PIN; }

try {
    require_once __DIR__ . '/init-db.php';
    $db = getDB();
} catch (Exception $e) {
    echo json_encode(['error' => 'DB error: ' . $e->getMessage()]); exit;
}

// GET requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $pin = $_GET['pin'] ?? '';
    if (!checkPin($pin)) { echo json_encode(['error' => 'Invalid PIN']); exit; }
    $action = $_GET['action'] ?? '';

    if ($action === 'list') {
        $stmt = $db->query("SELECT p.*, u.name as seller_name FROM products p LEFT JOIN users u ON p.user_id = u.id ORDER BY p.id DESC");
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($products as &$p) { $p['id'] = (int)$p['id']; $p['price'] = (float)$p['price']; }
        echo json_encode(['products' => $products]); exit;
    }

    if ($action === 'stats') {
        $total = $db->query("SELECT COUNT(*) FROM products")->fetchColumn();
        $active = $db->query("SELECT COUNT(*) FROM products WHERE status='active'")->fetchColumn();
        $paused = $db->query("SELECT COUNT(*) FROM products WHERE status!='active'")->fetchColumn();
        echo json_encode(['total'=>(int)$total,'active'=>(int)$active,'paused'=>(int)$paused]); exit;
    }

    echo json_encode(['error' => 'Invalid action']); exit;
}

// POST requests
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) { echo json_encode(['error' => 'Invalid input']); exit; }
$pin = $input['pin'] ?? '';
if (!checkPin($pin)) { echo json_encode(['error' => 'Invalid PIN']); exit; }
$action = $input['action'] ?? '';

if ($action === 'verify_pin') {
    echo json_encode(['success' => true]); exit;
}

if ($action === 'create') {
    $title = trim($input['title'] ?? '');
    $price = floatval($input['price'] ?? 0);
    if (!$title || $price <= 0) { echo json_encode(['error' => 'Title and price required']); exit; }
    $userId = 1;
    $first = $db->query("SELECT id FROM users ORDER BY id ASC LIMIT 1")->fetchColumn();
    if ($first) $userId = (int)$first;

    $stmt = $db->prepare("INSERT INTO products (user_id,title,price,category,condition,brand,model,year,range_km,battery,description,photo,location,free_shipping,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,1,?)");
    $stmt->execute([
        $userId, $title, $price,
        $input['category'] ?? 'autos',
        $input['condition'] ?? 'used',
        $input['brand'] ?? '',
        $input['model'] ?? '',
        $input['year'] ?? '',
        $input['range_km'] ?? '',
        $input['battery'] ?? '',
        $input['description'] ?? '',
        $input['photo'] ?? '',
        $input['location'] ?? '',
        $input['status'] ?? 'active'
    ]);
    echo json_encode(['success' => true, 'id' => (int)$db->lastInsertId()]); exit;
}

if ($action === 'update') {
    $id = intval($input['id'] ?? 0);
    if (!$id) { echo json_encode(['error' => 'Product ID required']); exit; }
    $stmt = $db->prepare("UPDATE products SET title=?,price=?,category=?,condition=?,brand=?,model=?,year=?,range_km=?,battery=?,description=?,photo=?,location=?,status=? WHERE id=?");
    $stmt->execute([
        trim($input['title'] ?? ''),
        floatval($input['price'] ?? 0),
        $input['category'] ?? 'autos',
        $input['condition'] ?? 'used',
        $input['brand'] ?? '',
        $input['model'] ?? '',
        $input['year'] ?? '',
        $input['range_km'] ?? '',
        $input['battery'] ?? '',
        $input['description'] ?? '',
        $input['photo'] ?? '',
        $input['location'] ?? '',
        $input['status'] ?? 'active',
        $id
    ]);
    echo json_encode(['success' => true]); exit;
}

if ($action === 'delete') {
    $id = intval($input['id'] ?? 0);
    if (!$id) { echo json_encode(['error' => 'Product ID required']); exit; }
    $db->prepare("DELETE FROM products WHERE id = ?")->execute([$id]);
    echo json_encode(['success' => true]); exit;
}

if ($action === 'toggle_status') {
    $id = intval($input['id'] ?? 0);
    if (!$id) { echo json_encode(['error' => 'Product ID required']); exit; }
    $stmt = $db->prepare("SELECT status FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $current = $stmt->fetchColumn();
    $newStatus = ($current === 'active') ? 'paused' : 'active';
    $db->prepare("UPDATE products SET status = ? WHERE id = ?")->execute([$newStatus, $id]);
    echo json_encode(['success' => true, 'status' => $newStatus]); exit;
}

echo json_encode(['error' => 'Invalid action']);
