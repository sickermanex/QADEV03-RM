/**
 * Resources Smoke Test
 *
 */

var expect = require('chai').expect;
var resources = require('..\\..\\lib\\resourcesLib');
var auth = {
	"username": "rmdom2008\\room.manager",
	"password": "M@nager",
	"authentication": "ldap"
};

describe('Smoke Test - Resources', function(){

	var token;

	/**
	 * Get a token
	 *
	 */
	before(function(done){
		resources
			.getToken(auth)
			.end(function(err, resp){
				token = resp.body.token;
				done();
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
			.getResource('123456')
			.end(function(err, res){
				var status = res.status;
			
				expect(status).to.equal(404);
				done();
			});		
	});
	
	/**
	 * Test Case
	 * Title: PUT resource API is present in the application
	 */
	it('Update a Resource', function(done){
		var resource ={"customName": "giftEdit",
						"description": "",
						"fontIcon": "fa fa-gift",
						"from": "",
						"name": "giftEdit"
					};
		
		resources
			.updateResource('123456', resource, token)
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
	it.only('Create a Resource', function(done){
		var resource ={"customName": "GitHub",
						"description": "",
						"fontIcon": "fa fa-github-alt",
						"from": "",
						"name": "GitHub"
					};
		var resourceId;

		//Test Case
		resources
			.createResource(resource, token)
			.end(function(err, res){
				resourceId = res.body._id;
				var status = res.status;

				expect(status).to.equal(200);

				//Post Condition
				resources
					.deleteResource(resourceId, token)
					.end(function(err1, res1){
						var status1 = res1.status;
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
			.deleteResource('132465', token)
			.end(function(err1, res1){
			
			expect(res1.status).to.equal(404);
				done();
			});	
	});
});

