var field = arguments[0],
    value = arguments[1],
    $ = skuid.$;

switch(field.mode) {
    case 'edit':
        skuid.ui.fieldRenderers.TEXT.edit(field, value);
        field.element.find("input").mask('00:00:00', {reverse: true});
        break;

    default:
        skuid.ui.fieldRenderers[field.displaytype][field.mode](field, value);
	break;
}