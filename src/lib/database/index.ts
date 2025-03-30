
// Export all database related functions from a single entry point
export { setupTasksTable } from './table-setup';
export { initializeDatabase } from './check-schema';
export { createCustomFunction, executeDirectSQL } from './sql-executor';
