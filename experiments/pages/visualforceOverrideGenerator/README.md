# Visualforce Override Generator

Instead of handwriting Visualforce pages while overriding Salesforce pages with Skuid, this page parses out what you need through a set of options and generates the Visualforce markup and page record using Salesforce's Tooling API. From there, you can select the generated page as your Visualforce override as needed.

## Before you begin

Before using this experiment, you'll need to create a few things:

1. [A Salesforce connected app](https://docs.skuid.com/latest/en/data/salesforce/#set-up-a-salesforce-connected-app), connected to your **current** org. You'll effectively connect the org to itself.
2. A properly configured [authentication provider for the Salesforce org](https://docs.skuid.com/latest/en/data/salesforce/#create-the-authentication-provider), again **you're connecting the org to itself.** In my example I named the auth provider ``SalesforceMetadata``, as that is what this page will be accessing.
3. A REST API Skuid data source called ToolingAPI which points to your Salesforce authentication provider. Its properties will look like this:
  - **Name**: ToolingAPI
  - **Data Source Type**: REST
  - **Use Proxy**: Checked
  - **Authentication Method**: 
  - **Authentication Provider**:
4. This Skuid page! Copy and paste the included XML into a **v1** Skuid page, or upload the XML as a **v1** Skuid page.

When you create the page, you'll be asked to provide a sample value for the merge variables used in the page. 

## How to Use

1. Select your options, and you'll see your VF code dynamically generate.
2. Press the button to create the page on your org.

From there, all you have to do is set your override on your object/action!

## How It Works

1. A Template component processes all of your options and generates the code in the text box. Options are kept in globally stored JS variables.
2. A button press activates the following sequence of events:

   - Creating the ApexPage
     - A blank apex page is created on a row in the ApexPage model, titled after the VFPageName variable
     - That row is then saved.
     - After successfully saving, the model is updated to we can see the Salesforce assigned ID.
 
   - Creating the Metadata Container
      - A Metadata Container is generated using the same process as ApexPage (create row, save, updateData)
 
   - Creating the ApexPageMember
     - An ApexPageMember is created, which pulls in the SF IDs from the apex page and the metadata container.
     - The ACTUAL page markup is inserted at this point, since we finally have permissions.
 
   - Creating the ContainerAsyncRequest
     - A ContainerAsyncRequest is generated and pulls in the Metadata container ID.
     - The ContainerAsyncRequest saves, deploying the page to the org.

## Other Notes

- I tried to see if the object-action override was changeable via the API, but I couldn't find the appropriate object to POST to when I made this. More research to be done.
  https://developer.salesforce.com/docs/atlas.en-us.api_tooling.meta/api_tooling/tooling_api_objects_standardaction.htm?search_text=override
