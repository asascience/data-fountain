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
    let TIMER_DELAY = Meteor.user().profile.refreshInterval * 1000;
    let REFERENCE_STATION = _this.data.referenceStation;
    let dataTimes = Data.findOne({id: REFERENCE_STATION}, {fields: {'data.times': 1}});
    dataTimes = dataTimes.data.times;

    // using var explicitly
    var time;

    function* indexGen() {
        let index = 1;
        while(true) {
            if (index === dataTimes.length -1) {
                index = 0;
            }
            yield index++;
        }
    }

    let index = indexGen();
    Meteor.setInterval(() => {
        let currIndex = index.next().value;
        time = dataTimes[currIndex];
        Session.set('globalTimer', time);
        Session.set('globalTicker', currIndex);
    }, TIMER_DELAY);
});

Template.Home.onRendered(() => {

});

Template.Home.onDestroyed(() => {
});
