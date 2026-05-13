DROP DATABASE IF EXISTS warung_camera;

CREATE DATABASE warung_camera;
USE warung_camera;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(255)
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    image VARCHAR(500),
    rating DECIMAL(2,1) DEFAULT 5.0,
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL
);

CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(12,2) DEFAULT 0,
    status ENUM(
        'pending',
        'paid',
        'shipped',
        'completed',
        'cancelled'
    ) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    price DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,

    FOREIGN KEY (order_id)
    REFERENCES orders(id)
    ON DELETE CASCADE,

    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE
);

CREATE TABLE wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE CASCADE
);

INSERT INTO categories (name, icon)
VALUES
('DSLR', 'camera'),
('Mirrorless', 'camera'),
('Action Cam', 'video'),
('Drone', 'drone'),
('Lensa', 'lens'),
('Aksesoris', 'cable');

INSERT INTO products
(category_id, name, description, price, image, rating, stock)
VALUES
(
    2,
    'Sony A7 IV',
    'Kamera mirrorless full-frame premium untuk foto dan video profesional.',
    31000000,
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
    4.8,
    10
),
(
    1,
    'Canon EOS R5',
    'Kamera profesional dengan kualitas tinggi untuk fotografer dan videografer.',
    48000000,
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd',
    4.9,
    8
),
(
    2,
    'Fujifilm X-T5',
    'Kamera mirrorless stylish dengan warna khas Fujifilm.',
    23500000,
    'https://images.unsplash.com/photo-1495707902641-75cac588d2e9',
    4.7,
    12
),
(
    3,
    'GoPro Hero 12',
    'Action camera tahan air untuk aktivitas outdoor dan olahraga ekstrem.',
    7500000,
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
    4.6,
    20
),
(
    4,
    'DJI Mini 4 Pro',
    'Drone ringan dengan kemampuan video cinematic.',
    13500000,
    'https://images.unsplash.com/photo-1508444845599-5c89863b1c44',
    4.8,
    6
),
(
    5,
    'Sigma 24-70mm F2.8',
    'Lensa zoom profesional untuk kamera mirrorless.',
    14500000,
    'https://images.unsplash.com/photo-1617005082133-548c4dd27f35',
    4.7,
    9
);

INSERT INTO users
(name, email, password, role)
VALUES
(
    'Admin',
    'admin@warungcamera.com',
    'admin123',
    'admin'
),
(
    'User',
    'user@warungcamera.com',
    'user123',
    'user'
);