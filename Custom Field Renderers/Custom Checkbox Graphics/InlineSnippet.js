var thisClass = "toggleLockButton",
  field = arguments[0],
  value = arguments[1],
  fieldId = field.id,
  row = field.row,
  model = field.model,
  $ = skuid.$,
  checkedClass = (value) ? "checked" : "";

switch (field.mode) {
  case 'read':
     field.element.append(
        "<a class='" + thisClass + " readmode " + checkedClass + "'></a>");
     break;
  case 'readonly':
  case 'edit':
     field.element.append(
        "<a class='" + thisClass + " editmode " + checkedClass +
        "' href=\"javascript:void(0)\"></a>");

     field.element
        .find('.' + thisClass)
        .click(function () {
           var newRow = {};
           newRow[fieldId] = (value) ? false : true;
           model.updateRow(row, newRow);
        })
        .mouseenter(function () {
           $(this).addClass("ui-state-hover");
        })
        .mouseleave(function () {
           $(this).removeClass("ui-state-hover");
        })
     ;
     break;

  default:
     console.warn("Unknown field mode: " + field.mode);
     break;
}
