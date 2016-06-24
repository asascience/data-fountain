/*****************************************************************************/
/* Admin: Event Handlers */
/*****************************************************************************/
Template.Admin.events({
});

/*****************************************************************************/
/* Admin: Helpers */
/*****************************************************************************/
Template.Admin.helpers({
	
	
	 categories: function(){
		
		  let listOfStations = Stations.find().fetch();
		  
		 
		  var StationsNames = [];
    

    _.each(listOfStations, (obj) => {

                StationsNames.push(obj.title);
            
    });
		 
        return StationsNames;
    },
	
//options


  
	
});

/*****************************************************************************/
/* Admin: Lifecycle Hooks */
/*****************************************************************************/
Template.Admin.onCreated(() => {
});




Template.Admin.onRendered(() => {
	  
            var config = {
      '.chosen-select'           : {},
      '.chosen-select-deselect'  : {allow_single_deselect:true},
      '.chosen-select-no-single' : {disable_search_threshold:10},
      '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
      '.chosen-select-width'     : {width:"95%"}
    }
    for (var selector in config) {
      $(selector).chosen(config[selector]);
    }
       
});


Template.Admin.onDestroyed(() => {
});


Template.Admin.events({
    'submit form': function(event,tmpl){
      alert("form submitted");
	  
	   event.preventDefault();
  var categoryselectedOption = tmpl.find('.category-select :selected');
  
  var timezoneselect=tmpl.find('.timezone-select :selected');
  
  var otherselectionsstations = [];
        $("#chosen-select option:selected").each(function(){
            var optionValue = $(this).val();
            var optionText = $(this).text();
                 
            otherselectionsstations.push(optionValue);
        });
	
var maxtimeperiod=$("#maxtime").val();

var pagerefreshinterval=$("#pagerefresh").val();

 var element = tmpl.find('input:radio[name=radio]:checked');
    
var ticketmarquee=$("#ticketmarquee").val();	

var data=[];

data.primaryStation=categoryselectedOption;

data.proximityStations=otherselectionsstations;

data.dataDuration=maxtimeperiod;

data.refreshInterval=pagerefreshinterval;

data.temperatureUnit=element;

data.infoTickerText=ticketmarquee;


Meteor.users.update({_id:Meteor.userId()}, { $set:{"profile.primaryStation":$(categoryselectedOption).val(),"profile.proximityStations":otherselectionsstations,"profile.dataDuration":maxtimeperiod,"profile.refreshInterval":pagerefreshinterval,"profile.temperatureUnit":$(element).val(),"profile.infoTickerText":ticketmarquee,"profile.timeZone":$(timezoneselect).val()}}, {multi: true} );



	

	}
});

