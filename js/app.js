window.App = Ember.Application.create();

//Router
App.Router.map(function() {
  this.resource('chart');
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('chart');
  }
});

App.ApplicationRoute = Ember.Route.extend();

App.ChartRoute = Ember.Route.extend({
  model: function(params){
    return App.Event.find(App.event_id);
  }
});

//Controllers
App.ChartController = Ember.ObjectController.extend({
  selectSection: function(section){
    this.get('model').set('selectedSection', section);
  },
  editRegistration: function(registration){
    this.get('model').set('registrationEditing', registration);
  }
});

//Models
App.Store = DS.Store.extend({
  revision: 11
})

App.Event = DS.Model.extend({
  registrations: DS.hasMany('App.Registration'),
  name: DS.attr('string'),
  registrationEditing: null,
  sections: function(){
    var arr = this.get('registrations').getEach('section').uniq().sort();
    return Ember.ArrayProxy.create({content: arr, sortAscending: true});
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
