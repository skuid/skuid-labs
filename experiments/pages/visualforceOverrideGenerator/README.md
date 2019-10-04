# Visualforce Override Generator

## Before you begin

  1. Salesforce connected app
  2. A properly configured authentication provider for your Salesforce org  
     See [Skuid docs](https://docs.skuid.com/latest/en/data/salesforce/#set-up-a-salesforce-connected-app) for more info.
  3. A REST API Skuid data source called ToolingAPI which points to your Salesforce authentication provider
  4. This Skuid page! Copy and paste the included XML into a Skuid page.

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
