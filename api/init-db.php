<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

function getDB() {
    $dataDir = __DIR__ . '/../data';
    if (!is_dir($dataDir)) mkdir($dataDir, 0755, true);
    $dbPath = $dataDir . '/ecomarket.db';
    $isNew = !file_exists($dbPath);
    $db = new PDO('sqlite:' . $dbPath);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    if ($isNew) {
        $db->exec("
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                location TEXT DEFAULT '',
                token TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,
                price REAL NOT NULL,
                category TEXT NOT NULL,
                condition TEXT DEFAULT 'used',
                brand TEXT DEFAULT '',
                model TEXT DEFAULT '',
                year TEXT DEFAULT '',
                range_km TEXT DEFAULT '',
                battery TEXT DEFAULT '',
                description TEXT DEFAULT '',
                photo TEXT DEFAULT '',
                location TEXT DEFAULT '',
                free_shipping INTEGER DEFAULT 1,
                status TEXT DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        ");
        // Seed demo products
        $hash = password_hash('demo123', PASSWORD_DEFAULT);
        $db->exec("INSERT INTO users (name,email,password,location,token) VALUES ('EcoMotors','eco@demo.com','$hash','Buenos Aires, Argentina','demo1')");
        $db->exec("INSERT INTO users (name,email,password,location,token) VALUES ('ElectroVehicles','electro@demo.com','$hash','Santiago, Chile','demo2')");
        $db->exec("INSERT INTO users (name,email,password,location,token) VALUES ('GreenRide','green@demo.com','$hash','Ciudad de México, México','demo3')");

        $products = [
            [1,'Tesla Model 3 Standard Range Plus 2023',42000,'autos','used','Tesla','Model 3','2023','430','60 kWh LFP','Excelente estado, un solo dueño. Service oficial al día. Piloto automático incluido. Color blanco perla. Interior vegano negro.','https://images.pexels.com/photos/12861979/pexels-photo-12861979.jpeg?auto=compress&cs=tinysrgb&w=600','Buenos Aires, Argentina'],
            [1,'BYD Dolphin Mini 2024 - 0km',22500,'autos','new','BYD','Dolphin Mini','2024','310','44.9 kWh','Nuevo, sin patentar. Color azul oceáno. Ideal ciudad. Carga rápida DC. Garantía oficial 6 años o 150.000 km.','https://images.pexels.com/photos/16251382/pexels-photo-16251382.jpeg?auto=compress&cs=tinysrgb&w=600','Buenos Aires, Argentina'],
            [2,'Nissan Leaf 40kWh 2022',28000,'autos','used','Nissan','Leaf','2022','270','40 kWh','Segunda mano, 25.000 km. ProPilot. Batería en excelente estado (95% SOH). Cargador incluido.','https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=600','Santiago, Chile'],
            [2,'Super Soco TC Max 2024 - Moto eléctrica',4500,'motos','new','Super Soco','TC Max','2024','110','3.6 kWh Litio','Nueva, velocidad máxima 95 km/h. Ideal para ciudad. Batería extraíble. Carga en 3.5 horas.','https://images.pexels.com/photos/2549941/pexels-photo-2549941.jpeg?auto=compress&cs=tinysrgb&w=600','Santiago, Chile'],
            [3,'Zero SR/F 2023 - Moto deportiva eléctrica',19800,'motos','used','Zero','SR/F','2023','260','14.4 kWh','La moto eléctrica más potente. 110 HP, 0-100 en 3.5s. 5.000 km. Carga rápida Level 2.','https://images.pexels.com/photos/104842/pexels-photo-104842.jpeg?auto=compress&cs=tinysrgb&w=600','Ciudad de México, México'],
            [1,'Xiaomi Mi Electric Scooter Pro 2',650,'scooters','new','Xiaomi','Pro 2','2024','45','12.8 Ah','Nuevo en caja. Velocidad máx 25 km/h. Neumáticos 8.5". App Mi Home. Freno regenerativo.','https://images.pexels.com/photos/5973883/pexels-photo-5973883.jpeg?auto=compress&cs=tinysrgb&w=600','Buenos Aires, Argentina'],
            [3,'Segway Ninebot Max G30',850,'scooters','used','Segway','Ninebot Max G30','2023','65','551 Wh','Semi nuevo, 500 km recorridos. La mejor autonomía del mercado. Ruedas 10" tubeless.','https://images.pexels.com/photos/7706448/pexels-photo-7706448.jpeg?auto=compress&cs=tinysrgb&w=600','Ciudad de México, México'],
            [2,'Bicicleta eléctrica Trek Allant+ 7 2024',3200,'bicicletas','new','Trek','Allant+ 7','2024','100','500 Wh Bosch','Nueva. Motor Bosch Performance Line. 9 velocidades. Frenos hidráulicos. Luces integradas.','https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=600','Santiago, Chile'],
            [1,'E-Bike plegable Fiido D11 2024',980,'bicicletas','new','Fiido','D11','2024','80','11.6 Ah','Plegable, ultraliviana 17.5 kg. 3 modos de conducción. Pantalla LCD. Cambios Shimano 7v.','https://images.pexels.com/photos/1208777/pexels-photo-1208777.jpeg?auto=compress&cs=tinysrgb&w=600','Buenos Aires, Argentina'],
            [3,'Batería Litio 72V 40Ah para moto eléctrica',890,'repuestos','new','Generic','72V 40Ah','2024','','72V 40Ah LiFePO4','Batería de litio hierro fosfato. 2000+ ciclos. BMS incluido. Compatible con la mayoría de motos eléctricas chinas.','https://images.pexels.com/photos/3846205/pexels-photo-3846205.jpeg?auto=compress&cs=tinysrgb&w=600','Ciudad de México, México'],
            [2,'Cargador Wallbox Pulsar Plus 7.4kW',680,'accesorios','new','Wallbox','Pulsar Plus','2024','','','Cargador doméstico inteligente. WiFi + Bluetooth. Compatible con todos los autos eléctricos. Cable 5m. App móvil.','https://images.pexels.com/photos/9800092/pexels-photo-9800092.jpeg?auto=compress&cs=tinysrgb&w=600','Santiago, Chile'],
            [1,'Casco inteligente Livall BH51M Neo',180,'accesorios','new','Livall','BH51M Neo','2024','','','Casco con luces LED, señaleros, manos libres Bluetooth, SOS automático. Ideal para scooter y bicicleta.','https://images.pexels.com/photos/5793953/pexels-photo-5793953.jpeg?auto=compress&cs=tinysrgb&w=600','Buenos Aires, Argentina'],
            [3,'BYD Han EV 2024 - Sedán premium',51000,'autos','new','BYD','Han EV','2024','521','85.4 kWh Blade','0 km. Sedán de lujo eléctrico. 0-100 en 3.9s. Techo panorámico. Pantalla giratoria 15.6".','https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=600','Ciudad de México, México'],
            [2,'Kit conversión bicicleta eléctrica 1000W',420,'repuestos','new','Bafang','BBSHD 1000W','2024','','48V 17.5Ah','Kit completo: motor mid-drive 1000W + batería 48V + controlador + display. Convierte cualquier bicicleta.','https://images.pexels.com/photos/3671151/pexels-photo-3671151.jpeg?auto=compress&cs=tinysrgb&w=600','Santiago, Chile'],
            [1,'Volkswagen ID.4 Pro 2023',38500,'autos','used','Volkswagen','ID.4 Pro','2023','520','77 kWh','SUV eléctrico familiar. 15.000 km. Color gris. Techo panorámico. Asistente de aparcamiento.','https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600','Buenos Aires, Argentina'],
        ];
        $stmt = $db->prepare("INSERT INTO products (user_id,title,price,category,condition,brand,model,year,range_km,battery,description,photo,location,free_shipping) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,1)");
        foreach ($products as $p) { $stmt->execute($p); }
    }
    return $db;
}
