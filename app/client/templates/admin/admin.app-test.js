if(Meteor.isClient){
    import generateCSV from './admin.js';

    describe('admin.js', function(){
        describe('getCSV', function(){
            beforeEach(function(){
                let timeRanges = [
                    "2016-09-01T12:00:00.000Z",
                    "2016-09-01T13:00:00:000Z",
                    "2016-09-01T14:00:00:000Z" 
                ];
                let sampleData = [
                        1.0,
                        1.1,
                        1.2
                    ];
                Data.insert({
                    data:{
                        airTemp:{
                            data:sampleData,
                            times:timeRanges
                        },
                        oceanTemp:{
                            data:sampleData,
                            times:timeRanges
                        },
                        chlorophyll:{
                            data:sampleData,
                            times:timeRanges
                        },
                        times:timeRanges,
                    },
                    title:"Annapolis"
                });

            });
            it('Should return a correct csv string', function(done){
                let csv = generateCSV({
                    stationViewMode: "single",
                    primaryStation: "Annapolis",
                    topPlotDataParameter: "airTemp",
                    fromTimeIndex: 0,
                    toTimeIndex: 50,
                    singleStationParameters: [
                    "oceanTemp",
                    "chlorophyll"
                    ],
                });

                expect(typeof csv ).toBe("string");
                expect(csv).toEqual("dateTime,airTemp,oceanTemp,chlorophyll,\n2016-09-01T12:00:00.000Z,1.0,1.0,1.0,2016-09-01T13:00:00.000Z,1.1,1.1,1.1,2016-09-01T14:00:00.000Z, 1.2, 1.2, 1.2"); 
                done();
            }) 
        }); 
    });
}else{
    Meteor.publish('Data', function(){
        return Data;
    });
}
