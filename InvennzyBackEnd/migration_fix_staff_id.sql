-- Fix staff_id column to support comma-separated values
-- Run this SQL query in your database

ALTER TABLE labassistant 
MODIFY COLUMN staff_id VARCHAR(255) NULL;
