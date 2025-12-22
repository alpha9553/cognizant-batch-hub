import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.VITE_MYSQL_HOST || 'localhost',
  user: process.env.VITE_MYSQL_USER || 'root',
  password: process.env.VITE_MYSQL_PASSWORD || '',
  database: process.env.VITE_MYSQL_DATABASE || 'cognizant_batch_hub',
  port: parseInt(process.env.VITE_MYSQL_PORT || '3306'),
};

let connection;

const initDB = async () => {
  try {
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
    });
    
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await tempConnection.end();
    
    connection = await mysql.createConnection(dbConfig);
    
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
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

// Save batches (merge with existing data)
app.post('/api/batches', async (req, res) => {
  try {
    const newBatches = req.body;
    
    await connection.beginTransaction();
    
    // Get existing batches
    const [existingBatches] = await connection.query('SELECT * FROM batches');
    const existingBatchIds = existingBatches.map(b => b.id);
    const newBatchIds = newBatches.map(b => b.id);
    
    // Only delete data for batches that are being updated
    for (const batchId of newBatchIds) {
      await connection.query('DELETE FROM trainees WHERE batch_id = ?', [batchId]);
      await connection.query('DELETE FROM stakeholders WHERE batch_id = ?', [batchId]);
      await connection.query('DELETE FROM batches WHERE id = ?', [batchId]);
    }
    
    for (const batch of newBatches) {
      // Insert batch
      await connection.query(`
        INSERT INTO batches (
          id, name, description, total_trainees, trainer, behavioral_trainer, mentor,
          start_date, end_date, status, current_week, total_weeks,
          schedule_on_schedule, schedule_behind, schedule_advanced,
          qualifier_completed, qualifier_date, interim_completed, interim_date,
          final_completed, final_date, room_building, room_floor, room_odc_number,
          qualifier_average, qualifier_highest, qualifier_lowest, qualifier_pass_rate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        batch.id, batch.name, batch.description, batch.totalTrainees,
        batch.trainer, batch.behavioralTrainer, batch.mentor,
        batch.startDate, batch.endDate, batch.status, batch.currentWeek, batch.totalWeeks,
        batch.scheduleStatus.onSchedule, batch.scheduleStatus.behind, batch.scheduleStatus.advanced,
        batch.milestones.qualifier.completed, batch.milestones.qualifier.date,
        batch.milestones.interim.completed, batch.milestones.interim.date,
        batch.milestones.final.completed, batch.milestones.final.date,
        batch.roomDetails?.building, batch.roomDetails?.floor, batch.roomDetails?.odcNumber,
        batch.qualifierScores?.average, batch.qualifierScores?.highest,
        batch.qualifierScores?.lowest, batch.qualifierScores?.passRate
      ]);
      
      // Insert trainees
      if (batch.trainees) {
        for (const trainee of batch.trainees) {
          await connection.query(`
            INSERT INTO trainees (
              id, batch_id, name, email, employee_id, schedule_adherence,
              learning_status, interim_status, final_status, qualifier_score, eligibility
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            trainee.id, batch.id, trainee.name, trainee.email, trainee.employeeId,
            trainee.scheduleAdherence, trainee.learningStatus, trainee.interimStatus,
            trainee.finalStatus, trainee.qualifierScore, trainee.eligibility
          ]);
        }
      }
      
      // Insert stakeholders
      if (batch.stakeholders) {
        for (const [type, stakeholder] of Object.entries(batch.stakeholders)) {
          await connection.query(`
            INSERT INTO stakeholders (batch_id, type, name, hours, hourly_rate, category)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [
            batch.id, type, stakeholder.name, stakeholder.hours || 0,
            stakeholder.hourlyRate || 0, stakeholder.category || 'internal'
          ]);
        }
      }
    }
    
    await connection.commit();
    
    // Get count of preserved vs updated batches
    const [finalBatches] = await connection.query('SELECT COUNT(*) as total FROM batches');
    const preservedCount = finalBatches[0].total - newBatches.length;
    
    res.json({ 
      success: true, 
      message: `${newBatches.length} batches updated, ${preservedCount} existing batches preserved` 
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error saving batches:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get database schema
app.get('/api/schema', async (req, res) => {
  try {
    const [tables] = await connection.query(`
      SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = '${dbConfig.database}'
      ORDER BY TABLE_NAME, ORDINAL_POSITION
    `);
    
    const schema = {};
    tables.forEach(row => {
      if (!schema[row.TABLE_NAME]) {
        schema[row.TABLE_NAME] = [];
      }
      schema[row.TABLE_NAME].push({
        column: row.COLUMN_NAME,
        type: row.DATA_TYPE,
        nullable: row.IS_NULLABLE,
        default: row.COLUMN_DEFAULT
      });
    });
    
    res.json(schema);
  } catch (error) {
    console.error('Error getting schema:', error);
    res.status(500).json({ error: error.message });
  }
});

// Load batches
app.get('/api/batches', async (req, res) => {
  try {
    const [batchRows] = await connection.query('SELECT * FROM batches');
    const [traineeRows] = await connection.query('SELECT * FROM trainees');
    const [stakeholderRows] = await connection.query('SELECT * FROM stakeholders');
    
    const batches = batchRows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      totalTrainees: row.total_trainees,
      trainer: row.trainer,
      behavioralTrainer: row.behavioral_trainer,
      mentor: row.mentor,
      startDate: row.start_date,
      endDate: row.end_date,
      status: row.status,
      currentWeek: row.current_week,
      totalWeeks: row.total_weeks,
      scheduleStatus: {
        onSchedule: row.schedule_on_schedule,
        behind: row.schedule_behind,
        advanced: row.schedule_advanced
      },
      milestones: {
        qualifier: { completed: row.qualifier_completed, date: row.qualifier_date },
        interim: { completed: row.interim_completed, date: row.interim_date },
        final: { completed: row.final_completed, date: row.final_date }
      },
      roomDetails: row.room_building ? {
        building: row.room_building,
        floor: row.room_floor,
        odcNumber: row.room_odc_number
      } : null,
      qualifierScores: {
        average: row.qualifier_average,
        highest: row.qualifier_highest,
        lowest: row.qualifier_lowest,
        passRate: row.qualifier_pass_rate
      },
      trainees: traineeRows
        .filter(t => t.batch_id === row.id)
        .map(t => ({
          id: t.id,
          name: t.name,
          email: t.email,
          employeeId: t.employee_id,
          scheduleAdherence: t.schedule_adherence,
          learningStatus: t.learning_status,
          interimStatus: t.interim_status,
          finalStatus: t.final_status,
          qualifierScore: t.qualifier_score,
          eligibility: t.eligibility
        })),
      stakeholders: stakeholderRows
        .filter(s => s.batch_id === row.id)
        .reduce((acc, s) => ({
          ...acc,
          [s.type]: {
            name: s.name,
            hours: s.hours,
            hourlyRate: s.hourly_rate,
            category: s.category
          }
        }), {})
    }));
    
    res.json(batches);
  } catch (error) {
    console.error('Error loading batches:', error);
    res.status(500).json({ error: error.message });
  }
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});