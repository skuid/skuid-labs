# Integrate a Chatbot into Your Apps
<img src="../OpenAI_Introduction.png" width="500"></img>

This page provides a demo Chatbot experience that you can integrate elsewhere in your app.

## Instructions
- Page API:  V2
- Data source: 
    REST data source named "OpenAI" connecting to OpenAI APIs per [instructions](../openAI)
- Design system: This Demo uses the ChatGPT_Demo design system. [Download this Design System file](../ChatGPT_Demo.designsystem?raw=true) and use the Import function on the Design System page to add this system to your org. 
- Page XML:  [Copy the XML from this page](ChatGPT_Demo.xml), or save it as an XML file, and upload it as a new page in Skuid's Pages.

## Notes

### Models

1.  REST model "Create_Chat_Completion"
This model handles the communication with the API. 
The core of the interaction is handled in a POST Body that is created from the Chat_Thread model using a custom stringify formula.

2. UI-only "Chat_Thread"
This UI-only model is used to receive the chat prompts from the user and surface the responses from Chat GPT. 


### Snippets
 
1. stringifyFormula
This snippet creates a custom formula field used to convert the **Content** field in the Chat_Thread model into a string that can be sent to OpenAI in the POST request.
