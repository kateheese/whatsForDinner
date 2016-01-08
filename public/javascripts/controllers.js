app.controller('LoginController', function($scope, $location, $auth) {
  $scope.login = function() {
    $auth.login($scope.user)
      .then(function() {
        $location.path('/');
      })
      .catch(function(error) {
        console.log(error)
      });
  };
  $scope.authenticate = function(provider) {
    $auth.authenticate(provider)
      .then(function() {
        $location.path('/');
      })
      .catch(function(error) {
        console.log(error)
      });
  };
});

app.controller('LogoutController', function($location, $auth) {
  if (!$auth.isAuthenticated()) { return; }
  $auth.logout()
    .then(function() {
      $location.path('/');
    });
});

app.controller('NavbarController', function($scope, $auth, Account) {
  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  $scope.getProfile = function() {
      Account.getProfile()
        .then(function(response) {
          console.log(response.data)
        })
        .catch(function(response) {
          console.log(response)
        });
    };

    $scope.getProfile();
});

app.controller('CreateController', function($scope, $location, $auth) {
  $scope.create = function() {
    $auth.signup($scope.user)
      .then(function(response) {
        $auth.setToken(response);
        $location.path('/');
      })
      .catch(function(response) {
        console.log(response)
      });
  };
});

app.controller('KitchenController', ['$scope','$http', '$window', 'Account', function($scope, $http, $window, Account) {
  $scope.kitchen = [];
  $scope.recipes;
  $scope.recipeButton = false;
  $scope.numberOfRecipes = 0;
  $scope.error = false;
  $scope.suggestions = [
    'salt',
    'pepper',
    'garlic',
    'olive oil',
    'bread',
    'water',
    'bacon',
    'eggs',
    'carrots',
    'milk',
    'vegetable oil',
    'potatoes',
    'yeast',
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

  Account.getProfile()
    .then(function(response) {
      response.data.kitchen.forEach(function(food) {
        $scope.kitchen.push(food);
      })
    })
    .catch(function(response) {
      console.log(response)
    });

  $scope.addSuggestion = function() {
    $scope.kitchen.push(this.item);
    var index = $scope.suggestions.indexOf(this.item);
    $scope.suggestions.splice(index, 1);
    console.log(this.item)
    Account.addFood({food: this.item})
      .then(function(response) {
        console.log(response)
      })
      .catch(function(response) {
        console.log(response)
      });
  }

  $scope.addIngredient = function() {
    $scope.kitchen.push($scope.ingredient);
    console.log($scope.ingredient)
    $scope.ingredient = '';
    console.log($scope.ingredient)
    Account.addFood({food: $scope.ingredient})
      .then(function(response) {
        console.log(response)
      })
      .catch(function(response) {
        console.log(response)
      });
  }

  $scope.removeIngredient = function() {
    var index = $scope.kitchen.indexOf(this.item);
    $scope.kitchen.splice(index, 1);
    Account.removeFood({food: this.item})
      .then(function(response) {
        console.log(response)
      })
      .catch(function(response) {
        console.log(response)
      });
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
}])