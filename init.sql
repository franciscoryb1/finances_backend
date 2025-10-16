-- ==============================================
--  DATABASE: finances_db
--  SCHEMA:   public
--  PURPOSE:  Personal finance management backend
--  AUTHOR:   Franc
-- ==============================================

-- Drop all existing tables (for development only)
DROP TABLE IF EXISTS installments CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS credit_card_statements CASCADE;
DROP TABLE IF EXISTS credit_cards CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS banks CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ==============================================
-- USERS
-- ==============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================================
-- BANKS
-- ==============================================
CREATE TABLE banks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE
);

-- ==============================================
-- ACCOUNTS
-- ==============================================
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    bank_id INT REFERENCES banks(id),
    account_number VARCHAR(50),
    type VARCHAR(20),
    balance DECIMAL(12,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'ARS',
    is_active BOOLEAN DEFAULT TRUE
);

-- ==============================================
-- CREDIT CARDS
-- ==============================================
CREATE TABLE credit_cards (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    bank_id INT REFERENCES banks(id),
    name VARCHAR(50) NOT NULL,
    brand VARCHAR(30),
    limit_amount DECIMAL(12,2),
    balance DECIMAL(12,2) DEFAULT 0,
    expiration_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================================
-- CREDIT CARD STATEMENTS
-- ==============================================
CREATE TABLE credit_card_statements (
    id SERIAL PRIMARY KEY,
    credit_card_id INT REFERENCES credit_cards(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(12,2) DEFAULT 0,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    remaining_balance DECIMAL(12,2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    status VARCHAR(20) DEFAULT 'open',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================================
-- CATEGORIES
-- ==============================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    color VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE
);

-- ==============================================
-- TRANSACTIONS
-- ==============================================
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    account_id INT REFERENCES accounts(id),
    credit_card_id INT REFERENCES credit_cards(id),
    statement_id INT REFERENCES credit_card_statements(id),
    category_id INT REFERENCES categories(id),
    payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'transfer', 'credit_card')),
    type VARCHAR(10) CHECK (type IN ('income', 'expense')),
    amount DECIMAL(12,2) NOT NULL,
    description VARCHAR(255),
    date DATE NOT NULL,
    installments INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================================
-- INSTALLMENTS
-- ==============================================
CREATE TABLE installments (
    id SERIAL PRIMARY KEY,
    transaction_id INT REFERENCES transactions(id) ON DELETE CASCADE,
    statement_id INT REFERENCES credit_card_statements(id),
    installment_number INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    due_date DATE NOT NULL,
    paid BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

-- ==============================================
-- INDEXES
-- ==============================================
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_installments_due_date ON installments(due_date);
CREATE INDEX idx_credit_card_statements_status ON credit_card_statements(status);
