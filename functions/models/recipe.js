const mongoose = require('mongoose');
const recipeSchema = require('../schema/author'); // Change to recipe schema path

const RecipeModel = mongoose.model('Recipe', recipeSchema); // Change model name to 'Recipe'

module.exports = RecipeModel;
