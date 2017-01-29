
const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const validator = require('./lib/validation');
const {ShoppingList, Recipes} = require('./lib/models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));

// we're going to add some items to ShoppingList
// so there's some data to look at
ShoppingList.create('beans', 2);
ShoppingList.create('tomatoes', 3);
ShoppingList.create('peppers', 4);

// adding some recipes to `Recipes` so there's something
// to retrieve.
Recipes.create(
  'boiled white rice', ['1 cup white rice', '2 cups water', 'pinch of salt']);
Recipes.create(
  'milkshake', ['2 tbsp cocoa', '2 cups vanilla ice cream', '1 cup milk']);

// when the root of this router is called with GET, return
// all current ShoppingList items
app.get('/shopping-list', (req, res) => {
  res.json(ShoppingList.get());
});

app.post('/shopping-list', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  validation = validator.validate(req, 'name','budget');
  if (!validation.isValid) {
    console.error(validation.message);
    return res.status(400).send(validation.message);
  }

  const item = ShoppingList.create(req.body.name, req.body.budget);
  res.status(201).json(item);
});

app.delete('/shopping-list/:id', (req, res) => {
  ShoppingList.delete(req.params.id);
  console.log(`Deleted shopping list item \`${req.params.id}\``);
  res.status(204).end();
});

app.get('/recipes', (req, res) => {
  res.json(Recipes.get());
})

app.post('/recipes', jsonParser, (req, res) => {
  validation = validator.validate(req, 'name','ingredients');

  if (!validation.isValid) {
    console.error(validation.message);
    return res.status(400).send(validation.message);
  }

  res.json(Recipes.create(req.body.name,req.body.ingredients));
});

app.delete('/recipes/:id', (req, res) => {
  Recipes.delete(req.params.id);
  console.log(`Deleted recipe item [${req.params.id}]`);
  res.status(204).end();
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});