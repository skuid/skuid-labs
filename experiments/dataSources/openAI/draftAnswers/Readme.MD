# Ask ChatGPT to draft answers in your forms
 
This sample page shows how the ChatGPT API can help draft field values for any data you manage with Skuid. The application uses a Skuid action sequence that uses information from a record to create a prompt that is sent to ChatGPT.  The user can review the resulting response and iterate on the responses provided by the AI engine. Finally the output  is copied into the specified field in your application.  The generic nature of the application means it can be bound to any field in your application and will return the output to the correct place. 

## Instructions
- Page API:  V2
- Data source: REST data source named "OpenAI" connecting to your OpenAI instance per [instruction](openAI)
- Design system: None 
- Page XML:  [Copy the XML from this page](UpdateAnyField_w_ChatGPT.xml?raw=true), or save it as an XML file, and upload it as a new page in Skuid's pages list.

## Notes

### Models

The application uses 2 sets of models. 

The first three models represent Business Object you might find in your CRM.  For the sake of this demo they are UI Only models,  but you might be creating new Salesforce records, or new survey questions in a Postgres table etc.  

The second set of models are used for the Chat function. 

1.  UI Only “Chat Thread Display” model. 
This model will show the output from the ChatGPT interaction and hold the full thread of the discussion. 

2. REST model for interacting with ChatGPT. 
This model will handle the communication with the Chat engine. 

<img src="Chat_Completion_Model.png" width="500"></img>


### Snippets
Two snippets are required for interacting with this data source. 

1. requestBody
This snippet creates the request body in the format necessary for submitting to the OpenAI API. 

2.  responseSnippet
This snippet intercepts the return from ChatGPT and adds it as a new row to the Thread Display model. 


### Generic action sequences

The button on each Form calls the same action sequence.  But different inputs are passed into the action sequence to indicate what model and field is to be updated,  and what the initial prompt should be.   These inputs are carried through into a second action sequence that returns the response from ChatGPT into the appropriate field. 
