var express = require('express');
var router = express.Router();
var unirest = require('unirest');

router.get('/recipes/:ingredients', function(req, res) {
  unirest.get('https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?ingredients=' + req.params.ingredients + '&number=60')
    .header("X-Mashape-Key", process.env.MASHAPE_KEY)
    .header("Accept", "application/json")
    .end(function (results) {
      res.json(results).status(200).end()
    });
});

router.get('*', function(req, res) {
  res.sendFile('index.html', {
    root: __dirname + '/../public'
  })
});

module.exports = router;
