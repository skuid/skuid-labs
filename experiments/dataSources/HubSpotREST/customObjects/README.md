# Work with HubSpot custom object
This sample page shows how to connect and work with HubSpot custom objects in Skuid.  

## Features
* Query single deal record using URL parameter
* CRUD operation on that record
* Connect to a custom object in HubSpot called Booking
* Calendar component to show and create bookings for a deal

## Instructions
- Page API:  V2
- Data source: REST data source named "HubSpotTestApp" connecting to your HubSpot instance per [instruction](HubSpotREST)
- Design system: None 
- Page XML:  [Copy the XML from this page](HubSpot_CustomObject_SamplePage.xml?raw=true), or save it as an XML file, and upload it as a new page in Skuid's Pages.

## Notes
This page shows how to connect to a custom object in HubSpot using that custom object id, so you'll want to replace that custom object id with the id of your custom object from your HubSpot instance, then select your fields accordingly. If you want to use this sample page as is, you'll want to create a custom object in HubSpot called Booking with these following API fields:
- booking_name (type: single-line text)
- booking_type (type: single-line text)
- enddatetime_txt (type: single-line text)
- startdatetime_txt (type: single-line text)
- room (type: single-line text)
- booking_all_day (type: single checkbox)

Then in the XML, replace the custom object id `2-13706548` in the page XML with your new Booking object id. 

## Useful Links
- [How to create and edit custom objects](https://knowledge.hubspot.com/crm-setup/create-custom-objects)
- [HubSpot Custom Object API documentation](https://developers.hubspot.com/docs/api/crm/crm-custom-objects)