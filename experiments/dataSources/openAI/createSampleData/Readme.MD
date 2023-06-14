# Ask OpenAI to generate sample data for your business database 

This sample page shows how the OpenAI API can be used to create sample/test data for your database. The application allows the user to select a model and the number of desired rows. The application passes all field names and data types from the selected model into a prompt which asks ChatGPT to generate relevant data.

 If the response from OpenAI isn't in the correct format, the application will automatically request a new response.

## Instructions
- Page API:  V2
- Data source: 
    REST data source named "OpenAI" connecting to OpenAI APIs per [instruction](openAI)
- Design system: This Demo uses the ChatGPT_Demo design system. [Download this Design System file](../ChatGPT_Demo.designsystem?raw=true) and use the Import function on the Design System page to add this system to your org. 
- Page XML:  [Copy the XML from this page](CreateSampleData.xml), or save it as an XML file, and upload it as a new page in Skuid's Pages.

## Notes

### Models

1.  UI-Only "config_UIOnly"
This model is used to hold the a few different page variable as well as the prompt and JSON response from OpenAI.

2.  REST model "config_openAi"
This model handles the communication with the API. 
The core of the interaction is handled in a POST Body that is created through a snippet.

3. Account and contact models 
These UI-only models are sample models that can be replaced with whatever model you wish to have sample data created for.

NOTE: The "config_" prefix is used to filter out builder models in the runtime pick-list that is displayed on the "create sample data" modal.

### Snippets
 
1. Request Body
This snippet constructs the request body for the POST to the OpenAI API endpoint

2. responseHandler
This is used to store the correct portion of the response in the config_UIOnly Model.

3. generatePrompt
Snippet that combines appropriate pieces of data and inputs into a prompt and adds it to the config_UIOnly Model for use.

4. createDummyRows
This snippet is used to parse the JSON from the response and populate rows in the selected model. If the response is not proper JSON and cannot be parsed, it will run the "Retry Generate Rows" action to get a new response. This snippet also includes a save action. If auto save is not desired, it could be removed here.

5. getModelList
This is used to construct a list of models to be provided to the user in the "Create Sample Rows" model. 