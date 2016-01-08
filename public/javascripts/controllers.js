app.controller('UserController', function($scope, $auth, Account) {
  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  $scope.getProfile = function() {
    Account.getProfile()
      .then(function(response) {
        $scope.user = response.data;
        console.log($scope.user)
      })
      .catch(function(response) {
      });
  };

  $scope.getProfile();
})

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
  $scope.myRecipes = [];
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

  if($scope.user) {
    Account.getProfile()
      .then(function(response) {
        response.data.kitchen.forEach(function(food) {
          $scope.kitchen.push(food);
          var index = $scope.suggestions.indexOf(food);
          $scope.suggestions.splice(index, 1);
        })
        response.data.recipes.forEach(function(recipe) {
          $scope.myRecipes.push(recipe);
        })
      })
      .catch(function(response) {
        console.log(response)
      });
  }

  $scope.addSuggestion = function() {
    $scope.kitchen.push(this.item);
    var index = $scope.suggestions.indexOf(this.item);
    $scope.suggestions.splice(index, 1);
    if($scope.user) {
      Account.addFood({food: this.item})
        .then(function(response) {
          console.log(response)
        })
        .catch(function(response) {
          console.log(response)
        });
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
        Account.addFood({food: $scope.ingredient})
          .then(function(response) {
            console.log(response)
          })
          .catch(function(response) {
            console.log(response)
          });
      }
    }
  }

  $scope.removeIngredient = function() {
    var index = $scope.kitchen.indexOf(this.item);
    $scope.kitchen.splice(index, 1);
    if($scope.user) {
      Account.removeFood({food: this.item})
        .then(function(response) {
          console.log(response)
        })
        .catch(function(response) {
          console.log(response)
        });
    }
  }

  $scope.saveRecipe = function() {
    for(var i = 0; i < $scope.myRecipes.length; i++) {
      if($scope.myRecipes[i].id == this.recipe.id) {
        alert('You have already saved this recipe');
      } else {
        $scope.myRecipes.push(this.recipe);
        $scope.ingredient = '';
        if($scope.user) {
          Account.saveRecipe(this.recipe)
            .then(function(response) {
              console.log(response)
            })
            .catch(function(response) {
              console.log(response)
            });
        }
      }
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
      Account.removeRecipe(this.recipe)
        .then(function(response) {
          console.log(response)
        })
        .catch(function(response) {
          console.log(response)
        });
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
}])