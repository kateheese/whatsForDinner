app.controller('KitchenController', ['$scope','$http', '$window', function($scope, $http, $window) {
  $scope.kitchen = [];
  $scope.recipes;
  $scope.recipeButton = false;
  $scope.numberOfRecipes = 0;
  $scope.suggestions = [
    'salt',
    'pepper',
    'garlic',
    'olive oil',
    'eggs',
    'milk',
    'rice',
    'pasta',
    'butter',
    'sugar',
    'flour',
    'vanilla',
    'baking powder',
    'peanut butter',
    'jelly',
    'ketchup',
    'bread'
  ];

  $scope.addSuggestion = function() {
    $scope.kitchen.push(this.item);
    var index = $scope.suggestions.indexOf(this.item);
    $scope.suggestions.splice(index, 1);
  }

  $scope.addIngredient = function() {
    $scope.kitchen.push($scope.ingredient);
    $scope.ingredient = '';
  }

  $scope.removeIngredient = function() {
    var index = $scope.kitchen.indexOf(this.item);
    $scope.kitchen.splice(index, 1);
  }

  $scope.findRecipes = function() {
    $scope.recipeButton = false;
    var ingredients = $scope.kitchen.map(function(elem) {
      return elem.split(' ').join('+');
    }).join('%2C');
    $scope.loading = $http.get('/recipes/' + ingredients).then(function(result){
      result.data.body.forEach(function(elem) {
        if(elem.missedIngredientCount == 0) {
          $scope.numberOfRecipes++;
        }
      })
      $scope.recipeButton = true;
      $scope.recipes = result.data.body.sort(function(a,b) {
          return a.missedIngredientCount - b.missedIngredientCount;
      })
    });
  }

  $scope.goToRecipe = function() {
    $http.get('/recipe/' + this.recipe.id).then(function(result) {
      $window.open(result.data.body.sourceUrl, '_blank');
    })
  }
}])