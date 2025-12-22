import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const databaseName = process.env.VITE_MYSQL_DATABASE || 'cognizant_batch_hub';

const dbConfig = {
  host: process.env.VITE_MYSQL_HOST || 'localhost',
  user: process.env.VITE_MYSQL_USER || 'root',
  password: process.env.VITE_MYSQL_PASSWORD || '',
  port: parseInt(process.env.VITE_MYSQL_PORT || '3306'),
};

const dbConfigWithDB = {
  ...dbConfig,
  database: databaseName
};

async function initializeDatabase() {
  let connection;
  
  try {
    // Connect without specifying database
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL server');
    
    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
    console.log(`Database '${databaseName}' created or already exists`);
    
    // Close connection and reconnect with database
    await connection.end();
    connection = await mysql.createConnection(dbConfigWithDB);
    console.log('Connected to database');
    
    // Create batches table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS batches (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        total_trainees INT DEFAULT 0,
        trainer VARCHAR(255),
        behavioral_trainer VARCHAR(255),
        mentor VARCHAR(255),
        start_date VARCHAR(255),
        end_date VARCHAR(255),
        status VARCHAR(50),
        current_week VARCHAR(50),
        total_weeks VARCHAR(50),
        schedule_on_schedule INT DEFAULT 0,
        schedule_behind INT DEFAULT 0,
        schedule_advanced INT DEFAULT 0,
        qualifier_completed BOOLEAN DEFAULT FALSE,
        qualifier_date VARCHAR(255),
        interim_completed BOOLEAN DEFAULT FALSE,
        interim_date VARCHAR(255),
        final_completed BOOLEAN DEFAULT FALSE,
        final_date VARCHAR(255),
        room_building VARCHAR(255),
        room_floor INT,
        room_odc_number VARCHAR(255),
        qualifier_average DECIMAL(5,2),
        qualifier_highest DECIMAL(5,2),
        qualifier_lowest DECIMAL(5,2),
        qualifier_pass_rate DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Batches table created');
    
    // Create trainees table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS trainees (
        id VARCHAR(255) PRIMARY KEY,
        batch_id VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        employee_id VARCHAR(255),
        schedule_adherence VARCHAR(255),
        learning_status VARCHAR(255),
        interim_status VARCHAR(255),
        final_status VARCHAR(255),
        qualifier_score DECIMAL(5,2),
        eligibility VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
      )
    `);
    console.log('Trainees table created');
    
    // Create stakeholders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS stakeholders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        batch_id VARCHAR(255),
        type ENUM('trainer', 'behavioralTrainer', 'mentor', 'buddyMentor'),
        name VARCHAR(255),
        hours DECIMAL(8,2) DEFAULT 0,
        hourly_rate DECIMAL(8,2) DEFAULT 0,
        category ENUM('internal', 'external') DEFAULT 'internal',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
      )
    `);
    console.log('Stakeholders table created');
    
    console.log('Database initialization completed successfully!');
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initializeDatabase();