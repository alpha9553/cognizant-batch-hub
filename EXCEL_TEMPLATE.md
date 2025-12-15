# Excel File Template for Coach Dashboard

## Required Excel Columns

Your Excel file should contain the following columns for proper parsing:

| Column Name | Required | Description | Example |
|-------------|----------|-------------|---------|
| Batch ID | Yes | Unique identifier for the batch | B001 |
| Batch Name | No | Name of the batch | Java Full Stack - Batch 1 |
| Description | No | Course description | Full Stack Java Development |
| Trainer | No | Primary trainer name | John Smith |
| Behavioral Trainer | No | BH Trainer name | Sarah Johnson |
| Mentor | No | Mentor name | Mike Wilson |
| Start Date | No | Training start date | 2024-01-15 |
| End Date | No | Training end date | 2024-04-15 |
| Status | No | Batch status (active/graduated) | active |
| Schedule Status | No | Trainee status (On Schedule/Behind/Advanced) | On Schedule |
| Building | No | Building name | SDB1 |
| Floor | No | Floor number | 2 |
| ODC Number | No | Room/ODC number | ODC-201 |
| Qualifier Completed | No | Yes/No | Yes |
| Qualifier Date | No | Date of qualifier | 2024-02-01 |
| Interim Completed | No | Yes/No | No |
| Interim Date | No | Date of interim | 2024-03-01 |
| Final Completed | No | Yes/No | No |
| Final Date | No | Date of final | 2024-04-10 |
| Trainer Hours | No | Hours worked by trainer | 100 |
| Trainer Rate | No | Hourly rate for trainer | 500 |
| BH Trainer Hours | No | Hours worked by BH trainer | 80 |
| BH Trainer Rate | No | Hourly rate for BH trainer | 450 |
| Mentor Hours | No | Hours worked by mentor | 100 |
| Mentor Rate | No | Hourly rate for mentor | 600 |
| Qualifier Avg | No | Average qualifier score | 75 |
| Qualifier High | No | Highest qualifier score | 95 |
| Qualifier Low | No | Lowest qualifier score | 45 |
| Qualifier Pass Rate | No | Pass rate percentage | 85 |

## Sample Data Structure

Each row represents a trainee in a batch. Multiple rows with the same Batch ID will be grouped together.

```
Batch ID | Batch Name              | Trainer    | Schedule Status | Building | ...
---------|-------------------------|------------|-----------------|----------|----
B001     | Java Full Stack - Batch 1| John Smith | On Schedule     | SDB1     | ...
B001     | Java Full Stack - Batch 1| John Smith | Behind          | SDB1     | ...
B001     | Java Full Stack - Batch 1| John Smith | On Schedule     | SDB1     | ...
B002     | React Development       | Jane Doe   | Advanced        | SDB2     | ...
```

## Notes

1. **Batch ID is required** - This is used to group trainees into batches
2. Multiple rows with same Batch ID = multiple trainees in that batch
3. Schedule Status determines the pie chart distribution
4. The dashboard automatically calculates totals and percentages
5. Dates can be in various formats (YYYY-MM-DD, DD/MM/YYYY, etc.)
