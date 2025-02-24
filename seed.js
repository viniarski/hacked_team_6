import { connect } from "./src/utils/connect.js";

const db = connect();

const emptyAllTables = async () => {
    try {
        await db.query("BEGIN");
        await db.query("TRUNCATE TABLE pi_data RESTART IDENTITY CASCADE");
        await db.query("COMMIT");
        console.log("All tables emptied successfully");
    } catch (error) {
        await db.query("ROLLBACK");
        console.error("Error emptying tables: ", error);
    }
};

emptyAllTables();