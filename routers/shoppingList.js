const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {ShoppingList} = require('../lib/models');
const validator = require('../lib/validation');

// we're going to add some items to ShoppingList
// so there's some data to look at
ShoppingList.create('beans', 2);
ShoppingList.create('tomatoes', 3);
ShoppingList.create('peppers', 4);


// when the root of this router is called with GET, return
// all current ShoppingList items
router.get('/', (req, res) => {
  res.json(ShoppingList.get());
});

router.post('/', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  validation = validator.validate(req, 'name','budget');
  if (!validation.isValid) {
    console.error(validation.message);
    return res.status(400).send(validation.message);
  }

  const item = ShoppingList.create(req.body.name, req.body.budget);
  res.status(201).json(item);
});


// when PUT request comes in with updated item, ensure has
// required fields. also ensure that item id in url path, and
// item id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `ShoppingList.update` with updated item.
router.put('/:id', jsonParser, (req, res) => {
  validation = validator.validate(req, 'name','budget','id');

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

  console.log(`Updating shopping list item \`${req.params.id}\``);
  const updatedItem = ShoppingList.update({
    id: req.params.id,
    name: req.body.name,
    budget: req.body.budget
  });
  res.status(204).json(updatedItem);
});

router.delete('/:id', (req, res) => {
  ShoppingList.delete(req.params.id);
  console.log(`Deleted shopping list item \`${req.params.id}\``);
  res.status(204).end();
});

module.exports = router;