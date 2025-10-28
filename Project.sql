CREATE DATABASE IF NOT EXISTS Bank_Management_System;
USE Bank_Management_System;
# Amount in branch have to do
CREATE TABLE Customer(
	CIF_No INT AUTO_INCREMENT,
    Email VARCHAR(40) NOT NULL,
    Phone_No CHAR(10) NOT NULL CHECK (Phone_No REGEXP '^[0-9]{10}$'),
    Street VARCHAR(30),
    Town VARCHAR(30),
    District VARCHAR(30),
    State VARCHAR(30),
    Country VARCHAR(30) DEFAULT("India"),
    PIN_Code CHAR(6) NOT NULL CHECK (PIN_Code REGEXP '^[0-9]{6}$'),
    `Type` ENUM("Individual","Organisation"),
    PRIMARY KEY(CIF_No)
) AUTO_INCREMENT = 100000000;

CREATE TABLE Individual(
	Aadhaar CHAR(12) NOT NULL CHECK (Aadhaar REGEXP '^[0-9]{12}$'),
    PAN CHAR(10) NOT NULL CHECK(PAN REGEXP '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'),
    First_Name VARCHAR(20) NOT NULL,
    Last_Name VARCHAR(20) NOT NULL,
    Gender ENUM("Male","Female","Other") NOT NULL,
    CIF_No INT NOT NULL,
    Date_Of_Birth DATE,
    PRIMARY KEY(Aadhaar),
    FOREIGN KEY (CIF_No) REFERENCES Customer(CIF_No) ON DELETE RESTRICT
);

CREATE TABLE `Organisation`(
	Reg_No CHAR(10) NOT NULL CHECK (Reg_No REGEXP '^[0-9]{10}$'),
    Org_Name VARCHAR(100) NOT NULL,
    Org_Type VARCHAR(50) NOT NULL,
    CIF_No INT NOT NULL,
    CIF_Owner INT NOT NULL,
    Contact_Number CHAR(10),
    Email VARCHAR(100) NOT NULL UNIQUE,
    PRIMARY KEY(Reg_No),
    FOREIGN KEY (CIF_No) REFERENCES Customer(CIF_No) ON DELETE RESTRICT,
    FOREIGN KEY (CIF_Owner) REFERENCES Individual(CIF_No) ON DELETE RESTRICT
);

CREATE TABLE Works(
	CIF_No INT NOT NULL,
    CIF_Org INT NOT NULL,
    Job_Title CHAR(45),
    Join_Date DATE NOT NULL,
    Salary INT,
    PRIMARY KEY(CIF_No, CIF_Org),
    FOREIGN KEY(CIF_No) REFERENCES Individual(CIF_No) ON DELETE RESTRICT,
    FOREIGN KEY(CIF_Org) REFERENCES Organisation(CIF_No) ON DELETE RESTRICT
);

CREATE TABLE Login(
	User_ID VARCHAR(20) CHECK (CHAR_LENGTH(User_ID) >= 6),
    CIF_No INT,
    `Password` VARCHAR(20) CHECK (CHAR_LENGTH(`Password`) >= 8),
    PIN NUMERIC(6,0) CHECK (CHAR_LENGTH(PIN) = 6),
    PRIMARY KEY (User_ID),
    FOREIGN KEY (CIF_No) REFERENCES Customer(CIF_No) ON DELETE RESTRICT,
    `Type` ENUM('Individual','Organisation','Bank Employee')NOT NULL
);

CREATE TABLE Branch(
    Branch_ID INT AUTO_INCREMENT PRIMARY KEY,
    Branch_Name VARCHAR(50) NOT NULL,
    CIF_Manager INT NOT NULL,
    Branch_Balance BIGINT,
    Street VARCHAR(30),
    Town VARCHAR(30),
    District VARCHAR(30),
    State VARCHAR(30),
    Country VARCHAR(30) DEFAULT ("India"),
    PIN_Code CHAR(6) NOT NULL CHECK (PIN_Code REGEXP '^[0-9]{6}$'),
    Contact_Number CHAR(10) NOT NULL CHECK (Contact_Number REGEXP '^[0-9]{10}$'),
    FOREIGN KEY (CIF_Manager) REFERENCES Individual(CIF_No) ON DELETE RESTRICT
);

