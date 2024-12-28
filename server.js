const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require("./routes/users");
const dietitianRoutes = require("./routes/dietitian");
const foodRoutes = require("./routes/food");
const meetingRoutes = require("./routes/meeting");
const reservationRoutes = require("./routes/reservation");
const restaurantRoutes = require("./routes/restaurant");
const db = require("./db");
const sequelize = require("./sequelize");
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let corsOptions = {
    credentials: true,
    //origin: 'http://localhost:3000',
    origin: '*',
    //origin: 'https://mimlyricstest5.onrender.com', 
    method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']   
}
app.use(cors(corsOptions));

// create App Database if not exists
/*(async function(){
  db.createDb("postgresdb_iztm"); // nutritional_diary
})();*/

// Synchroniser les modèles avec la base de données
sequelize.sync({force: false})
.then(async () => {
  console.log("Les tables ont été synchronisées");
})
.catch((err) => console.log({"Erreur": err}));

// Importer les données excels

// Start of any route
let routeHead = "/api/v1";

// Routes
app.use(`${routeHead}/auth`, authRoutes);

app.use(`${routeHead}/users`, userRoutes);

//app.use(`${routeHead}/producers`, producerRoutes);

app.use(`${routeHead}/dietitian`, dietitianRoutes);

app.use(`${routeHead}/food`, foodRoutes);

app.use(`${routeHead}/meeting`, meetingRoutes);

app.use(`${routeHead}/reservation`, reservationRoutes);

app.use(`${routeHead}/restaurant`, restaurantRoutes);

// share resources via any route
//app.use(`${routeHead}/static`, express.static(path.join(__dirname, "resources/geojson")));
//console.log(path.join(__dirname, "resources/tiles/Mapnik"));

app.listen(port, () => {
  console.log(`L'API est disponible via http://localhost:${port}`);
});