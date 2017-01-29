const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Recipes} = require('../lib/models');
const validator = require('../lib/validation');

// adding some recipes to `Recipes` so there's something
// to retrieve.
Recipes.create(
  'boiled white rice', ['1 cup white rice', '2 cups water', 'pinch of salt']);
Recipes.create(
  'milkshake', ['2 tbsp cocoa', '2 cups vanilla ice cream', '1 cup milk']);


router.get('/', (req, res) => {
  res.json(Recipes.get());
})

router.post('/', jsonParser, (req, res) => {
  validation = validator.validate(req, 'name','ingredients');

  if (!validation.isValid) {
    console.error(validation.message);
    return res.status(400).send(validation.message);
  }

  res.json(Recipes.create(req.body.name,req.body.ingredients));
});

router.put('/:id', jsonParser, (req, res) => {
  validation = validator.validate(req, 'name','ingredients','id');

  if (!validation.isValid) {
    console.error(validation.message);
    return res.status(400).send(validation.message);
  }

  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }

  console.log(`Updating Recipe item [${req.params.id}]`);
  const updatedItem = Recipes.update({
    id: req.params.id,
    name: req.body.name,
    ingredients: req.body.ingredients
  });

  res.status(204).json(updatedItem);
})

router.delete('/:id', (req, res) => {
  Recipes.delete(req.params.id);
  console.log(`Deleted recipe item [${req.params.id}]`);
  res.status(204).end();
});

module.exports = router;