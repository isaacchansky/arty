angular.module('starter.controllers', [])

.controller('LocationsCtrl', function($scope, Locations) {
  $scope.location = Locations.current();
})
.controller('StartCtrl', function($scope, $state) {
  $scope.start = function() {
    setTimeout(function() {
      $scope.active = true;
    }, 500);

    setTimeout(function() {
      $scope.almostDone = true;
    }, 1000);

    setTimeout(function() {
      $scope.done = true;
    }, 1500);

    setTimeout(function() {
      $state.go('tab.chat');
    }, 2250);
  }
})

.controller('TabCtrl', function($scope, $rootScope) {
  $scope.setActive = function() {
    $scope.notification = null;
  }
  $rootScope.$on('notification', function(e, data) {
    $scope.notification = 1;
  });
})

.controller('BeaconsCtrl', function($scope, $http) {
  $http.get('../data/PMAPowerofArtHackathon-ibeacons.json')
        .then(function(results) {
          $scope.beacons = results.data;
        });
})

.controller('PassportCtrl', function($scope, $ionicPopup, $state, Likes) {
  $scope.myname = localStorage.name;

  $scope.likes = Likes.getAll();

  $scope.showLikes = function() {
      setTimeout(function() {

        var elems = document.querySelectorAll('.grid-item');

        angular.forEach(elems, function(el) {
          el.style.visibility = "visible";
        });

      }, 100);
  }

  $scope.setEmail = function(email) {
    var leavePopup = $ionicPopup.show({
      title: 'My Current Passport',
      template: 'You have been very busy here is what you have done so far',
      scope: $scope,
      buttons: [
        { text: 'Stay here' },
        {
          text: '<b>Leave</b>',
          type: 'button-positive',
          onTap: function(e) {

          }
        }
      ]
    });

  };


})

.controller('ExitCtrl', function($scope, $ionicPopup, $state) {
  $scope.myname = localStorage.name;

  $scope.setEmail = function(email) {
    var leavePopup = $ionicPopup.show({
      title: 'Thanks',
      template: 'You can leave & reset things for next time, or keep poking around. Up to you!',
      scope: $scope,
      buttons: [
        { text: 'Stay here' },
        {
          text: '<b>Leave</b>',
          type: 'button-positive',
          onTap: function(e) {
            $state.go('start');
          }
        }
      ]
    });

  };


})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})
.controller('GalleriesCtrl', function($scope, Locations, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  // $scope.galleries = [];
  // Galleries.all().then(function(response) {
  //   $scope.allGalleries = response.data;
  //   // just grabbing top 100 for testing...
  //   $scope.galleries = response.data.slice(0, 100);
  // });
  $scope.gallery = {};
  var thing = Locations.current().then(function(data) {
    $scope.gallery = data;
  });

})

.controller('GalleriesDetailCtrl', function($scope, $stateParams, Locations, $ionicViewService, Likes, $ionicModal, $rootScope) {
  $scope.liked = false;
  $scope.item = {};
  $scope.likes = Likes.getAll();

  $ionicModal.fromTemplateUrl('/templates/webview-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  Locations.current().then(function(data) {
    $scope.item = data.objects.filter(function(item){ return item.objectid == $stateParams.objectid; })[0];
  });

  $scope.goBack = function() {
    $ionicViewService.getBackView().go()
  };

  $scope.addLike = function() {
    Likes.addLike($scope.item);
    $scope.liked = !$scope.liked;
    $scope.likes = Likes.getAll();
    if( $scope.item.objectid == 103024) {
      $rootScope.$broadcast('notification', 1);
    }
  }


  $scope.showWebView = function(url) {
    $scope.modal.show();
  }

})

