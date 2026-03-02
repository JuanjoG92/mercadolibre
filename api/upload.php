<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

define('ADMIN_PIN', '1234');
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_SIZE', 5 * 1024 * 1024); // 5MB
$ALLOWED = ['image/jpeg','image/png','image/webp','image/gif'];

$pin = $_POST['pin'] ?? '';
if ($pin !== ADMIN_PIN) { echo json_encode(['error' => 'Invalid PIN']); exit; }

if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
    $errCode = isset($_FILES['photo']) ? $_FILES['photo']['error'] : 'no file';
    echo json_encode(['error' => 'No file uploaded (code: '.$errCode.')']); exit;
}

$file = $_FILES['photo'];

// Validate size
if ($file['size'] > MAX_SIZE) {
    echo json_encode(['error' => 'File too large (max 5MB)']); exit;
}

// Validate type
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($file['tmp_name']);
if (!in_array($mime, $ALLOWED)) {
    echo json_encode(['error' => 'Invalid file type: ' . $mime]); exit;
}

// Create uploads dir if needed
if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);

// Generate unique filename
$ext = 'jpg';
if ($mime === 'image/png') $ext = 'png';
elseif ($mime === 'image/webp') $ext = 'webp';
elseif ($mime === 'image/gif') $ext = 'gif';
$filename = 'prod_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
$destPath = UPLOAD_DIR . $filename;

// Try to resize large images with GD (if available)
$resized = false;
if (extension_loaded('gd') && in_array($mime, ['image/jpeg','image/png','image/webp'])) {
    $info = getimagesize($file['tmp_name']);
    if ($info && $info[0] > 1200) {
        $srcW = $info[0]; $srcH = $info[1];
        $newW = 1200; $newH = intval($srcH * ($newW / $srcW));
        $src = null;
        if ($mime === 'image/jpeg') $src = imagecreatefromjpeg($file['tmp_name']);
        elseif ($mime === 'image/png') $src = imagecreatefrompng($file['tmp_name']);
        elseif ($mime === 'image/webp') $src = imagecreatefromwebp($file['tmp_name']);
        if ($src) {
            $dst = imagecreatetruecolor($newW, $newH);
            if ($mime === 'image/png') {
                imagealphablending($dst, false);
                imagesavealpha($dst, true);
            }
            imagecopyresampled($dst, $src, 0, 0, 0, 0, $newW, $newH, $srcW, $srcH);
            if ($mime === 'image/png') imagepng($dst, $destPath, 8);
            elseif ($mime === 'image/webp') imagewebp($dst, $destPath, 85);
            else imagejpeg($dst, $destPath, 85);
            imagedestroy($src); imagedestroy($dst);
            $resized = true;
        }
    }
}

if (!$resized) {
    if (!move_uploaded_file($file['tmp_name'], $destPath)) {
        echo json_encode(['error' => 'Failed to save file']); exit;
    }
}

$url = 'uploads/' . $filename;
echo json_encode(['success' => true, 'url' => $url, 'filename' => $filename]);
