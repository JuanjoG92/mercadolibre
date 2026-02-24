<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

try {
    require_once __DIR__ . '/init-db.php';
    $db = getDB();
} catch (Exception $e) {
    echo json_encode(['error' => 'DB error: ' . $e->getMessage()]); exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) { echo json_encode(['error' => 'Invalid input']); exit; }
$action = $input['action'] ?? '';

if ($action === 'register') {
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    $location = $input['location'] ?? '';
    if (!$name || !$email || !$password) { echo json_encode(['error' => 'All fields required']); exit; }
    $exists = $db->prepare("SELECT id FROM users WHERE email = ?");
    $exists->execute([$email]);
    if ($exists->fetch()) { echo json_encode(['error' => 'Email already registered']); exit; }
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $token = bin2hex(random_bytes(32));
    $stmt = $db->prepare("INSERT INTO users (name,email,password,location,token) VALUES (?,?,?,?,?)");
    $stmt->execute([$name, $email, $hash, $location, $token]);
    $userId = $db->lastInsertId();
    echo json_encode(['success'=>true,'token'=>$token,'user'=>['id'=>(int)$userId,'name'=>$name,'email'=>$email,'location'=>$location]]);
}
elseif ($action === 'login') {
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$user || !password_verify($password, $user['password'])) {
        echo json_encode(['error' => 'Invalid credentials']); exit;
    }
    $token = bin2hex(random_bytes(32));
    $db->prepare("UPDATE users SET token = ? WHERE id = ?")->execute([$token, $user['id']]);
    echo json_encode(['success'=>true,'token'=>$token,'user'=>['id'=>(int)$user['id'],'name'=>$user['name'],'email'=>$user['email'],'location'=>$user['location']]]);
}
else { echo json_encode(['error' => 'Invalid action']); }
