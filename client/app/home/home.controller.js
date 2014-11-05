app = angular.module('blocitoffApp');

app.controller('HomeCtrl', ['$scope', '$http', '$interval', function($scope, $http, $interval) {
  $scope.taskList = [];
  $scope.name = null;
  $scope.description = null;
  $scope.expireTime = 60000; // window to expire tasks, in milliseconds

  $scope.timeRemaining = function(task) {
    return ($scope.expireTime - (moment() - moment(task.created_at)))/1000;
  }

  // Retrieve list of tasks from the database
  $scope.fetchTasks = function() {
    $http.get('/api/tasks').then(
      function(response) {
        $scope.taskList = response.data;
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
  $scope.updateTask = function(task) {
    if (task) {
      $http.put('/api/tasks/' + task._id, task).then(
          function(response) {
            // $scope.taskList.splice(index,1);
            $scope.fetchTasks();
          }, 
          function(errResponse) {
            console.error("Error while updating task: " + task._id + task.description);
          }
      );// $http.delete.then
    } // if
  }; // updateTask


  // set name="open" if closed, and "closed" if open
  $scope.toggleOpenClosed = function(task) {
    if (task.name == "open") {
      task.name = "closed";
      $scope.updateTask(task);
    } 
    else {
      task.name = "open";
      $scope.updateTask(task);
    }
    
  }; // removeTask

  // Remove task from the database
  $scope.removeTask = function(task) {
    if (task._id) {
      $http.delete('/api/tasks/' + task._id).then(
          function(response) {
            // $scope.taskList.splice(index,1);
            $scope.fetchTasks();
          }, 
          function(errResponse) {
            console.error("Error while deleting task: " + task._id);
          }
      );// $http.delete.then
    } // if
  }; // removeTask

  $scope.expireTasks = function() {
    var timediff = 0;
    var d1 = new Date();
    var d2;
    
    for (var i = 0; i < $scope.taskList.length; i++) {
      if ($scope.taskList[i].name == "open") {
        //console.log($scope.taskList[i]);
        d2 = new Date($scope.taskList[i].created_at);
        timediff = d1 - d2;
        console.log(timediff);
      
        if (timediff >= $scope.expireTime) {
          $scope.taskList[i].name="expired";
          $scope.updateTask($scope.taskList[i]);
        }
      } 
    } //for
  }; // expireTasks

  $scope.showDoneTasks = function(task){
    return task.name == "closed" || 
           task.name == "expired";
  };

  
  $interval(function(){
     console.log('ping');
     $scope.expireTasks()
   }, 3000);

  $scope.fetchTasks();

}]); // HomeCtrl controller

// ***************** SERVICES **********************


// ***************** FILTERS **********************

app.filter('timecode', function(){
   return function(seconds) {
     seconds = Number.parseFloat(seconds);
 
     // Returned when no time is provided.
     if (Number.isNaN(seconds)) {
       return '-:--';
     }
 
     // make it a whole number
     var wholeSeconds = Math.floor(seconds); 
     var minutes = Math.floor(wholeSeconds / 60);
 
     remainingSeconds = wholeSeconds % 60;
 
     var output = minutes + ':';
 
     // zero pad seconds, so 9 seconds should be :09
     if (remainingSeconds < 10) {
       output += '0';
     }
 
     output += remainingSeconds;
 
     return output;
   }
 }) //timecode filter





