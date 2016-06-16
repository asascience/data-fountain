/*****************************************************************************/
/* Home: Event Handlers */
/*****************************************************************************/
Template.Home.events({
});

/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.Home.helpers({

});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.Home.onCreated(() => {
    let _this = Template.instance();
    let DURATION = _this.data.duration;
    let TIMER_DELAY = _this.data.timerDelay;
    let REFERENCE_STATION = _this.data.referenceStation;
    let dataTimes = Data.findOne({id: REFERENCE_STATION}, {fields: {'data.times': 1}});
    dataTimes = dataTimes.data.times;
    
    // using var explicitly
    var time;

    function* indexGen() {
        let index = 0;
        while(true) {
            if (index === dataTimes.length) {
                index = 0;
            }
            yield index++;
        }
    }

    let index = indexGen();
    Meteor.setInterval(() => {
        time = dataTimes[index.next().value];
        Session.set('globalTimer', time);
    }, TIMER_DELAY);
	
	

	 
});

Template.Home.onRendered(() => {

});

Template.Home.onDestroyed(() => {
});
