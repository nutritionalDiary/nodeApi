const express = require('express');
const authRoutes = require('./routes/auth');
const userRoutes = require("./routes/users");
const dietitianRoutes = require("./routes/dietitian");
const foodRoutes = require("./routes/food");
const meetingRoutes = require("./routes/meeting");
const reservationRoutes = require("./routes/reservation");
const restaurantRoutes = require("./routes/restaurant");
const wsRoutes = require("./routes/searchFood");
const db = require("./db");
const sequelize = require("./sequelize");
const path = require("path");
const cors = require("cors");
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let corsOptions = {
    credentials: true,
    //origin: 'http://localhost:3000' 
    origin: '*',
    //origin: 'https://mimlyricstest5.onrender.com', 
    method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']   
}
app.use(cors(corsOptions));

// create App Database if not exists
(async function(){
  db.createDb("nutritional_diary"); // nutritional_diary  postgresdb_iztm
})();

// Synchroniser les modèles avec la base de données
//sequelize.sync({force: false})
//sequelize.sync({force: true})
sequelize.sync({alter: true})
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

app.use(`${routeHead}/dietitians`, dietitianRoutes);

app.use(`${routeHead}/foods`, foodRoutes);

app.use(`${routeHead}/meetings`, meetingRoutes);

app.use(`${routeHead}/reservations`, reservationRoutes);

app.use(`${routeHead}/restaurants`, restaurantRoutes);

app.use(`${routeHead}/ws`, wsRoutes);

// share resources via any route
//app.use(`${routeHead}/static`, express.static(path.join(__dirname, "resources/geojson")));
app.use(`${routeHead}/static`, express.static(path.join(__dirname, "resources/images")));

// Route pour lister les dossiers dans resources/images
app.get(`${routeHead}/image-folders`, (req, res) => {
  const imagesPath = path.join(__dirname, "resources/images");

  try {
    const folders = fs.readdirSync(imagesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => ({
        folderName: dirent.name,
        link: `${req.protocol}://${req.get('host')}${routeHead}/image-folders/${dirent.name}`
      }));

    res.json(folders);
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la lecture des dossiers: ${error.message}` });
  }
});

// Route pour lister les fichiers dans un dossier spécifique
app.get(`${routeHead}/image-folders/:folderName`, (req, res) => {
  const { folderName } = req.params;
  const folderPath = path.join(__dirname, "resources/images", folderName);

  try {
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: "Dossier introuvable" });
    }

    const files = fs.readdirSync(folderPath, { withFileTypes: true })
      .filter(dirent => dirent.isFile())
      .map(dirent => ({
        fileName: dirent.name,
        link: `${req.protocol}://${req.get('host')}${routeHead}/static/${folderName}/${dirent.name}`
      }));

    res.json(files);
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la lecture des fichiers: ${error.message}` });
  }
});

//console.log(path.join(__dirname, "resources/tiles/Mapnik"));

app.listen(port, '0.0.0.0', () => {
  console.log(`L'API est disponible via http://localhost:${port}`);
});