.controller('ChatCtrl', function($scope, Locations, $q, $ionicScrollDelegate, $rootScope) {
  $scope.myname = $scope.myname || localStorage.name;
  $scope.theirname = "Arty";
  $scope.state = {};
  $scope.state.messages = [];


  $scope.$on('message:rendered', function() {
    $scope.state.status = "";
    $scope.$apply();
    $ionicScrollDelegate.scrollBottom();
  });

  $scope.$on('message:started', function(event, name) {
    if(name != $scope.myname) {
      $scope.state.status = name+" is typing...";
    }
  });

  $rootScope.$on('notification', function(e, data) {
    setupResponse(stepOne);
  });

  var stepOne = {
    text: "Hey " + $scope.myname + ", just noticed that you liked a painting by Henry Tanner. I found a connection between Tanner and another artist you liked. Interested?",
    responses: [
      {
        name: "Sure",
        cb: function() {
          makeMessage($scope.myname, "What did you find?")
          .then(function() {
            makeMessage($scope.theirname, "Henry Tanner was the only African-American student at PAFA under Thomas Eakins. Eakins was a controversial artist: not only did he mentor Tanner in a time when racisim was rampant, but he also allowed female students to paint nude male models.").then(function() {
              makeMessage($scope.theirname, "Anyway, Tanner found it hard to paint among the tense racial climate in America. He left to France instead.").then(function() {
                clearResponseButtons();
                setupResponse(cuteResponse);
              })
            });
          })
        }
      } , {
        name: "Not now",
        cb: function() {
          makeMessage($scope.myname, "Not right now")
          .then(function() {
            makeMessage($scope.theirname, "No problem. I've saved this connection for you -- feel free to check it out later!")
            clearResponseButtons();
          })
        }
      }
    ]
  };

  var cuteResponse = {
    text: "If you're interested in more of Tanner's artwork, you can find some in gallery 116, right around the corner!",
    responses: [
    {
      name: "Thanks",
      cb: function() {
        makeMessage($scope.myname, "Thanks")
        .then(function() {
          makeMessage($scope.theirname, "👍");
          clearResponseButtons();
        })
      }
    }]
  }

  var amessage = {
    text: "Sound good?",
    responses: [
      {
        name: "Yeah!",
        cb: function() {
          makeMessage($scope.myname, "Yeah!")
          .then(function() {
            makeMessage($scope.theirname, "Great. Also, you may switch to the Gallery at any time to explore on your own.");
            clearResponseButtons();
          })
        }
      },
      {
        name: "No thanks.",
        cb: function() {
          makeMessage($scope.myname, "No Thanks")
          .then(function() {
            makeMessage($scope.theirname, "Oh, okay.");
            clearResponseButtons();
          })
          .then(function() {
            makeMessage($scope.theirname, "I guess this is goodbye, then.")
          })
        }
      }
    ]
  };

  $scope.setName = function(name) {
    $scope.myname = name;
    localStorage.name = name;
    makeMessage(name, name).then(function() {

      makeMessage($scope.theirname, "Hi, " + $scope.myname + "! It's great to meet you. My name is Arthur, but you can call me "+$scope.theirname+" for short.")
      .then(function() {
        makeMessage($scope.theirname, "As you explore the museum, I'll do my best to enrich your experience.")
        .then(function() {
          setupResponse(amessage);
        });
      })
    });

  }

  $scope.goNext = function(key) {
    console.log(key);
    if (key == 49) {
      setupResponse(stepOne);
    }
  }

  function clearResponseButtons() {
    $scope.currentMessage = {};
  }

  function setupResponse(messageData) {
    makeMessage($scope.theirname, messageData.text).then(function() {
      $scope.currentMessage = messageData;
    })
  }


  function makeMessage(name, message) {
    var deferred = $q.defer();
    var delay = message.length * 10;
    if(name == $scope.myname) {
      delay = 0;
    }
    $scope.$broadcast('message:started', name);
    setTimeout(function() {
      $scope.state.messages.push({
        text: message,
        datetime: new Date(),
        sender: name
      });
      $scope.$broadcast('message:rendered');
      deferred.resolve();
    }, delay);
    return deferred.promise;
  }


  var thing = Locations.current().then(function(data) {
    $scope.gallery = data;
    makeMessage($scope.theirname, "Hi! Welcome to the Philadelphia Museum of Art. Let's get started! What's your name?").then(function() {

      // makeMessage("Art", "Let me know if you have any questions, specifically around the history or process of the pieces in this gallery.");
    })
  });






  $scope.hrTime = function(date) {
    return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  }
});
