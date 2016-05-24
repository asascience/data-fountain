/*****************************************************************************/
/*  Server Methods */
/*****************************************************************************/


var Future = Npm.require( 'fibers/future' ); 

Meteor.methods({
  getStationsList: function( ) {
    // Create our future instance.
    var future = new Future();

    HTTP.get( 'http://dev.oceansmap.com/data-fountain/api/station_list', {}, function( error, response ) {
      if ( error ) {
        future.return( error );
      } else {
        future.return( response );
      }
    });

    return future.wait();
  }
});
