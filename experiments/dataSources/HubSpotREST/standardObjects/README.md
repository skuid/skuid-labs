# Work with HubSpot standard objects 
This sample page provides examples of working with 2 standard objects in HubSpot, Deals and Line Items. 
Some functionalities include:
* Query, insert, update, and delete Deals
* List > Detail view layout to provide a list of deals on the left menu and click to open deal details. 
* Send Batch request to HubSpot REST API to create multiple Line Items associated with a Deal
* Wizard component: create a Step by step form to add items to quote
* Override metadata for Deal Stage field to have a user friendly picklist dropdown. REST API returns values for Deal Stage like "qualifiedtobuy" but you can override this field to provide a label like "Qualified to buy".

## Instructions
- Page API:  V2
- Data source: REST data source named "HubSpotTestApp" connecting to your HubSpot instance per [instruction](HubSpotREST)
- Design system: None 
- Page XML:  [Copy the XML from this page](HubSpot_StandardObjects_SamplePage.xml?raw=true), or save it as an XML file, and upload it as a new page in Skuid's Pages.
