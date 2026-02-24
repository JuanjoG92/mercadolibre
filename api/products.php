<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

try {
    require_once __DIR__ . '/init-db.php';
    $db = getDB();
} catch (Exception $e) {
    echo json_encode(['error' => 'DB error: ' . $e->getMessage()]); exit;
}

// GET requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';

    if ($action === 'list') {
        $stmt = $db->query("SELECT p.*, u.name as seller_name FROM products p JOIN users u ON p.user_id = u.id WHERE p.status = 'active' ORDER BY p.id DESC");
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($products as &$p) { $p['id'] = (int)$p['id']; $p['price'] = (float)$p['price']; $p['free_shipping'] = (bool)$p['free_shipping']; }
        echo json_encode(['products' => $products]); exit;
    }

    if ($action === 'my') {
        $userId = intval($_GET['user_id'] ?? 0);
        $token = $_GET['token'] ?? '';
        $auth = $db->prepare("SELECT id FROM users WHERE id = ? AND token = ?");
        $auth->execute([$userId, $token]);
        if (!$auth->fetch()) { echo json_encode(['error'=>'Auth required']); exit; }
        $stmt = $db->prepare("SELECT * FROM products WHERE user_id = ? ORDER BY id DESC");
        $stmt->execute([$userId]);
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($products as &$p) { $p['id'] = (int)$p['id']; $p['price'] = (float)$p['price']; }
        echo json_encode(['products' => $products]); exit;
    }

    if ($action === 'get') {
        $id = intval($_GET['id'] ?? 0);
        $stmt = $db->prepare("SELECT p.*, u.name as seller_name FROM products p JOIN users u ON p.user_id = u.id WHERE p.id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($product) { $product['id'] = (int)$product['id']; $product['price'] = (float)$product['price']; }
        echo json_encode(['product' => $product]); exit;
    }

    echo json_encode(['error' => 'Invalid action']); exit;
}

// POST requests
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) { echo json_encode(['error' => 'Invalid input']); exit; }
$action = $input['action'] ?? '';

if ($action === 'create') {
    $userId = intval($input['user_id'] ?? 0);
    $token = $input['token'] ?? '';
    $auth = $db->prepare("SELECT id FROM users WHERE id = ? AND token = ?");
    $auth->execute([$userId, $token]);
    if (!$auth->fetch()) { echo json_encode(['error'=>'Auth required']); exit; }

    $title = trim($input['title'] ?? '');
    $price = floatval($input['price'] ?? 0);
    if (!$title || $price <= 0) { echo json_encode(['error' => 'Title and price required']); exit; }

    $stmt = $db->prepare("INSERT INTO products (user_id,title,price,category,condition,brand,model,year,range_km,battery,description,location,free_shipping) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,1)");
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
        $input['location'] ?? ''
    ]);
    echo json_encode(['success' => true, 'id' => (int)$db->lastInsertId()]);
}
elseif ($action === 'delete') {
    $productId = intval($input['product_id'] ?? 0);
    $userId = intval($input['user_id'] ?? 0);
    $token = $input['token'] ?? '';
    $auth = $db->prepare("SELECT id FROM users WHERE id = ? AND token = ?");
    $auth->execute([$userId, $token]);
    if (!$auth->fetch()) { echo json_encode(['error'=>'Auth required']); exit; }
    $db->prepare("DELETE FROM products WHERE id = ? AND user_id = ?")->execute([$productId, $userId]);
    echo json_encode(['success' => true]);
}
else { echo json_encode(['error' => 'Invalid action']); }
