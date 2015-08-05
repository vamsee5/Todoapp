var Sequelize = require('sequelize');
var sequelize = new Sequelize('test1','chandan','tedmosby',{
	host: 'localhost',
	port:'5432',
	dialect: 'postgres'
});

sequelize.authenticate().then(function(err){
	console.log("connection established");},function(err){
		console.log("connection error");
	});
exports.taskTable = sequelize.define('tasks', {
	name: {
		type: Sequelize.STRING, 
		allowNull: false
	},
	status: {
		type: Sequelize.BOOLEAN, 
		defaultValue: false
		// set: function(val) {
		// 	this.setDataValue('status', val);
		// }
	}
});

// var constructTask = function(name,status){
// 	this.name=name;
// 	this.status=status;
// };
// var task1 = new constructTask('task1',false);


// var task1=taskTable.build({name:"task1",status:false}).save().then(function(err){
// 	console.log("data stored");
// },function(err){
// 	console.log("error");
// });

