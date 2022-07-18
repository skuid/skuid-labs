//Paste this code into a new javascript snippet titled "iterator"
const params = arguments[0],
	model = skuid.$M(params.$Input.Model),
	actionSequence = skuid.actionSequences.getByName(params.$Input.ActionSequence),
	useContext = params.$Input.UseContext && (typeof params.$Input.UseContext.toLowerCase == "undefined" || (params.$Input.UseContext.toLowerCase() !== "false" && params.$Input.UseContext !== "0"));

return (async function() {
	if(model && actionSequence) {
		var rows = useContext && model === params.context.model && params.context.rows ? params.context.rows : model.getRows();
		for(let i = 0; i < rows.length; i++) {
			let inputs = {...rows[i]};
			inputs.$Iteration = i + 1;
			await actionSequence.run(inputs, {model: model, row: rows[i]});
		}
	}
	else console.error("Could not find model or action sequence for iterator");
})();