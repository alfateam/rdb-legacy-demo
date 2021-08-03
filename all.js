let promise;

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
run('./filtering/iEqual')
run('./filtering/iStartsWith')
run('./filtering/iEndsWith')
run('./filtering/iContains')
run('./filtering/exists');
run('./filtering/or');
run('./filtering/and');
run('./filtering/orAlternative');
run('./filtering/andAlternative');
run('./filtering/subFilter');
run('./filtering/compositeFilter');
run('./filtering/rawSqlFilter');

run('./getById');
run('./tryGetById');
run('./tryGetFirst');
run('./join');
run('./hasMany');
run('./hasOne');
run('./compositeKeys');
run('./getByIdEager');
run('./tryGetFirstEager');
run('./toDto');
run('./toDtoWithStrategy');
run('./toDtoWithOrderBy');
run('./toDtoWithOrderByDesc');
run('./serializable');
run('./getMany');
run('./getManyDto');
run('./getManyWithOrderByJsonb');
run('./getManyWithOrderByJsonbDesc');
run('./getManyLazy');
run('./getManyEager');
run('./getManyDtoEager');
run('./manyToDto');
run('./manyToDtoWithStrategy');
run('./rawSqlQuery');
run('./rawSqlQueryWithParameters');
run('./update');
run('./insert');
run('./exclusive');
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
run('./streamEager');
run('./streamJSONEager');
run('./logging');
run('./jsonSchema');
run('./validate');

promise.then(null,onError);

function onError(e) {
	console.log(e);
}


function run(module) {
	if (promise)
		promise = promise.then(function() {
			return require(module);
		});
	else
		promise = require(module);
}