app.controller('UserController', ['$scope', '$auth', 'Account', function($scope, $auth, Account) {
  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  $scope.getUser = function() {
    Account.getProfile().then(function(response) {
      $scope.user = response.data;
    });
  }

  $scope.getUser();
}]);

app.controller('LoginController', ['$scope', '$location', '$auth', function($scope, $location, $auth) {
  $scope.login = function() {
    $auth.login($scope.user).then(function() {
      $scope.user = {};
      $location.path('/');
    })
  };
  $scope.authenticate = function(provider) {
    $auth.authenticate(provider).then(function() {
      $location.path('/');
    })
  };
}]);

app.controller('LogoutController', ['$location', '$auth', '$scope', function($location, $auth, $scope) {
  if (!$auth.isAuthenticated()) { return; }
  $auth.logout().then(function() {
    $scope.user = {};
    $location.path('/');
  })
}]);

app.controller('CreateController', ['$scope', '$location', '$auth', function($scope, $location, $auth) {
  $scope.create = function() {
    $auth.signup($scope.user).then(function(response) {
      $auth.setToken(response);
      $scope.user = {};
      $location.path('/');
    })
    .catch(function(error) {
      console.log(error)
    });
  };
}]);

app.controller('KitchenController', ['$scope','$http', '$window', 'Account', '$rootScope', function($scope, $http, $window, Account, $rootScope) {
  $scope.kitchen = [];
  $scope.myRecipes = [];
  $scope.recipes;
  $scope.items = [];
  $scope.recipeButton = false;
  $scope.numberOfRecipes = 0;
  $scope.error = false;
  $scope.popoverTemplate = "/partials/popover.html";
  $scope.suggestions = [
    'salt',
    'pepper',
    'butter',
    'sugar',
    'eggs',
    'baking soda',
    'honey',
    'vanilla',
    'baking powder',
    'cinnamon',
    'flour',
    'corn meal',
    'rosemary',
    'cornmeal',
    'garlic',
    'olive oil',
    'bread',
    'cinnamon',
    'water',
    'bacon',
    'eggs',
    'carrots',
    'milk',
    'vegetable oil',
    'potatoes',
    'rice',
    'pasta',
    'butter',
    'sugar',
    'flour',
    'canned tuna',
    'banana',
    'peas',
    'vanilla',
    'baking powder',
    'peanut butter',
    'jelly',
    'tomato',
    'ketchup',
    'chicken',
    'apples',
    'mustard',
    'corn starch',
    'spinach'
  ];

  if($scope.user) {
    Account.getProfile().then(function(response) {
      response.data.kitchen.forEach(function(food) {
        $scope.kitchen.push(food);
        var index = $scope.suggestions.indexOf(food);
        $scope.suggestions.splice(index, 1);
      })
      response.data.recipes.forEach(function(recipe) {
        $scope.myRecipes.push(recipe);
      })
    })
  }

  $scope.addSuggestion = function() {
    $scope.kitchen.push(this.item);
    var index = $scope.suggestions.indexOf(this.item);
    $scope.suggestions.splice(index, 1);
    if($scope.user) {
      Account.addFood({food: this.item});
    }
  }

  $scope.addIngredient = function() {
    if($scope.kitchen.indexOf($scope.ingredient) >= 0) {
      alert('You already have that ingredient in your kitchen');
      $scope.ingredient = '';
    } else {
      $scope.kitchen.push($scope.ingredient);
      $scope.ingredient = '';
      if($scope.user) {
        Account.addFood({food: $scope.ingredient});
      }
    }
  }

  $scope.removeIngredient = function() {
    var index = $scope.kitchen.indexOf(this.item);
    $scope.kitchen.splice(index, 1);
    if($scope.user) {
      Account.removeFood({food: this.item});
    }
  }

  $scope.saveRecipe = function() {
    $scope.myRecipes.push(this.recipe);
    $scope.ingredient = '';
    if($scope.user) {
      Account.saveRecipe(this.recipe);
    }
  }

  $scope.removeRecipe = function() {
    var index;
    for(var i = 0; i < $scope.myRecipes.length; i++) {
      if($scope.myRecipes[i].id == this.recipe.id) {
        index = i;
      }
    }
    $scope.myRecipes.splice(index, 1);
    if($scope.user) {
      Account.removeRecipe(this.recipe);
    }
  }

  $scope.findRecipes = function() {
    if($scope.kitchen.length == 0) {
      $scope.error = true;
    } else {
      $scope.error = false;
      $scope.recipeButton = false;
      $scope.numberOfRecipes = 0;
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
  }

  $scope.goToRecipe = function() {
    $http.get('/recipe/' + this.recipe.id).then(function(result) {
      $window.open(result.data.body.sourceUrl, '_blank');
    })
  }

  $scope.missingIngredients = function() {
    $rootScope.missing = [];
    var common = [];
    var diff = [];
    var ingredients = [];
    $http.get('/recipe/' + this.recipe.id).then(function(result) {
      var obj = result.data.body.extendedIngredients;
      for(var i = 0; i < obj.length; i++) {
        ingredients.push(obj[i].name);
      }
      for(var i = 0; i < $scope.kitchen.length; i++) {
        for(var j = 0; j < ingredients.length; j++) {
          if(_(ingredients[j]).pluralize(1).indexOf(_($scope.kitchen[i]).pluralize(1)) >= 0) {
            common.push(j);
          }
        }
      }
      for(var i = 0; i < ingredients.length; i++) {
        if(common.indexOf(i) < 0) {
          diff.push(ingredients[i]);
        }
      }
      $scope.missing = diff;
      console.log($scope.missing)
    })
  }
}]);