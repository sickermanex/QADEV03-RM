var expect =  require('chai').expect;
var locationsLib = require('..\\..\\lib\\locationsLib.js');
var roomsLib = require('..\\..\\lib\\conferenceRoomsLib.js');
var tokenLib = require('..\\..\\lib\\tokenLib.js');
var settings = require('..\\..\\settings.json')
var mongoserv = require('..\\..\\lib\\mongoConnection.js');



describe('Story: Assigning a disabled conference room to a location', function(){
	var locationParent1;
	var locationChild1;
	var locationChild2;
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
				location = {
					"name"       : "Jalasoft",
					"customName" : "Jalasoft",
					"description": ""
				};
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
				
					.updateRoom(tarata._id, taratadisable, token)
					.end(function(err, res){
						expect(res.status).to.equal(200);
						done();
					});
			});
			
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
		});
	});
});