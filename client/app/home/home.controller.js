app = angular.module('blocitoffApp');

app.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.taskList = [];
  $scope.name = null;
  $scope.description = null;
  $scope.expiration = 60; // window to expire tasks in seconds

  // Retrieve list of tasks from the database
  $scope.fetchTasks = function() {
    $http.get('/api/tasks').then(
      function(response) {
        $scope.taskList = response.data;
        console.log('finished retrieving tasks:');
        console.log($scope.taskList)
      }, 
      function(errResponse) {
        console.error("Error while fetching task list");
      }
    ); // http.get.then
  } // fetchTasks

// Add a task to the task list
  $scope.addTask = function() {
    var newTask = {};
    if ($scope.description) {
      newTask.name = "open";
      newTask.description = $scope.description;
      $http.post('/api/tasks', newTask).then(
        function(response) {
          $scope.fetchTasks();
          $scope.name = null;
          $scope.description = null;
        },
        function(response) {
          console.error("Error adding task to database");
        }
      ); // $http.post
    } // if
  } // addTask

  // Update task in the database
  $scope.updateTask = function(index, value) {
    if (index >= 0) {
      $http.post('/api/tasks/' + $scope.taskList[index]._id, $scope.taskList[index]).then(
          function(response) {
            // $scope.taskList.splice(index,1);
            $scope.fetchTasks();
          }, 
          function(errResponse) {
            console.error("Error while updating task: " + $scope.taskList[index]._id + $scope.taskList[index].description);
          }
      );// $http.delete.then
    } // if
  }; // updateTask

  // set name="open" if closed, and "closed" if open
  $scope.toggleOpenClosed = function(index) {
    if ($scope.taskList[index].name == "open") {
      $scope.taskList[index].name = "closed";
      $scope.updateTask(index, "closed");
    } 
    else {
      $scope.taskList[index].name = "open";
      $scope.updateTask(index, "open");
    }
    
  }; // removeTask

  // Remove task from the database
  $scope.removeTask = function(index) {
    if (index >= 0) {
      $http.delete('/api/tasks/' + $scope.taskList[index]._id).then(
          function(response) {
            // $scope.taskList.splice(index,1);
            $scope.fetchTasks();
          }, 
          function(errResponse) {
            console.error("Error while deleting task: " + $scope.taskList[index]._id);
          }
      );// $http.delete.then
    } // if
  }; // removeTask

  $scope.fetchTasks();
}]);