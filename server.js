const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require("./routes/users");
const cooperativeRoutes = require("./routes/cooperative");
const exporterRoutes = require("./routes/exporter");
const purchaseRoutes = require("./routes/purchase");
const saleRoutes = require("./routes/sale");
const plotRoutes = require("./routes/plot");
const db = require("./db");
const sequelize = require("./sequelize");
const { importDatas } = require('./import_xlsx');
const path = require("path");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

let corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000',
    //origin: 'https://mimlyricstest5.onrender.com', 
    method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']   
}
app.use(cors(corsOptions));

// create App Database if not exists
(async function(){
  db.createDb("cacaoapp");
})();

// Synchroniser les modèles avec la base de données
sequelize.sync({force: false})
.then(async () => {
  console.log("Les tables ont été synchronisées");
  await importDatas();
})
.catch((err) => console.log({"Erreur": err}));

// Importer les données excels

// Start of any route
let routeHead = "/api/v1";

// Routes
app.use(`${routeHead}/auth`, authRoutes);

app.use(`${routeHead}/users`, userRoutes);

//app.use(`${routeHead}/producers`, producerRoutes);

app.use(`${routeHead}/cooperatives`, cooperativeRoutes);

app.use(`${routeHead}/exporters`, exporterRoutes);

app.use(`${routeHead}/purchases`, purchaseRoutes);

app.use(`${routeHead}/sales`, saleRoutes);

app.use(`${routeHead}/plots`, plotRoutes);

// share resources via any route
app.use(`${routeHead}/static`, express.static(path.join(__dirname, "resources/geojson")));
//console.log(path.join(__dirname, "resources/tiles/Mapnik"));

app.listen(port, () => {
  console.log(`L'API est disponible via http://localhost:${port}`);
});