app.controller('KitchenController', ['$scope','$http', function($scope, $http) {
  $scope.kitchen = [];
  $scope.recipes;
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
    'corn starch',
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
    var ingredients = $scope.kitchen.map(function(elem) {
      return elem.split(' ').join('+');
    }).join('%2C');
    $http.get('/recipes/' + ingredients).then(function(result){
      $scope.recipes = result.data.body.sort(function(a,b) {
          return a.missedIngredientCount - b.missedIngredientCount;
      })
    });
  }
}])