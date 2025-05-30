const axios = require('axios');
const fs = require('fs');
const path = require('path');

const sparqlEndpoint = "https://head-nicolea-handsome-nearby-fddbf9c0.koyeb.app/#/dataset/inf4188-ds/sparql";
const imagesBasePath = path.join(__dirname, "../../resources/images");

// Fonction pour rechercher des repas par nom
const searchFoods = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  const sparqlQuery = `
    PREFIX ex: <http://www.semanticweb.org/macdallas/ontologies/2025/4/inf4188#>
    SELECT ?food ?name
    WHERE {
      ?food a ex:Food .
      ?food ex:isFoodName ?name .
      FILTER(CONTAINS(LCASE(?name), LCASE("${query}")))
    }
  `;

  try {
    const response = await axios.get(`${sparqlEndpoint}?query=${encodeURIComponent(sparqlQuery)}&format=json`, {
      headers: { Accept: 'application/sparql-results+json' },
    });
    const results = response.data.results.bindings.map(item => ({
      id: item.food.value,
      name: item.name.value,
    }));
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la recherche des repas: ${error.message}` });
  }
};

// Fonction pour récupérer les détails d'un repas
const getFoodDetails = async (req, res) => {
  const { foodId } = req.params;
  if (!foodId) {
    return res.status(400).json({ error: "Food ID is required" });
  }

  const sparqlQuery = `
    PREFIX ex: <http://www.semanticweb.org/macdallas/ontologies/2025/4/inf4188#>
    SELECT ?name ?group ?imagesLink
    WHERE {
      <${foodId}> ex:isFoodName ?name .
      <${foodId}> ex:belongsToGroup ?group .
      <${foodId}> ex:hasImage ?imagesLink .
    }
  `;

  try {
    const response = await axios.get(`${sparqlEndpoint}?query=${encodeURIComponent(sparqlQuery)}&format=json`, {
      headers: { Accept: 'application/sparql-results+json' },
    });
    const result = response.data.results.bindings[0];
    if (result) {
      res.json({
        name: result.name.value,
        group: result.group.value,
        imagesLink: result.imagesLink.value,
      });
    } else {
      res.status(404).json({ error: "Food not found" });
    }
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la récupération des détails du repas: ${error.message}` });
  }
};

// Fonction pour récupérer les images d'un dossier local
const getFoodImages = async (req, res) => {
  const { folderName } = req.query;
  if (!folderName) {
    return res.status(400).json({ error: "Folder name is required" });
  }

  const folderPath = path.join(imagesBasePath, folderName);

  try {
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: "Dossier introuvable" });
    }

    const images = fs.readdirSync(folderPath, { withFileTypes: true })
      .filter(dirent => dirent.isFile())
      .map(dirent => ({
        fileName: dirent.name,
        link: `${req.protocol}://${req.get('host')}/api/v1/static/${folderName}/${dirent.name}`
      }));

    res.json(images);
  } catch (error) {
    res.status(500).json({ error: `Erreur lors de la récupération des images: ${error.message}` });
  }
};

module.exports = {
  searchFoods,
  getFoodDetails,
  getFoodImages,
};
