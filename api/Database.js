import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("zielinski_jakub_4i1b.db");

const tableName = 'LogiReminderApp';
export class Database {

        static createTable = () => db.transaction(tx =>
            tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableName} (
                    id integer primary key not null, 
                    summary text,
                    fullDate text,
                    ymd text, 
                    hour INTEGER, 
                    minute INTEGER,
                    editable INTEGER,
                    identifier text,
                    active INTEGER
                );`
            )
        );

        static add = (summary, fullDate, ymd, hour, minute, editable, identifier, active) => {
            db.transaction(tx => 
                tx.executeSql(
                    `INSERT INTO ${tableName} (summary, fullDate, ymd, hour, minute, editable, identifier, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [summary, fullDate, ymd, hour, minute, editable, identifier, active], // Use an array for parameters
                    (tx, result) => {
                        console.log('Insert successful');
                    },
                    (tx, error) => {
                        console.error('Insert error:', error);
                    }
                )
            );
        };

        static update = (id, summary, fullDate, ymd, hour, minute, editable, identifier, active) => {
            db.transaction(tx => 
                tx.executeSql(
                    `UPDATE ${tableName} 
                     SET summary = ?, fullDate = ?, ymd = ?, hour = ?, minute = ?, editable = ?, identifier = ?, active = ? 
                     WHERE id = ?;`,
                    [summary, fullDate, ymd, hour, minute, editable, identifier, active, id],
                    (tx, result) => {
                        console.log('Update successful');
                    },
                    (tx, error) => {
                        console.error('Update error:', error);
                    }
                )
            );
        };
        

        static getAll = () => {
            var query = `SELECT * FROM ${tableName};`;
        
            return new Promise((resolve, reject) => db.transaction((tx) => {
                tx.executeSql(query, [], (tx, results) => {
                    const rows = results.rows._array; // Access the rows array
                    resolve(rows); // Resolve with the array of rows
                }, (tx, error) => reject(error));
            }));
        }

        static remove = (id) => {
            db.transaction(tx => 
                tx.executeSql(
                    `DELETE FROM ${tableName} WHERE id = ?;`,
                    [id],
                    (tx, result) => {
                        console.log('Delete successful');
                    },
                    (tx, error) => {
                        console.error('Delete error:', error);
                    }
                )
            );
        };
        
        static removeAll = () => {
            db.transaction(tx => {
                tx.executeSql(
                    `DELETE FROM ${tableName};`,
                    [],
                    (tx, result) => {
                        console.log('All records deleted');
                    },
                    (tx, error) => {
                        console.error('Delete all error:', error);
                    }
                );
            });
        };
        
}