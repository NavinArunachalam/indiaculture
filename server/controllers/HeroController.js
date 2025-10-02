const heroService = require("../services/HeroService");

const getHeroes = async (req, res, next) => {
  try {
    const heroes = await heroService.fetchHero();
    res.json(heroes);
  } catch (error) {
    next(error);
  }
};

const createHero = async (req, res, next) => {
  try {
    const productId = req.body.product;
    const files = req.files || [];
    const is_active = req.body.is_active !== undefined ? req.body.is_active : true;

    const hero = await heroService.addHero(productId, files, [], is_active);
    res.status(201).json(hero);
  } catch (error) {
    next(error);
  }
};

const updateHero = async (req, res, next) => {
  try {
    const id = req.params.id;
    const productId = req.body.product;
    const files = req.files || [];
    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const is_active = req.body.is_active !== undefined ? req.body.is_active : true;

    const hero = await heroService.updateHero(id, productId, files, existingImages, is_active);
    res.json(hero);
  } catch (error) {
    next(error);
  }
};

const deleteHero = async (req, res, next) => {
  try {
    const id = req.params.id;
    await heroService.deleteHero(id);
    res.json({ message: "Hero deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getHeroes, createHero, updateHero, deleteHero };
