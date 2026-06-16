import seedDatabase from "./seedDb.js";
import { run, sequelize } from "./dbConnection.js";
import { confirmRelations } from "./allimport.js";
import { runRelationTest } from "./testrelation.js";

await run();
console.log(confirmRelations)
// await seedDatabase();
await runRelationTest();
