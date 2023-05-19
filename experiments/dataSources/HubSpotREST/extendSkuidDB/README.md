# Extend HubSpot with SkuidDB
This is only available when using Skuid NLX. This sample page shows how you can store and track scoring of an in-progress deal over time in SkuidDB. 

## Features
* Query single record using URL parameter
* Connect to a table in SkuidDB to store deal scoring based on SPICED methodology
* Save the deal score back to HubSpot CRM as a custom field on the Deal object

## Instructions for Skuid page
- Page API:  V2
- Data source: 
1. REST data source named "HubSpotTestApp" connecting to your HubSpot instance per [instruction](HubSpotREST)
2. Skuid database named "Demos", with a table named "HubSpot_SPICED_Score"
- Design system: None 
- Page XML:  [Copy the XML from this page](HubSpot_Extend_with_SkuidDB_SamplePage.xml?raw=true), or save it as an XML file, and upload it as a new page in Skuid's Pages.

## Instructions for data source setup
1. In HubSpot CRM, create a custom property for Deals with API name of `spiced_score` 
2. In Skuid, create a Skuid database named "Demos" and a table within that database named "HubSpot_SPICED_Score", with these following fields:
- critical_event_qualification (textarea)
- critical_event_score (double)
- decision_qualification (textarea)
- decision_score (double)
- impact_qualification (textarea)
- impact_score (double)
- pain_qualification (textarea)
- pain_score (double)
- situation_qualification (textarea)
- situation_score (double)
- is_active (boolean)
- related_hubspot_deal (double)
- related_hubspot_deal_stage (text)
- spiced_total_score (double)


## Useful links
- [About SPICED sales methodology](https://www.skuid.com/blog/how-to-achieve-recurring-revenue-success-delivering-impact-to-customers-with-spiced)