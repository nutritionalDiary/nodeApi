const { Sequelize } = require("sequelize");
require('dotenv').config();

/*import { Sequelize } from "sequelize";
import dotenvPkg from "dotenv";
const { dotenv } = dotenvPkg;
dotenv.config();*/

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        dialectOptions: {
             /*ssl: {
                 require: true,
                 rejectUnauthorized: false, // Modifier si nécessaire
             },*/
            ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false,
        },
    }
);

sequelize.authenticate()
.then(() => console.log("Connexion à postgresql reussie"))
.catch((err) => console.error({"Erreur" : err}));

module.exports = sequelize;
// export { sequelize };
// export default sequelize;