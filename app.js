var seq=require('./seq.js');
var Hapi= require('hapi');
var boom= require('boom');
var Joi = require('joi');
var server = new Hapi.Server();
server.connection({ port: 3000 ,routes:{cors:true}});
server.start(function(){
	console.log(server.info.uri);
});
//get all tasks
server.route({
	method:'GET',
	path:'/tasks',
	handler: function(request,reply){
		seq.taskTable.findAll().then(function(data){
			reply(data);
		},function(err){
			reply(boom.notFound("data not found"));
		})
	}
});
//get task by id
server.route({
	method:'GET',
	path:'/tasks/{id}',
	handler:function(request,reply){
		seq.taskTable.findById(request.params.id).then(function(data){
			if(data===null){
				reply("task not available");
			}else{
				reply(data);
			}
		},function(err){
			reply(boom.notFound("data not found"));
		})
	},
	config:{
		validate:{
			params:{
				id: Joi.number().integer().min(1)
			}
		}
	}
});
//delete a task
server.route({
	method:'DELETE',
	path:'/tasks/{id}',
	handler:function(request,reply){
		seq.taskTable.destroy({where:{id:request.params.id}}).then(function(){
			reply("");
		},function(err){
			reply(boom.notFound("data not deleted"));
		});
	},
	config:{
		validate:{
			params:{
				id: Joi.number().integer().min(1)
			}
		}
	}
});
//create task
server.route({
	method:'POST',
	path:'/tasks',
	handler:function(request,reply){
		seq.taskTable.build(request.payload).save().then(function(data){
			reply(data.dataValues);
		},function(err){
			reply(err.message);
		});
	},
	config:{
		validate:{
			payload:Joi.object().max(2).keys({
				name:Joi.string().min(1),
				status:Joi.boolean()
			})
		}
	}
});
//update task
server.route({
	method:'PUT',
	path:'/tasks/{id}',
	handler:function(request,reply){
		seq.taskTable.findById(request.params.id).then(function(data){
			if(data===null){
				reply("task not available");
			}
			else{
				data.name=request.payload.name ||data.name;
				if(request.payload.status!=null){
					data.status=request.payload.status;
				}		
				data.save().then(function(){
					reply(data);
				});
			}
		},function(err){
			reply(err.message);
		});
	},
	config:{
		validate:{
			params:{
				id: Joi.number().integer().min(1)
			},
			payload:Joi.object().min(1).keys({
				name:Joi.string().min(1),
				status:Joi.boolean()			
			})
		}
	}
});