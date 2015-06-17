# Bind Controller Methods to Route Params for Backbone Marionette AppRouter

This router allows you to bind controller methods to toute params using a leading @ char.

Example of router:
```
  appRoutes: {
    'users/@user/edit': 'onUserEdit',
    'users/@user/copy': 'onUserCopy',
    '*default': 'onDefault'
  }
```

Example of controller:
```
  user: function(id){
    return new User({id: id});
  },
  onUserEdit: function(user) {
    //user is a model
  },
  onUserCopy: function(user) {
    //user is a model
  }
```
