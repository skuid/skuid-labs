# Ask ChatGPT to draft answers in your forms. 
 
 This sample page shows how the ChatGPT API can help draft field values for any data you manage with Skuid. The application uses a Skuid action sequence that uses information from a record to create a prompt that is sent to ChatGPT.  The user can review the resulting response and iterate on the responses provided by the AI Engine. Finally the output  is copied into the specified field in your application.  The generic nature of the application means it can be bound to any field in your application and will return the output to the correct place. 

## Instructions
- Page API:  V2
- Data source: REST data source named "OpenAi" connecting to your HubSpot instance per [instruction](openAI)
- Design system: None 
- Page XML:  [Copy the XML from this page](UpdateAnyField_w_ChatGPT.xml?raw=true), or save it as an XML file, and upload it as a new page in Skuid's Pages.

## Notes

### Models:  

The application uses 2 models. 

1.  UI Only “Chat Thread Display” model. 
This model will show the output from the ChatGPT interaction and hold the full thread of the discussion. 
- Name: Enter a name related to the model's purpose, something like “Chat_Thread”
- Data Source Type: UI-Only
- Create default row if model has none:  True

Create Ui-Only field: 
- Id:  content
- Type:  text area
- Length:  4000 characters


2. REST model for interacting with ChatGPT. 
This model will handle the communication with the Chat Engine. 
- Name: Enter a name related to the model's purpose, something like “chat_completion”
- Data Source Type: REST
- Data Source: The OpenAI data source you created above
- Model Behavior: Read-Only
- Data Source URL: /chat/completions
- Data Source HTTP Verb: POST
- Intercept response payload: True
- Response body contents:  As custom payload form in request body

<img src="Chat_Completion_Model.png" width="500"></img>


### Snippets: 
Two snippets are required for interacting with this data source. 


1. Request body construction snippet. 

This snippet creates the request body in the format necessary for submitting to the OpenAI API. 

- Resource type:  Generic JS Snippet
- Snippet name:  requestBody
Code: 

```
const params = arguments[0];


// Get the skuid model
var chat = skuid.$M('Chat_Thread').dataMap;
console.log(chat)


// Create array to store values
var messages = [];


// Loop through each row in the model
Object.entries(chat).forEach(([key, value]) => {
  console.log(value.content);


   // Push object into the array
   messages.push({content:value.content, role:value.role});
  
});


//Create response body
let body = {
 model: 'gpt-3.5-turbo-0301',
 messages: messages
};
```

return body



2.  Response parsing snippet. 
This snippet intercepts the return from ChatGPT and adds it as a new row to the Thread Display model. 

- Resource type:  Generic JS Snippet
- Snippet name:  responseSnippet
Code: 

```
const params = arguments[0],
   message = arguments[0].response.body.choices[0].message;


//Get chat thread model
var chat = skuid.$M('Chat_Thread');


//Take the returned message and append it to the chat thread
var addResponse = chat.createRow({
   doAppend: true,
   additionalConditions: [
       { field: 'content', value: message.content },
       { field: 'role', value: message.role }
   ]
});


//Append an additional blank row to the chat thread
var newChatRow = chat.createRow({
   doAppend: true,
   editModeForNewItems: true
});
```




### Action Sequence. 

The generic function is contained in an action sequence.  

- Type:  Reusable action sequence
- Name:   Common ChatGPT generator

- Inputs: 

1.   Name:  Prompt.   Type:  Value
2.   Name:   Model.   Type:  Model
3.   Name:  Field.  Type:  Model-field.  Input Model-Source:   Model


Actions for this sequence: 

- Create a new row in the UI Only Chat Thread model,  
- Pass the prompt data collected as input into the new row  
- Open a modal where the Chat interaction can occur. 



In the modal, add buttons to the bottom that do the following. 

Cancel:  Runs the following actions: 
- Cancel model changes on the 2 models above
- Close modal. 


Apply:  Runs the following actions: 
- Update row action using the model and field input provided for the action sequence. 
- Cancel model changes on the 2 models above. 
- Close modal. 


