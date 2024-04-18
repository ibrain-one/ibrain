export const getSchemaMock = () => {
    return `  
    +-----------------+------------------+-----------+-------------+
    | TABLE_NAME      | COLUMN_NAME      | DATA_TYPE | IS_NULLABLE |
    +-----------------+------------------+-----------+-------------+
    | customers       | id               | int       | NO          |
    | customers       | first_name       | varchar   | YES         |
    | customers       | last_name        | varchar   | YES         |
    | customers       | email            | varchar   | YES         |
    | customers       | phone            | varchar   | YES         |
    | customers       | created_at       | timestamp | YES         |
    | customers       | updated_at       | timestamp | YES         |
    | interactions    | id               | int       | NO          |
    | interactions    | customer_id      | int       | YES         |
    | interactions    | interaction_type | varchar   | YES         |
    | interactions    | details          | text      | YES         |
    | interactions    | interaction_date | timestamp | YES         |
    | sales           | id               | int       | NO          |
    | sales           | customer_id      | int       | YES         |
    | sales           | amount           | decimal   | YES         |
    | sales           | sale_date        | timestamp | YES         |
    | support_tickets | id               | int       | NO          |
    | support_tickets | customer_id      | int       | YES         |
    | support_tickets | issue            | varchar   | YES         |
    | support_tickets | status           | varchar   | YES         |
    | support_tickets | created_at       | timestamp | YES         |
    | support_tickets | resolved_at      | timestamp | YES         |
    +-----------------+------------------+-----------+-------------+
    
+-----------------+-------------+------------------------+-----------------------+------------------------+
| TABLE_NAME      | COLUMN_NAME | CONSTRAINT_NAME        | REFERENCED_TABLE_NAME | REFERENCED_COLUMN_NAME |
+-----------------+-------------+------------------------+-----------------------+------------------------+
| interactions    | customer_id | interactions_ibfk_1    | customers             | id                     |
| sales           | customer_id | sales_ibfk_1           | customers             | id                     |
| support_tickets | customer_id | support_tickets_ibfk_1 | customers             | id                     |
+-----------------+-------------+------------------------+-----------------------+------------------------+

`
}
