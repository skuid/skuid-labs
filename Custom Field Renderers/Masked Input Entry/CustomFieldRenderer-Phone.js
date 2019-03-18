var field = arguments[0],
	value = arguments[1],
	$ = skuid.$;

switch (field.mode) {
	case 'edit':
		//Deprecated: skuid.ui.fieldRenderers.TEXT.edit(field, value);
		skuid.ui.getFieldRenderer('TEXT').edit(field, value);
		field.element.find("input").mask('(000) 000-0000');
		break;

	default:
		//Deprecated: skuid.ui.fieldRenderers[field.displaytype][field.mode](field, value);
		skuid.ui.getFieldRenderer(displayType, model.getDataSource())[mode](field, value);
		break;
}