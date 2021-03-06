# Show Salesforce Einstein Analytics data in Skuid
Einstein Analytics (EA) is a powerful data integration and analysis platform.  It does a lot of things Skuid cannot do.  But there are going to be times when you would like to incorporate an EA report into your Skuid page and use Skuid components to show the data - rather than use an Einstein Dashboard or component.  Here is how. 

Some resources:

- [Get a free Einstein-enabled Salesforce developer org](https://developer.salesforce.com/promotions/orgs/analytics-de) - with EA enabled and sample datasets (that we will be using in these pages)
- [Ananlytics API doc](https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_rest_resources_overview.htm) (from Salesforce Developer resources):  
- [Analytics query language (SAQL) reference](https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_saql.meta/bi_dev_guide_saql/bi_saql_intro.htm)


## How to use this data source

NOTE: This experiment will only work in an Einstein-enabled org.  You can get a free Developer Org with Einstein enabled if you want to play along. A normal Developer Edition org will not work. See link above. 

### Create the data source

Follow the instructions in the "SalesforceREST" folder immediately above to create a generic "Salesforce REST" data source. 

### Create a new page (V2 page API) and copy the XML from the file: "Einstein_Analytics_Resources"  

This will show you all the datasets and lenses you have enabled in the org and give you direct links to them. 

## But I want some Data! 

Showing data from Einstein Analytics requires use of the [Query endpoint](https://developer.salesforce.com/docs/atlas.en-us.bi_dev_guide_rest.meta/bi_dev_guide_rest/bi_resources_query.htm)

Here is how: 

#### Find a resource in Einstein Analytics studio - prepare it for use in a query

-   Open a lens or dashboard element.  Or create a new one! 
-   Open the "Query mode" view of a lens,  or use the "more details" button on the details panel of a dashboard.  Look for the query code.  It looks like this: 

```
q = load "DTC_Opportunity_SAMPLE";
q = group q by ('Industry', 'Product_Family');
q = foreach q generate 'Industry' as 'Industry', 'Product_Family' as 'Product_Family', sum('Amount') as 'sum_Amount';
q = order q by 'sum_Amount' desc;
q = limit q 2000; 
```
    
- Copy this code to a text editor and make the following changes: 
    -  Add a JSON wrapper to the query.  
        - Append ``{"query":"``  to the beginning
        - Finish the block with ``"}``

    - Replace the name of the dataset, which comes in the first line after “load” with a combination of its id and current version id.  You can find the ids in the EA_Resources page that we created above. 

    - Add a leading `\` in front of any double quote in the query statement itself in order to escape the characters.  (Don’t replace the double quotes in the JSON wrapper you added in step 1. 

    - Take out all line breaks.  The JSON block will be one long line.   It will look somthing like this: 

``{"query":"q = load \"0Fb6g0000008aw2CAA/0Fc6g0000009ZKoCAM\";q = group q by (‘Close_Date_Year’, ‘Account_Type’);q = foreach q generate ‘Close_Date_Year’ as ‘Close_Date_Year’, ‘Account_Type’ as ‘Account_Type’, sum('Amount') as 'sum_Amount';q = order q by 'sum_Amount' desc;q = limit q 2000;"}``


#### Create a new REST model on your Skuid page

- Properties: 
    - Data Source URL:  “/services/data/v42.0/wave/query”
    - HTTP Verb:  “POST” 
    - Request body contents “As Templated Request Body”
    - Template:  Copy the JSON block you created above. 

- You will need to swap over to the XML and add a “Path to Contents” entry in the highest level node of the model.   Add this to the end of the node  ``<model id=” …    pathtocontent="results.records" ``

- Skuid cannot retrieve the model metadata in the builder, so you will need to manually create the fields.  Create a field for each of the items in the “generate” line of the query payload.  So for example in the query above you need to add fields with ID  ‘Close_Date_Year’,  ‘Account_Type’ and 'sum_Amount’  

Now you should have the records in a skuid page that you can use in a chart, in a table, or any other visual component. 


#### A note about filtering

You can add “filter by” statements into your query.  See below

```
q = load \"0Fb6g0000008aw2CAA/0Fc6g0000009ZKoCAM\";
q = filter q by 'Close_Date_Year' == \"2016\";
q = group q by ('Industry', 'Product_Family');
q = foreach q generate 'Industry' as 'Industry', 'Product_Family' as 'Product_Family', sum('Amount') as 'sum_Amount';
q = order q by 'sum_Amount' desc;
q = limit q 2000;
```

To make these interactive - you might think you could add merge syntax to replace the hard coded year, and then find that Merge in model Condition. __But no.__  Because this merge is in the POST Request Body Template - it is not discovered as a “URL Merge” item and available to conditions. (There is an improvement in the works for this). 

But there is a workaround: 

- Create a UI-Only model and picklist field. 
- Use Global merge syntax to push that field value into the POST Request Body Template. Like this: 
``q = filter q by 'Close_Date_Year' == \"{{$Model.UiOnly.data.0.year}}\";``
- Add a field editor to your page with that UI-Only picklist field.  (the button group display type for picklist fields is great here). 
- Add a model action to that UI-Only model such that when the Year field is updated - your Analytics model is requeried.  


## A sample dashboard. 

Create a new V2 Page and use the XML found in “Einstein_Analytics_DTC_Dashboard”  to see a simple dashboard that is filterable by year.  This dashboard is a combination of charts and KPI blocks.  

**Note**: You will see an error similar to the following within the App Composer: `1: Error retrieving metadata for Model(s) associated with Data Source '...'. Please check Models' properties to ensure they are set correctly. Error connecting to REST Data Source at URL "https://<<myDomain>>.my.salesforce.com/services/data/v42.0/wave/query": Expected query or query name in body.` *This is expected*.  It's because Skuid doesn't use our custom template when fetching metadata, but only at build time. The runtime—when you preview the page—will work as intended.  (There is also an improvement in the works to correct this) 
