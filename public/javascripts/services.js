app.factory('Account', function($http) {
  return {
    getProfile: function() {
      return $http.get('/api/me');
    },
    updateProfile: function(profileData) {
      return $http.put('/api/me', profileData);
    },
    addFood: function(food) {
      return $http.post('/api/me/add-food', food);
    },
    removeFood: function(food) {
      return $http.post('/api/me/remove-food', food);
    },
    saveRecipe: function(recipe) {
      return $http.post('/api/me/save-recipe', recipe);
    },
    removeRecipe: function(recipe) {
      return $http.post('/api/me/remove-recipe', recipe);
    }
  };
});

app.factory('underscore', function() {
  return window._;
});