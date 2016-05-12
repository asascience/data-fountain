/*****************************************************************************/
/* InfoTicker: Event Handlers */
/*****************************************************************************/
Template.InfoTicker.events({
    // this is sort of silly, since no one would be able to interact
    // with the screen...but just for completeness lets add the events
    // for a proper marquee.
    'mouseover marquee'(event) {
        event.target.stop();
    },
    'mouseout marquee'(event) {
        event.target.start();
    }
});

/*****************************************************************************/
/* InfoTicker: Helpers */
/*****************************************************************************/
Template.InfoTicker.helpers({
});

/*****************************************************************************/
/* InfoTicker: Lifecycle Hooks */
/*****************************************************************************/
Template.InfoTicker.onCreated(() => {

});

Template.InfoTicker.onRendered(() => {
});

Template.InfoTicker.onDestroyed(() => {
});
