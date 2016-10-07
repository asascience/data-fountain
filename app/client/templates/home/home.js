import screenfull from 'screenfull';
/*****************************************************************************/
/* Home: Event Handlers */
/*****************************************************************************/
Template.Home.events({
    'click .full-screen'(event, template) {
        let target = $(event).target;
        if (screenfull.enabled) {
            screenfull.toggle(target);

            if(screenfull.isFullscreen) {
                $('em').removeClass('fa-expand').addClass('fa-compress');
            } else {
                $('em').removeClass('fa-compress').addClass('fa-expand');
            }

        }
    }
});

/*****************************************************************************/
/* Home: Helpers */
/*****************************************************************************/
Template.Home.helpers({
    tickerEnabled(){
        return Meteor.user().profile.tickerEnabled;
    }
});

/*****************************************************************************/
/* Home: Lifecycle Hooks */
/*****************************************************************************/
Template.Home.onCreated(function(){
    let userProfile = Meteor.user().profile;
    let DURATION = (userProfile.toTimeIndex - userProfile.fromTimeIndex) -1;
    let TIMER_DELAY = userProfile.refreshInterval * 1000;
    let REFERENCE_STATION = userProfile.primaryStation;
    let dataTimes = Data.findOne({title: REFERENCE_STATION});
    dataTimes = dataTimes.data[userProfile.topPlotDataParameter].times;
    let displayDataTimes = dataTimes.slice(userProfile.fromTimeIndex, userProfile.toTimeIndex);


    // using var explicitly
    var time;

    function* indexGen() {
        let index = 0;
        while(true) {
            if (index > DURATION) {
                index = 0;
            }
            yield index++;
        }
    }

    let index = indexGen();
    this.timerDelay = TIMER_DELAY;

    //Function called to tick the timer one forward.
    this.runTimer = function(){
        let currIndex = index.next().value;
        time = displayDataTimes[currIndex];
        Session.set('globalTimer', time);
        Session.set('globalTicker', currIndex);

        if (currIndex >= DURATION && userProfile.keepUpdated) {
            let currDataTime = moment(dataTimes[dataTimes.length -1]).unix();

            if (userProfile.dateSliderData.to != currDataTime && userProfile.toTimeIndex != dataTimes.length -1) {

                Meteor.users.update(Meteor.userId(), {
                    $set: {
                        'profile.dateSliderData.to': currDataTime,
                        'profile.toTimeIndex': dataTimes.length - 1
                    }
                });
                document.location.reload(true);
            }

        }

        if (currIndex >= DURATION && userProfile.cycleStationParams) {
            let params = userProfile.singleStationParameters;
            let cParam = userProfile.bottomPlotDataParameter;
            let pIndex = params.indexOf(cParam);

            if (pIndex === params.length -1) {
                pIndex = 0;
            } else {
                 Meteor.users.update(Meteor.userId(), {
                    $set: {
                        'profile.bottomPlotDataParameter': params[pIndex+1],
                    }
                });
            }
        }

        // if (currIndex === DURATION-1) {
        //     let rotationIndex = Meteor.user().profile.proximityStations.indexOf(REFERENCE_STATION),
        //         proximityStations = Meteor.user().profile.proximityStations;
        //
        //     if (rotationIndex === proximityStations.length-1) {
        //         rotationIndex = -1;
        //     }
        //     Meteor.users.update(Meteor.userId(), {
        //         $set: {
        //             "profile.primaryStation": proximityStations[rotationIndex+1]
        //         }
        //     });
        //
        // }
    };

    //Start the ticker.
    this.stopTimerHandle = Meteor.setInterval(() => {
        this.runTimer();
    }, this.timerDelay);

});

Template.Home.onRendered(function(){
    this.paused = false;

    let keyPress = (() => {
        //If the user presses ctrl + d bring them back to the admin page.
        var evtobj = window.event? event : e
        if (evtobj.keyCode == 68 && evtobj.ctrlKey){
            Router.go('/admin');

        //If the user presses space toggle the ticker.
        }else if(evtobj.keyCode === 32){
            if(this.paused === false){
                //Stop the ticker.
                clearInterval(this.stopTimerHandle);
            }else{
                //Continue ticking. Do an initial tick to indicate that the ticker has been unpaused.
                this.runTimer();
                this.stopTimerHandle = Meteor.setInterval(() => {
                    this.runTimer();
                }, this.timerDelay);
            }
            //toggle the template paused.
            this.paused = !this.paused;
        }
    });
    document.onkeydown = keyPress;

});

Template.Home.onDestroyed(function(){
    clearInterval(this.stopTimerHandle);
});
