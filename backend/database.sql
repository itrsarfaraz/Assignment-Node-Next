-- Create database
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- Create Role table
CREATE TABLE IF NOT EXISTS role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create User table
CREATE TABLE IF NOT EXISTS user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES role(id)
);

-- Create Product table
CREATE TABLE IF NOT EXISTS product (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Order table
CREATE TABLE IF NOT EXISTS `order` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Insert initial roles
INSERT INTO role (name, description) VALUES
('admin', 'Administrator with full access'),
('user', 'Regular user with limited access');

-- Insert test users (password is 'Admin@123' hashed with bcrypt)
INSERT INTO user (username, email, password, role_id) VALUES
('admin', 'admin@example.com', '$2a$10$dbzlEobUuwcqlBxkzmjRWecKrVHD/EiFsUWnvwWcxByQ4ud4ZJVva', 1),
('user1', 'user1@example.com', '$2a$10$dbzlEobUuwcqlBxkzmjRWecKrVHD/EiFsUWnvwWcxByQ4ud4ZJVva', 2),
('user2', 'user2@example.com', '$2a$10$dbzlEobUuwcqlBxkzmjRWecKrVHD/EiFsUWnvwWcxByQ4ud4ZJVva', 2);

-- Insert test products
INSERT INTO product (name, description, price, stock) VALUES
('Laptop', 'High-performance laptop with latest specs', 999.99, 10),
('Smartphone', 'Latest model with advanced features', 699.99, 15),
('Headphones', 'Wireless noise-canceling headphones', 199.99, 20),
('Tablet', '10-inch tablet with retina display', 499.99, 8),
('Smartwatch', 'Fitness tracking and notifications', 299.99, 12);

-- Insert test orders
INSERT INTO `order` (user_id, product_id, quantity, total_price) VALUES
(2, 1, 1, 999.99),
(2, 3, 2, 399.98),
(3, 2, 1, 699.99),
(3, 4, 1, 499.99);

-- Test credentials:
-- Admin: admin@example.com / Admin@123
-- User1: user1@example.com / Admin@123
-- User2: user2@example.com / Admin@123
