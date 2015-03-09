run('./connect');
run('./filtering/equal');
run('./filtering/notEqual');
run('./filtering/not');
run('./filtering/lessThan');
run('./filtering/lessThanOrEqual');
run('./filtering/greaterThan');
run('./filtering/greaterThanOrEqual');
run('./filtering/between');
run('./filtering/in');
run('./filtering/startsWith')
run('./filtering/endsWith')
run('./filtering/contains')
run('./filtering/exists');
run('./filtering/or');
run('./filtering/and');
run('./filtering/orAlternative');
run('./filtering/andAlternative');
run('./filtering/subFilter');
run('./filtering/compositeFilter');

run('./getById');
run('./tryGetFirst');
run('./join');
run('./hasMany');
run('./hasOne');
run('./compositeKeys');
run('./getByIdEager');
run('./tryGetFirstEager');
run('./toDto');
run('./toDtoWithStrategy');
run('./serializable');
run('./toJSON');
run('./toJSONWithStrategy');
run('./getMany');
run('./getManyLazy');
run('./getManyEager');
run('./manyToDto');
run('./manyToDtoWithStrategy');
run('./manyToJSON');
run('./manyToJSONWithStrategy');
run('./update');
run('./insert');
run('./defaultValues');
run('./conventions');
run('./updateJoin');
run('./updateHasOne');
run('./updateHasMany');
run('./delete');
run('./bulkDelete');
run('./cascadeDelete');
run('./bulkCascadeDelete');
run('./poolOptions');
run('./endPool');
run('./endAllPools');

var promise;

function run(module) {
	if (promise) 
		promise = promise.then(function() {
			return require(module);
		});
	else
		promise = require(module);
}