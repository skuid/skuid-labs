# ChatPDF
ChatPDF is an AI-powered app that allows users to upload or link to a PDF file and start asking it questsions related to the PDF. Learn more about this product [here](https://www.chatpdf.com/)

## Connect to ChatPDF API
Follow the steps from [ChatDPF API Documentation](https://www.chatpdf.com/docs/api/backend) to generate an API key. 

## Create a Skuid data source
In your Skuid site, configure a data source with these properties:

- **Name**: ChatPDF
- **Data Source Type**: REST
- **URL**: ``https://api.chatpdf.com``
- **Authentication Method**: No Authentication
- **Use (Apex) Proxy**: Checked

Append the following key-value pair in the **Common Request Parameters** section:

- Authorization: ``Bearer <paste your API key here>``

If you are using Skuid SFX (our Salesforce managed package), you will be prompted to create a Remote Site Setting. Accept the prompt, or you'll need to create one manually.

## Import Design System
Several of these demos use a custom Design System.
- [Download this Design System file](../openAI/ChatGPT_Demo.designsystem?raw=true) and use the Import function on the Design System page to add this system to your org. 

## Import Skuid page
- Page API:  V2
- Page XML:  [Copy the XML from this page](chatPDF.xml?raw=true), or save it as an XML file, and upload it as a new page in Skuid's pages list.

## Notes
ChatPDF has a few limitations: 
- Only supports chat with one PDF at a time. However - Skuid could potentially provide a single frontend experience that submits a request to multiple PDF chat bots.
- Can access files via URL, but limited in that it can’t navigate complex folder structures.

For more sample resources that are AI related, check out [OpenAI](../openAI) section.