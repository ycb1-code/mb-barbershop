-- Oracle Database Schema for TrimTime Barbershop
-- Run this on Oracle Autonomous Database (Always Free tier)

-- Create Services Table
CREATE TABLE Services (
    service_id VARCHAR2(36) PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    description VARCHAR2(255),
    price NUMBER(10,2) NOT NULL,
    image_url VARCHAR2(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Bookings Table
CREATE TABLE Bookings (
    booking_id VARCHAR2(36) PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    phone VARCHAR2(20) NOT NULL,
    service VARCHAR2(100) NOT NULL,
    date_field DATE NOT NULL,
    time_field VARCHAR2(10) NOT NULL,
    status VARCHAR2(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Cancelled', 'Completed')),
    payment_screenshot CLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Products Table
CREATE TABLE Products (
    product_id VARCHAR2(36) PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    description VARCHAR2(500),
    price NUMBER(10,2) NOT NULL,
    category VARCHAR2(50) NOT NULL,
    stock_quantity NUMBER(10) DEFAULT 0,
    image_url VARCHAR2(255),
    is_available NUMBER(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Product Categories Table
CREATE TABLE Product_Categories (
    category_id VARCHAR2(36) PRIMARY KEY,
    name VARCHAR2(100) NOT NULL UNIQUE,
    description VARCHAR2(255),
    display_order NUMBER(5) DEFAULT 999,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_bookings_phone ON Bookings(phone);
CREATE INDEX idx_bookings_date ON Bookings(date_field);
CREATE INDEX idx_bookings_status ON Bookings(status);

-- Insert default services
INSERT INTO Services (service_id, name, description, price, image_url)
VALUES ('1', 'Fade Cut', 'Clean taper fade with smooth finish', 300, '/images/fade-cut.jpg');

INSERT INTO Services (service_id, name, description, price, image_url)
VALUES ('2', 'Classic Trim', 'Neat haircut with simple styling', 250, '/images/classic-trim.jpg');

INSERT INTO Services (service_id, name, description, price, image_url)
VALUES ('3', 'Kids Cut', 'Gentle and stylish cut for children', 200, '/images/kids-cut.jpg');

INSERT INTO Services (service_id, name, description, price, image_url)
VALUES ('4', 'Beard Line-Up', 'Clean beard trim and edge', 200, '/images/beard-lineup.jpg');

INSERT INTO Services (service_id, name, description, price, image_url)
VALUES ('5', 'Full Package', 'Haircut + Beard Trim combo', 500, '/images/full-package.jpg');

INSERT INTO Services (service_id, name, description, price, image_url)
VALUES ('6', 'Pattern Cut', 'Custom design / lines', 400, '/images/pattern-cut.jpg');

INSERT INTO Services (service_id, name, description, price, image_url)
VALUES ('7', 'Afro Shaping', 'Shape and style for natural hair', 350, '/images/afro-shaping.jpg');

COMMIT;

-- Create trigger to auto-update updated_at timestamp for Services
CREATE OR REPLACE TRIGGER trg_services_update 
BEFORE UPDATE ON Services 
FOR EACH ROW 
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/

-- Create trigger to auto-update updated_at timestamp for Bookings
CREATE OR REPLACE TRIGGER trg_bookings_update 
BEFORE UPDATE ON Bookings 
FOR EACH ROW 
BEGIN
    :NEW.updated_at := CURRENT_TIMESTAMP;
END;
/
