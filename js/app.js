window.App = Ember.Application.create();

//Router
App.Router.map(function() {
  this.resource('event', function(){
    this.resource('section', { path: ':section_id' } );
  });
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('event');
  }
});

App.ApplicationRoute = Ember.Route.extend();

App.EventRoute = Ember.Route.extend({
  model: function(params){
    return App.Event.find(App.event_id);
  }
});

App.SectionRoute = Ember.Route.extend({
  model: function(params){
    return {id: params['section_id']};
  }
});

//Controllers
App.EventController = Ember.ObjectController.extend();
App.SectionController = Ember.ObjectController.extend();


//Models
App.Store = DS.Store.extend({
  revision: 11,
  adapter: 'DS.FixtureAdapter'
})

App.Event = DS.Model.extend({
  registrations: DS.hasMany('App.Registration'),
  sections: function(){
    var arr = this.get('registrations').getEach('section').uniq().map( function(item){
      return {id: item};
    });

    return Ember.ArrayProxy.create({content: arr, sortProperties: ['id']});
  }.property('registrations.@each.section')
});

App.Registration = DS.Model.extend({
  event: DS.belongsTo('App.Event'),
  seat: DS.attr('string'),
  section: function(){
    return (this.get('seat') || '').substr(0,1);
  }.property('seat')
});

App.Event.FIXTURES = [
  {id: 'MEL121029A', registrations:[1,2,3,4]}
]

App.Registration.FIXTURES = [
  {id: 1, seat: 'C1-1', event_id: 'MEL121029A'},
  {id: 2, seat: 'A2-1', event_id: 'MEL121029A'},
  {id: 3, seat: 'A1-2', event_id: 'MEL121029A'},
  {id: 4, seat: 'A1-3', event_id: 'MEL121029A'}
]
