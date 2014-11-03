app = angular.module('blocitoffApp');

app.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.taskList = [];
  $scope.curTask = null;

  $scope.addTask = function() {
    if ($scope.curTask) {
      $scope.taskList.push($scope.curTask);
      $scope.curTask = null;
    }
  } // addTask

}]);