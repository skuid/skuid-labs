(function(skuid){
	skuid.componentType.register('progressindicator__progress_indicator', function(element, xmlDef, component){
		var $ = skuid.jQuery;
		var id = component.element.attr('id');
		var friendId = xmlDef.attr('friendId');
		var mode = xmlDef.attr('mode') || 'tabwiz';

		// Our outer content div
		var content = $('<div class="progress-indicator">');
		var cTable = $('<table>');
		var cRow = $('<tr>');

		// Get all of our steps
		var steps;
		if(mode == 'tabwiz'){
			steps = xmlDef.children('steps').children().map(function(index, step){
				return {
					dataId: step.attributes['data-id'].value,
					icon: skuid.utils.mergeAsText('global', step.attributes.icon),
					label: step.attributes.label.value
				};
			});
		}
		else{
			steps = [];
			var picklistField = skuid.$M(xmlDef.attr('model')).getField(xmlDef.attr('field'));

			$.each(picklistField.picklistEntries, function(i, entry){
				steps.push({
					label: entry.label,
					dataId: '' + i
				});
			});
		}

		// Iterate through each of our step, and create a 
		// corresponding td element with the proper classes
		// and content
		for (var i = 0; i < steps.length; i++) {
			var td = $('<td class="progress-chunk" data-id="' + steps[i].dataId + '">');
			
			var text = $('<div class="progress-text">');
			if(steps[i].icon && steps[i].icon.value){
				text.append($('<div>').addClass('nx-step-icon ' + steps[id].icon.value + ' sk-icon inline'));
			}
			text.append('<div class="text-content">' + steps[i].label + '</div>');

			td.append(text);
			td.append('<div class="progress-triangle"></div>');
			td.append('<div class="progress-triangle-outline"></div>');
			cRow.append(td);
		}

		// Add the table to our wrapper content div
		content.append(cTable.append(cRow));

		// Add our content div to the actual component
		component.element.html('');
		component.element.append(content);

		var currentStepColor = xmlDef.attr('current-color');
		var futureStepColor = xmlDef.attr('future-color');
		var doneStepColor = xmlDef.attr('done-color');

		// Make sure it's not undefined or white space
		if(currentStepColor !== undefined && currentStepColor.split(/\s*/).join() !== ''){
			var style = '<style>#' + id + ' .progress-chunk.current {background: red !important;} #' + id + ' .progress-chunk.current .progress-triangle {border-left-color: red;}</style>';
			style = style.split('red').join(currentStepColor);
			component.element.append(style);
		}

		if(doneStepColor !== undefined && doneStepColor.split(/\s*/).join() !== ''){
			var style = '<style>#' + id + ' .progress-chunk.done {background: red !important;} #' + id + ' .progress-chunk.done .progress-triangle {border-left-color: red;}</style>';
			style = style.split('red').join(doneStepColor);
			component.element.append(style);
		}

		if(futureStepColor !== undefined && futureStepColor.split(/\s*/).join() !== ''){
			var style = '<style>#' + id + ' .progress-chunk {background: red !important;} #' + id + ' .progress-chunk .progress-triangle {border-left-color: red;}</style>';
			style = style.split('red').join(futureStepColor);
			component.element.append(style);
		}

		var updateIndex = function(index){
			for (var i = 0; i < steps.length; i++) {
				var td = component.element.find('[data-id="' + steps[i].dataId + '"]');

				// Clear out all the classes from our element
				td.removeClass('done previous current');

				// Give it the proper ones now
				if(i < index){
					td.addClass('done');
				}
				if(i == index - 1){
					td.addClass('previous');
				}
				else if(i == index){
					td.addClass('current');
				}
			}
		};

		// Set the step initial index 
		updateIndex(0);

		// Bind this component to its firend component
		var bindFriend = function(){
			// If it's already been set
			if(friendComponent)
				return;
			
			// The friend of this components is how this
			// component will determine when to update itself

			var friendComponent = $('#' + friendId);
			
			// Make sure the friend component exists
			if(friendComponent){

				// Check if the friend component is a tabset
				if(friendComponent.hasClass('ui-tabs')){
					// Add the hoverable class to our step elements
					// since the tabset should be navigatable
					component.element.find('td').addClass('hoverable');
					updateIndex(friendComponent.tabs('option', 'active'));

					// Add a listener to when the tabs are activated
					friendComponent.on('tabsbeforeactivate', function(e, ui) {
						var index = ui.newTab.index();
						updateIndex(index);
					});

					// Add a listener to when our steps are activated
					content.find('td').on('click', function(e){
						var $el = $(this);
						friendComponent.tabs('option', 'active', $el.index());
					});
				}
				// Otherwise assume that the friend is a wizard
				else{
					// Add a listener to when the steps are progressed
					skuid.events.subscribe('skuid.wizard.stepShow', function(data){
						if(data.wizard.element.attr('id') == friendId){
							updateIndex(data.step.element.index());
						}
					});
				}
			}
		};


		if(mode == 'tabwiz'){
			// This first call will call whenever the Progress Indicator is actually 
			// rendered
			bindFriend();
			// This second one will be called when the page is done loading
			$(document).one('pageload', bindFriend);
		}
		else{
			if(skuid.$M(xmlDef.attr('model')).getRows()){
				var setPicklist = function(){
					var row = skuid.$M(xmlDef.attr('model')).getRows()[0];
					var entries = skuid.$M(xmlDef.attr('model')).getField(xmlDef.attr('field')).picklistEntries;
					updateIndex(entries.indexOf(row[xmlDef.attr('field')]));
					$.each(entries, function(i, entry){
						if(entry.label == row[xmlDef.attr('field')]){
							updateIndex(i);
							return false;
						}
					});
				}
				setPicklist();
				skuid.events.subscribe('row.updated',function(updateResult){
				 if ((updateResult.modelId === xmlDef.attr('model'))) {
						 setPicklist();
				 }
			});

			}
		}
	});
})(skuid);