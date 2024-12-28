const jwt = require('jsonwebtoken');
const { User } = require('../models/models');


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = await User.create({ name, email, password });
    
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        "name": newUser.name,
        "email": newUser.email
      }
    });
  } catch (err) {
    res.status(400).json({
      message: "Impossible de créé l'utilisateur",
      error: err
    });
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    //console.log({ "user": user.password });
    //console.log({ "valid pass": await user.validPassword(password) });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const isPasswordValid = await user.validPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Génère un token JWT avec l'ID de l'utilisateur
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Payload du token
      process.env.JWT_SECRET, // Clé secrète pour signer le token
      { expiresIn: '15d' } // Durée de validité du token
    );

    res.cookie("token", token, {
      maxAge: 15 * 24 * 3600,
      httpOnly: true,
      secure: true,
      sameSite: 'Strict'
    });

    let data = {
      "id": user.id,
      "name": user.name,
      "email": user.email
    };

    res.status(200).json({ message: 'Connexion réussie', user: data, token });
  } catch (err) {
    res.status(400).json({ message: "Une erreur s'est produite pendant la connexion", error: err.message });
  }
}

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict'
    });

    res.status(200).json({ message: 'Déconnexion...' });
  } catch (err) {
    res.status(400).json({ message: "Une erreur s'est produite pendant la connexion", error: err.message });
  }
}
