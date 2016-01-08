app.factory('Account', function($http) {
  return {
    getProfile: function() {
      return $http.get('/api/me');
    },
    updateProfile: function(profileData) {
      return $http.put('/api/me', profileData);
    },
    addFood: function(food) {
      return $http.post('/api/me/add', food);
    },
    removeFood: function(food) {
      return $http.post('/api/me/remove', food);
    }
  };
});