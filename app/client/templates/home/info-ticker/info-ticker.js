/*****************************************************************************/
/* InfoTicker: Event Handlers */
/*****************************************************************************/
Template.InfoTicker.events({

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
    $('.marquee').marquee({
        //speed in milliseconds of the marquee
        duration: 30000,
        //gap in pixels between the tickers
        gap: 50,
        //time in milliseconds before the marquee will start animating
        delayBeforeStart: 0,
        //'left' or 'right'
        direction: 'left',
        //true or false - should the marquee be duplicated to show an effect of continues flow
        duplicated: true
    });
});

Template.InfoTicker.onDestroyed(() => {
});
