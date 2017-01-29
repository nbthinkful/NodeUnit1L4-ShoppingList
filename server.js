
const express = require('express');
const morgan = require('morgan');

const shoppingListRouter = require('./routers/shoppingList');
const receiptsRouter = require('./routers/receipts');
const app = express();

// log the http layer
app.use(morgan('common'));

app.use('/shopping-list',shoppingListRouter);
app.use('/recipes',receiptsRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});