window.App = Ember.Application.create();

//Router
App.Router.map(function() {
  this.resource('sections', function(){
    this.resource('section', { path: ':section_id' } );
  });
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('sections');
  }
});

App.ApplicationRoute = Ember.Route.extend();

App.SectionsRoute = Ember.Route.extend({
  model: function(params){
    return [
      {id:"A"},
      {id:"B"},
      {id:"C"},
      {id:"D"},
      {id:"E"},
      {id:"F"}
      ];
  }
});

App.SectionRoute = Ember.Route.extend({
  model: function(params){
    return {id: params['section_id']};
  }
});

//Controllers
App.SectionsController = Ember.ArrayController.extend();
App.SectionController = Ember.ObjectController.extend();
