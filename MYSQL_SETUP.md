# MySQL Database Setup

This application now uses MySQL to store batch data locally. When you upload Excel files, the data will be saved to the database and override any existing data.

## Prerequisites

1. **MySQL Server** - Install MySQL Server on your local machine
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP which includes MySQL

## Setup Instructions

### 1. Configure Database Connection

Update the MySQL configuration in `.env` file:

```env
# MySQL Configuration
VITE_MYSQL_HOST=localhost
VITE_MYSQL_USER=root
VITE_MYSQL_PASSWORD=your_mysql_password
VITE_MYSQL_DATABASE=cognizant_batch_hub
VITE_MYSQL_PORT=3306
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Initialize Database

Run the database initialization script to create the required tables:

```bash
npm run init-db
```

This will create:
- `batches` table - stores batch information
- `trainees` table - stores trainee details
- `stakeholders` table - stores trainer/mentor information

### 4. Start the Application

```bash
npm run dev
```

## How It Works

1. **Excel Upload**: When you upload an Excel file, the data is parsed and saved to MySQL database
2. **Override Functionality**: Each new Excel upload will completely replace existing data in the database
3. **Data Persistence**: All batch data is now stored locally in MySQL instead of browser memory
4. **Automatic Loading**: On app startup, data is loaded from the database

## Database Schema

### Batches Table
- Stores batch metadata, schedule status, milestones, and qualifier scores
- Primary key: `id`

### Trainees Table  
- Stores individual trainee information and progress
- Foreign key: `batch_id` references `batches.id`

### Stakeholders Table
- Stores trainer, mentor, and behavioral trainer information
- Foreign key: `batch_id` references `batches.id`

## Troubleshooting

1. **Connection Issues**: Ensure MySQL server is running and credentials are correct
2. **Permission Errors**: Make sure MySQL user has CREATE/INSERT/UPDATE/DELETE permissions
3. **Port Conflicts**: Check if port 3306 is available or change to different port

## Fallback Behavior

If database connection fails, the application will fall back to using mock data to ensure functionality continues.