import { Meteor } from 'meteor/meteor';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
    /*
     *  MeteorPrinciples is an EXAMPLE collection that would have been
     *  created in the /app/lib via:
     *
     *    $ maka g:collection MeteorPrinciples
     *
     *  Uncomment below to give this a test, after creating a
     *  MeteorPrinciples collection
     *
     *
     */

    /*
     * if (MeteorPrinciples.find().count() === 0) {
     *  const data = [
     *      {
     *          items: [
     *              'Data on the Wire',
     *              'One Language',
     *              'Database Everywhere',
     *              'Latency Compensation',
     *              'Full Stack Reactivity',
     *              'Embrace the Ecosystem',
     *              'Simplicity Equals Productivity'
     *          ]
     *      }
     *  ];
     *
     *  let timestamp = (new Date()).getTime();
     *
     *  data.forEach((principle) => {
     *      principle.items.forEach((text) => {
     *          MeteorPrinciples.insert({
     *              text,
     *              createdAt: new Date(timestamp)
     *          });
     *          timestamp += 1;
     *      });
     *  });
     * }
     */
});
