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

  // go through task list and mark tasks past the time limit as expired
  $scope.expireTasks = function() {   
    for (var i = 0; i < $scope.taskList.length; i++) {
      if ($scope.taskList[i].name == "open") {
        //console.log($scope.taskList[i]);
      
        if ($scope.timeRemaining($scope.taskList[i]) <= 0) {
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
       return '0d --:--:--';
     }
 
     // make it a whole number
     var wholeSeconds = Math.floor(seconds); 
     var numDays = Math.floor(wholeSeconds / 86400);
     var numHours = Math.floor((wholeSeconds % 86400) / 3600);
     var numMinutes = Math.floor(((wholeSeconds % 86400) % 3600) / 60);
     var numSeconds = ((wholeSeconds % 86400) % 3600) % 60;

     var output = numDays + "d ";

     // zero pad hours, so 9 hours is 09
     if (numHours < 10) {
          output += '0';
     }
     output += numHours + ':';

     // output minutes
     if (numMinutes < 10) {
          output += '0';
     }
     output += numMinutes + ':';
 
     // output seconds
     if (numSeconds < 10) {
       output += '0';
     }
     output += numSeconds;

     return output;
   }
 }) //timecode filter





