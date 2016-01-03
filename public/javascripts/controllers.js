app.controller('KitchenController', ['$scope','$http', function($scope, $http) {
  $scope.kitchen = [];
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
    'corn starch'
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
}])