angular.module('starter.services', [])

.factory('Locations', function($http) {

  // Tidy up and consolidate fields
  function cleanObject(object) {
    var titles = [];
    if(object.titleOfWork1) titles.push(object.titleOfWork1)
    if(object.titleOfWork2) titles.push(object.titleOfWork2)
    if(object.titleOfWork3) titles.push(object.titleOfWork3)
    if(object.titleOfWork4) titles.push(object.titleOfWork4)
    if(object.titleOfWork5) titles.push(object.titleOfWork5)
    if(object.titleOfWork6) titles.push(object.titleOfWork6)
    if(object.titleOfWork7) titles.push(object.titleOfWork7)
    object.title = titles.join(', ');

    var artists = [];
    if(object.artistName1) artists.push(object.artistName1)
    if(object.artistName2) artists.push(object.artistName2)
    if(object.artistName3) artists.push(object.artistName3)
    if(object.artistName4) artists.push(object.artistName4)
    if(object.artistName5) artists.push(object.artistName5)
    if(object.artistName6) artists.push(object.artistName6)
    if(object.artistName7) artists.push(object.artistName7)
    object.artist = artists.join(', ');
    return object;
  }
  // Alias is the gallery ID. What we want to do
  // is grab the gallery ID, then search through
  // collection data to fetch an object in that
  // gallery and return the gallery information...
  // using regex?
  // Parse between the first comma and the second comma.
  var returnObjectsInGallery = function(id) {

    var gallery = {
      id: id,
      title : "",
      objects : []
    };

    var galleryRegex = new RegExp(" " + id + ",","g");
    var removeRegexBeginning = /^\w*\s*\d*,/g;
    var removeRegexEnding = /,(?=[^,]*$).*/g;
    // Gallery title regex will grab everything after Gallery ###,
    // and before the last comma.
    var regex = /,.*,/g;

    var res = $http.get('../data/PMAPowerofArtHackathon-collectiondata.json')
      .then(function(results) {
        var objects = results.data;
        _.each(objects, function(object) {
          var desc = object.galleryLocation;
          if (galleryRegex.test(desc)) {
            object = cleanObject(object)
            gallery.objects.push(object)
          }
        });
        var galleryTitle = gallery.objects[0].galleryLocation;

        galleryTitle = galleryTitle.replace(removeRegexBeginning, '');
        galleryTitle = galleryTitle.replace(removeRegexEnding, '');

        gallery.title = galleryTitle.trim();

        return gallery;
      });

      return res;
  }

  return {
    current: function() {
      return returnObjectsInGallery("116");
    },
    // Return user's previous location?
    // Could be used to "bridge the gap" -- provide facts about the purposeful transition between locations?
    previous: function() {

    },
    // Fetch adjacent locations?
    next: function() {

    }
  }

})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };


})

.factory('Galleries', function($http) {
  return {
    all: function() {
      return $http.get('data/PMAPowerofArtHackathon-collectiondata.json');
    }
  };
})

.factory('Likes', function() {

  function get() {
    var likes;
    try {
      likes = JSON.parse(localStorage.likes);
    } catch (e) {
      likes = [];
      set(likes);
    }
    return likes;
  }

  function set(likes) {
    localStorage.likes = JSON.stringify(likes);
  }

  function excludesLike(likes, like) {
    var res = likes.filter(function(item) {
      return item.objectid == like.objectid;
    });
    return res.length == 0;
  }

  return {
    getAll : function() {
      return get();
    },
    addLike: function(likeObj) {
      var likes = get();
      if(excludesLike(likes, likeObj)) {
        likes.push(likeObj);
      }
      set(likes);
      return likes;
    }
  }
});
