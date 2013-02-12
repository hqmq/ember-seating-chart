window.App = Ember.Application.create();

//Router
App.Router.map(function() {
  this.resource('event');
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

//Controllers
App.EventController = Ember.ObjectController.extend({
  selectSection: function(section){
    this.get('model').set('selectedSection', section);
  }
});

//Models
App.Store = DS.Store.extend({
  revision: 11,
  adapter: 'DS.FixtureAdapter'
})

App.Event = DS.Model.extend({
  registrations: DS.hasMany('App.Registration'),
  sections: function(){
    var arr = this.get('registrations').getEach('section').uniq();
    return Ember.ArrayProxy.create({content: arr});
  }.property('registrations.@each.section'),

  rows: function(){
    return this.get('registrations').getEach('row').reduce(function(agg,item){
      return item > agg ? item : agg;
    }, 1);
  }.property('registrations.@each.row'),

  columns: function(){
    return this.get('registrations').getEach('column').reduce(function(agg,item){
      return item > agg ? item : agg;
    }, 1);
  }.property('registrations.@each.column'),

  selectedSection: DS.attr('string'),
  sectionRegistrations: function(){
    var section = this.get('selectedSection');
    return this.get('registrations').filter( function(item){
      return item.get('section') == section;
    });
  }.property('selectedSection', 'registrations.@each.seat'),

  seats: function(){
    var rows = this.get('rows');
    var columns = this.get('columns');
    var seats = [];
    for( var i = 0; i < rows; i++ ){
      seats.push( [] )
      for( var j = 0; j < columns; j++) {
        seats[i].push(null)
      }
    }
    return Ember.ArrayProxy.create({content: seats});
  }.property('registrations.@each.seat')
});

App.Registration = DS.Model.extend({
  event: DS.belongsTo('App.Event'),
  seat: DS.attr('string'),
  seatParts: function(){
    return this.get('seat') ? this.get('seat').match(/^([A-Z])(\d)-(\d)$/) : null;
  }.property('seat'),
  section: function(){
    return this.get('seatParts') ? this.get('seatParts')[1] : '';
  }.property('seatParts'),
  row: function(){
    return this.get('seatParts') ? this.get('seatParts')[2] : 0;
  }.property('seatParts'),
  column: function(){
    return this.get('seatParts') ? this.get('seatParts')[3] : 0;
  }.property('seatParts')
});

App.Event.FIXTURES = [
  {id: 'MEL121029A', registrations:[1,2,3,4,5,6,7,8,9,10,11,12]}
]

App.Registration.FIXTURES = [
  {id: 1, seat: 'C1-1', event_id: 'MEL121029A'},
  {id: 2, seat: 'A2-1', event_id: 'MEL121029A'},
  {id: 3, seat: 'A1-2', event_id: 'MEL121029A'},
  {id: 4, seat: 'A1-3', event_id: 'MEL121029A'},
  {id: 5, seat: 'A3-3', event_id: 'MEL121029A'},
  {id: 6, seat: 'D1-1', event_id: 'MEL121029A'},
  {id: 7, seat: 'D1-2', event_id: 'MEL121029A'},
  {id: 8, seat: 'D1-3', event_id: 'MEL121029A'},
  {id: 9, seat: 'B1-1', event_id: 'MEL121029A'},
  {id: 10, seat: 'B2-3', event_id: 'MEL121029A'},
  {id: 11, seat: 'B3-3', event_id: 'MEL121029A'},
  {id: 12, seat: 'B2-2', event_id: 'MEL121029A'}
]
