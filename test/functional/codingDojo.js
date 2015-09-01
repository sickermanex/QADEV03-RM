var expect =  require('chai').expect;
var locationsLib = require('..\\..\\lib\\locationsLib.js');
var roomsLib = require('..\\..\\lib\\conferenceRoomsLib.js');
var tokenLib = require('..\\..\\lib\\tokenLib.js');
<<<<<<< HEAD
var settings = require('..\\..\\settings.json')
var mongoserv = require('..\\..\\lib\\mongoConnection.js');



describe('Story: Assigning a disabled conference room to a location', function(){
	var locationParent1;
	var locationChild1;
	var locationChild2;
=======
var settings = require('..\\..\\settings.json');


describe('Story: Assigning a disabled conference room to a location', function(){
	var locationJalaSoft;
	var locationPlantaB;
	var locationPueblito;
>>>>>>> 720826907e0b0ccadd1c336a1d239f52b6f17ecb
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
<<<<<<< HEAD
	describe('\n', function(){
		context('Scenario 1: Re-assign a conference room to a nested location', function(){
			
			var deleteAllLocations = function(locatId){					
				locationsLib
					.deleteLocations(locatId,token)
					.end(function(err,res){						
						console.log(err);
					});
				console.log('I got it');
			};
				
			before('Create the locations', function(done){				
=======
	describe('Scenario 1: Re-assign a conference room to a nested location', function(){
		context('Given there is the location (Jalasoft\\Planta Baja\\Pueblito)', function(){
		
			before('create the locations', function(done){
>>>>>>> 720826907e0b0ccadd1c336a1d239f52b6f17ecb
				location = {
					"name"       : "Jalasoft",
					"customName" : "Jalasoft",
					"description": ""
				};
<<<<<<< HEAD
				locationsLib
					.createLocations(location, token)
					.end(function(error, res){
						var response = res.body;
						locationParent1 = response._id;						
						expect(res.status).to.be.equal(200);
						location = {
							"name"       : "PlantaBaja",
							"customName" : "PlantaBaja",
							"parentId": locationParent1
						};
						locationsLib
							.createLocations(location, token)
							.end(function(error, res){
							var response = res.body;
							locationChild1 = response._id;
							expect(res.status).to.be.equal(200);
							location = {
								"name"       : "Pueblito",
								"customName" : "Pueblito",
								"parentId": locationChild1
							};
							locationsLib
								.createLocations(location, token)
								.end(function(error, res){
								var response = res.body;
								locationChild2 = response._id;								
								expect(res.status).to.be.equal(200);							
								done();
							});
						});
				});									
			});
			
			after('Deleting the locations',function(done){
				locationsLib
					.getAllLocations()
					.end(function(err,res){
						var response = res.body;
						for(var i in response)
						{
							console.log(response[i]._id);
							deleteAllLocations(response[i]._id);
						}
						done();
					});
			});
			
			it('Assigning rooms to pueblito', function(done){
				roomsLib
					.getRooms()
					.end(function(err,res){
					var listRooms = res.body;
					for (var i=0 ; i<listRooms.length; i++)
					{
						if(listRooms[i].displayName=='Quillacollo')
						{
							quillacollo = listRooms[i];
						}
						else if (listRooms[i].displayName=='Morochata')
						{
							morochata = listRooms[i];
						}
						else if (listRooms[i].displayName=='Tarata')
						{
							tarata = listRooms[i];
						}
						else if (listRooms[i].displayName=='0B3')
						{
							ob3 = listRooms[i];
						}						
					}
					//console.log(quillacollo._id,morochata._id,tarata._id,ob3._id);
					var newRoom = {
						"locationId":locationChild2
					};				
				
				roomsLib
					.updateRoom(quillacollo._id, newRoom, token)
					.end(function(err, res){
						quillacollo = res.body;
						roomsLib
							.updateRoom(morochata._id, newRoom, token)
							.end(function(err, res){				
								morochata = res.body;
								expect(res.status).to.equal(200);								
								expect(quillacollo.locationId).to.equal(locationChild2);
								expect(morochata.locationId).to.equal(locationChild2);
								done();
							});							
						});
				});
			});
			
			it('Assigning rooms to planta baja', function(done){
			var newRoom = {
					"locationId":locationChild1
				};
				roomsLib
					.updateRoom(tarata._id, newRoom, token)
					.end(function(err, res){
	
						roomsLib
							.updateRoom(ob3._id, newRoom, token)
							.end(function(err, res){
								expect(res.status).to.equal(200);
								done();
							});
							
						});
			});
			
			it('Disabled tarata', function(done){
			var taratadisable = {
					"enabled":false
				};
				roomsLib
				
=======

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
>>>>>>> 720826907e0b0ccadd1c336a1d239f52b6f17ecb
					.updateRoom(tarata._id, taratadisable, token)
					.end(function(err, res){
						expect(res.status).to.equal(200);
						done();
					});
			});
			
<<<<<<< HEAD
			context('', function(){
				
				it('', function(){
			
				});
				
				it('', function(){
				
				});
				
				it('', function(){
				
				});
				
				it('', function(){
				
				});
			});//context
=======
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
>>>>>>> 720826907e0b0ccadd1c336a1d239f52b6f17ecb
		});
	});
});