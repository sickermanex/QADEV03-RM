var expect =  require('chai').expect;
var locationsLib = require('..\\..\\lib\\locationsLib.js');
var roomsLib = require('..\\..\\lib\\conferenceRoomsLib.js');
var tokenLib = require('..\\..\\lib\\tokenLib.js');
var settings = require('..\\..\\settings.json');


describe('Story: Assigning a disabled conference room to a location', function(){
	var locationJalaSoft;
	var locationPlantaB;
	var locationPueblito;
	var quillacollo;
	var morochata;
	var tarata;
	var  ob3;
	this.timeout(settings.setDelayTime);
    this.slow(settings.setErrorMaxTime);
	
    var location;
    var listLocation;
    var token;
    before(function(done){
        tokenLib
            .getToken(done, function(){
                token = arguments[0];
            });

    });
	describe('Scenario 1: Re-assign a conference room to a nested location', function(){
		context('Given there is the location (Jalasoft\\Planta Baja\\Pueblito)', function(){
		
			before('create the locations', function(done){
				location = {
					"name"       : "Jalasoft",
					"customName" : "Jalasoft",
					"description": ""
				};

				locationsLib
					.createLocations(location, token)
					.end(function(err, res){
						var response = res;
						locationJalaSoft = response.body._id;
						expect(response.status).to.equal(200);

						location = {
							"name"       : "PlantaBaja",
							"customName" : "PlantaBaja",
							"ParentId": locationJalaSoft
						};

						locationsLib
							.createLocations(location, token)
							.end(function(err1, res1){
								var response = res1;
								locationPlantaB = response.body._id;
								expect(response.status).to.equal(200);

								location = {
									"name"       : "Pueblito",
									"customName" : "Pueblito",
									"ParentId": locationPlantaB
								};

								locationsLib
									.createLocations(location, token)
									.end(function(err2, res2){
										var response = res2;
										locationPueblito = response.body._id;
										expect(response.status).to.equal(200);
										done();
                       				 });
							});
					});
			});


			after('deleting the locations', function (done) {
				var location = [locationPueblito , locationPlantaB ,locationJalaSoft];
				location.forEach(function(loc){
					locationsLib
						.deleteLocations(loc, token)
						.end(function (err, res){
							expect(res.status).to.equal(200);
						})
				});
				done();
			});
			
			it('And the conference rooms (Quillacollo, Morochata) are ' +
				'already assigned  to the Pueblito', function(done){

				roomsLib
					.getRooms()
					.end(function(err,res){
						//console.log('s ' + res.status);
						var listRooms = res.body;
						for (var i = 0 ; i<listRooms.length; i++)
						{
						if(listRooms[i].displayName=='Quillacollo')
							quillacollo = listRooms[i];

						else if (listRooms[i].displayName=='Morochata')
							morochata = listRooms[i];
							else if (listRooms[i].displayName=='Tarata')
								tarata = listRooms[i];
								else if (listRooms[i].displayName=='0B3')
									ob3 = listRooms[i];
						};

						var newRoom = {
							"locationId":locationPueblito
						};
				
						roomsLib
							.updateRoom(quillacollo._id, newRoom, token)
							.end(function(err1, res1){
								//console.log('s1 ' + res1.status);

								roomsLib
									.updateRoom(morochata._id, newRoom, token)
									.end(function(err2, res2){
										//console.log('s2 ' + res2.status);
										expect(res2.status).to.equal(200);

										roomsLib
											.getRoom(quillacollo._id)
											.end(function(err3,res3) {
												quillacollo = res3.body;

												roomsLib
													.getRoom(morochata._id)
													.end(function(err4,res4) {
														morochata = res4.body;

														expect(quillacollo.locationId).to.equal(locationPueblito);
														expect(morochata.locationId).to.equal(locationPueblito);
														done();
													});
											});
									});
							});
					});
			});
			
			it('And the conference rooms (Tarata, 0B3 ) are ' +
				'assigned to (Jalasoft\\Planta Baja)', function(done){
				var newRoom = {
					"locationId":locationPlantaB
				};

				roomsLib
					.updateRoom(tarata._id, newRoom, token)
					.end(function(err, res){
						//console.log('s1 ' + res1.status);

						roomsLib
							.updateRoom(ob3._id, newRoom, token)
							.end(function(err1, res1){
								//console.log('s2 ' + res2.status);
								expect(res1.status).to.equal(200);

								roomsLib
									.getRoom(tarata._id)
									.end(function(err2,res2) {
										tarata = res2.body;

										roomsLib
											.getRoom(ob3._id)
											.end(function(err3,res3) {
												ob3 = res3.body;

												expect(tarata.locationId).to.equal(locationPlantaB);
												expect(ob3.locationId).to.equal(locationPlantaB);
												done();
											});
									});
							});
					});
			});
			
			it('And the conference room (Tarata) is disabled', function(done){
				var taratadisable = {
					"enabled":false
				};

				roomsLib
					.updateRoom(tarata._id, taratadisable, token)
					.end(function(err, res){
						expect(res.status).to.equal(200);
						done();
					});
			});
			
			context('When (Tarata)  is assigned to (Jalasoft\\Planta Baja\\Pueblito)', function(){
				
				it('Then ensure Tarata is correctly assigned to the new location', function(done){
					var newRoom = {
						"locationId":locationPueblito
					};

					roomsLib
						.updateRoom(tarata._id, newRoom, token)
						.end(function(err, res){
							//console.log('s1 ' + res1.status);
							expect(res.status).to.equal(200);

							roomsLib
								.getRoom(tarata._id)
								.end(function(err1,res1) {
									tarata = res1.body;
									expect(tarata.locationId).to.equal(locationPueblito);
									done();

								});
						});
				});
				
				it('And ensure Taratas status is still disabled', function(done){
					roomsLib
						.getRoom(tarata._id)
						.end(function(err1,res1) {
							tarata = res1.body;
							expect(tarata.locationId).to.equal(locationPueblito);
							expect(tarata.enabled).to.equal(false);
							done();

						});
				});
				
				it('And ensure that the total number of conference rooms assigned ' +
					'to (Jalasoft\\Planta Baja\\Pueblito) is 3', function(done){
					roomsLib
						.getRooms()
						.end(function(err, res){
							var rooms = res.body;
							var cantroom=0;
							for(var i = 0 ; i<rooms.length ; i++) {
								if (rooms[i].locationId === locationPueblito)
									cantroom++;
							}
							expect(cantroom).to.equals(3);
							done();
						});
				
				});
				
				it('And ensure that the total number of conference rooms ' +
					'assigned to (Jalasoft\\Planta Baja) is 1', function(){
					roomsLib
						.getRooms()
						.end(function(err, res){
							var rooms = res.body;
							var cantroom=0;
							for(var i = 0 ; i<rooms.length ; i++) {
								if (rooms[i].locationId === locationPlantaB)
									cantroom++;
							}
							expect(cantroom).to.equals(1);
							done();
						});
				});
			});
		});
	});
});