CREATE TABLE `Account`(
    Account_No INT PRIMARY KEY AUTO_INCREMENT,
    CIF_No INT NOT NULL,
    Branch_ID INT NOT NULL,
    Account_Type ENUM("Saving","Current","Loan") NOT NULL,
    Balance DECIMAL(15,2) DEFAULT 0.00,
    Opening_Date DATE NOT NULL,
    FOREIGN KEY (CIF_No) REFERENCES Customer(CIF_No) ON DELETE RESTRICT,
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID) ON DELETE RESTRICT
) AUTO_INCREMENT = 100000000;

CREATE TABLE Saving_Account(
    Account_No INT PRIMARY KEY,
    Interest_Rate DECIMAL(5,2) DEFAULT 4.0,
    Withdrawal_Limit INT DEFAULT (25000),
    FOREIGN KEY(Account_No) REFERENCES `Account`(Account_No) ON DELETE RESTRICT
);

CREATE TABLE Current_Account (
    Account_No INT PRIMARY KEY,
    Overdraft_Limit DECIMAL(15,2) DEFAULT 50000.00,
    Min_Balance DECIMAL(15,2) DEFAULT 10000.00,
    Monthly_Charges DECIMAL(15,2) DEFAULT 250.00,
    Penalty DECIMAL(15,2) DEFAULT 500.00,
    FOREIGN KEY (Account_No) REFERENCES `Account`(Account_No) ON DELETE RESTRICT
);

CREATE TABLE Loan_Account (
    Account_No INT PRIMARY KEY,
    Loan_Amount DECIMAL(15,2) NOT NULL,
    Interest_Rate DECIMAL(5,2) NOT NULL,
    Loan_Term INT NOT NULL,
    Loan_Type ENUM('Home','Personal','Education','Business') DEFAULT 'Personal',
    EMI DECIMAL(15,2) GENERATED ALWAYS AS (
        (Loan_Amount * Interest_Rate/100 / 12) / 
        (1 - POW(1 + Interest_Rate/100 / 12, -Loan_Term))) STORED,
    Start_Date DATE DEFAULT ( CURRENT_DATE() ),
    End_Date DATE GENERATED ALWAYS AS ( DATE_ADD(Start_Date, INTERVAL Loan_Term MONTH)) STORED,
    `Status` ENUM('Active','Closed','Defaulted') DEFAULT 'Active',
    Penalty_Rate DECIMAL(5,2) DEFAULT 2.00,
    Total_Paid DECIMAL(15,2) DEFAULT 0.00,
    FOREIGN KEY (Account_No) REFERENCES `Account`(Account_No) ON DELETE RESTRICT
);

CREATE TABLE Transactions(
    Transaction_ID BIGINT AUTO_INCREMENT,
    Account_No INT NOT NULL,
    Transaction_Time DATETIME DEFAULT CURRENT_TIMESTAMP,
    `Type` ENUM("Credit","Debit") NOT NULL,
    `Mode` ENUM("Cash","Online-Transfer") NOT NULL,
    Amount DECIMAL(15,2) NOT NULL,
    Balance_After DECIMAL(15,2),
    Remarks VARCHAR(100),
    PRIMARY KEY (Transaction_ID, Account_No),
    FOREIGN KEY (Account_No) REFERENCES Account(Account_No) ON DELETE RESTRICT
);

CREATE TABLE Loan_Payments(
    Payment_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    Transaction_ID BIGINT,
    Loan_Account_No INT NOT NULL,
    Payment_Date DATE NOT NULL,
    Amount DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (Loan_Account_No) REFERENCES Loan_Account(Account_No) ON DELETE RESTRICT
);

# DROP DATABASE Bank_Management_System;