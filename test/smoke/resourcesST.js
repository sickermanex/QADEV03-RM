/**
 * Resources Smoke Test
 *
 */

var expect = require('chai').expect;
var resources = require('..\\..\\lib\\resourcesLib');
var requests = require('..\\..\\requestJSONs\\resourcesRequests');
var tokenLib = require('..\\..\\lib\\tokenLib');
var settings = require('..\\..\\settings.json');
var logger = require('..\\..\\utils\\logger');

describe('Smoke Test - Resources', function(){
	this.timeout(settings.setDelayTime);

	var token;

	/**
	 * Get a token
	 */
	before(function(done){
		tokenLib
			.getToken(done, function(){
				token = arguments[0];
		});
	});

	/**
	 * Test Case
	 * Title: GET resources API is present in the application
	 */
	it('Get All Resources', function(done){
		resources
			.getResources()
			.end(function(err, res){
				var status = res.status;
				expect(status).to.equal(200);
				done();
			});		
	});
	
	/**
	 *Test Case
	 *Title: GET resource API is present in the application
	 */
	it('Get a Resource', function(done){

		resources
			.getResource(requests.resourceId._id)
			.end(function(err, res){
				var status = res.status;
			
				expect([404, 200]).to.include(status);
				done();
			});		
	});
	
	/**
	 * Test Case
	 * Title: PUT resource API is present in the application
	 */
	it('Update a Resource', function(done){
		resources
			.updateResource(requests.resourceId._id, requests.resourceUpdate.body, token)
			.end(function(err, res){
				var status = res.status;
			
				expect(status).to.equal(404);
				done();
			});		
	});
	
	/**
	 * Test Case
	 * Title: POST resource API is present in the application
	 */
	it('Create a Resource', function(done){
		var resourceId;
		//console.log(requests.resourceCreate.body);

		//Test Case
		resources
			.createResource(requests.resourceCreate.body, token)
			.end(function(err, res){
				resourceId = res.body._id;
				var status = res.status;
				//console.log('s1 ' + status);
				//console.log(err);

				expect(status).to.equal(200);

				//Post Condition
				resources
					.deleteResource(resourceId, token)
					.end(function(err1, res1){
						var status1 = res1.status;
						//console.log('s2 ' + status1);
						expect(status1).to.equal(200);
						done();
					});
			});
	});
	
	/**
	 * Test Case
	 * Title: DELETE resource API is present in the application
	 */
	it('Delete a Resource', function(done){
		resources
			.deleteResource(requests.resourceId._id, token)
			.end(function(err1, res1){
			
			expect(res1.status).to.equal(404);
				done();
			});	
	});
});

