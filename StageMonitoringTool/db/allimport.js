import User from "./userModel/user";
import sequelize from "./dbConnection";


const sync_DB = async() => {
   await sequelize.sync({force: true})
}

export default sync_DB;