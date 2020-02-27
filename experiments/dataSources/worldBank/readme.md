# Analyze World Bank statistical data in Skuid
The World Bank provides free and open access to global development data.  Information like GDP, Population, Economic growth and Development measures are available for your Skuid pages. 

Some introductory links with information about this API from the World Bank Website: 
-  [Overview of the data available through this API](https://datahelpdesk.worldbank.org/knowledgebase/articles/889386-developer-information-overview) 

- [About the API](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392)

- [The Basic Call Structure](https://datahelpdesk.worldbank.org/knowledgebase/articles/898581)


This API is exposed without any authentication - which makes it super easy to use in Skuid. It is a great way to explore the following concepts in Skuid:
- Searching / filtering for a particular record.
- Using stastical data in dashboards. 

## How to use this data source

### Create the data source

First you'll need to create a new REST data source. 
* Type: REST
* Name: WorldBank
* URL / Endpoint: ``http://api.worldbank.org/v2/``
* Use Proxy: True
* Authentication Method: No Authentication


#### Double check the remote site setting

* If you are using Skuid on Salesforce, you will be prompted to appove the creation of a remote site setting for this data source. If your pages do not work, you might need to edit it.  Check in Salesforce Setup at **Security > Remote site settings**.

If the remote site setting is not present, create a new one and enter these values:
- Remote Site Name: WorldBank
- Remote Site URL: http://api.worldbank.org

#### Create a CORS entry

* Allowing the browser to retrieve data directly is the fastest method for data sources (as opposed to using the Server Proxy), but if you are using Skuid on Salesforce, you will be required that you whitelist the endpoint so you don't have a CORS violation.
* Within Salesforce Setup, go to **Security > CORS**.
* Create a new entry - generally it will be the same domain where you ultimately intend to host the page. ``https://<<mydomain>>.visual.force.com``

### Create a page with this REST data source to review World Bank statistics

- Create a new page
    - Or jump to the `Sample Pages` section below and use some pages we've built for you. 

- Create a model that returns GDP data for all countries.  
    - Data Source Type: REST
    - Data Source: WorldBank
    - Model Behavior: Read-Only
    - Data Source URL: ``countries/ALL/indicators/SP.POP.TOTL?format=json``
    - All other properties can be default. 

NOTE about Path to Contents:  WorldBank nests data within JSON, so the root of the response payload is just metadata about the call.  In order to get to the data itself, you have to go into the XML and indicate that the path to contents = ``1``.   See the example XML below:  (See final attribute of node) 

``<model id="Sources" query="true" createrowifnonefound="false" datasource="WorldBank" verb="GET" payloadcontenttype="JSON" endpoint="/sources?format=json" pathtocontent="1">``

Once you have done this in XML you can go back to the composer. (Once you have one model set up this way,  clone the model to set up the next one and you will not have to go back to the XML to set "path to contents")

- Select "Fields" on the model properties to add the following fields to your model: 
    - countryiso3code
    - date
    - value


## Page Ideas

- Add a table to your page to quickly see the data being returned. 
- Use a chart to see data changing over time
- Replace the ``ALL`` value in the Data Source URL with ``{{Country}}`` - and use another model to populate that merge value with another ISO-2 Country value.  (e.g. BR for Brasil). 
- Create a "countries" model  (This API call will return countries:  ``http://api.worldbank.org/v2/country?format=json ``) and then use an action sequence to pass a particular row value into the merge syntax in the data source URL above. 


## Sample Pages

Two sample pages are included in this experiment.  Create a new V2 Page and copy the XML from these pages for more fully constructed examples. 

### WorldBankSources

- This page provides an index of all the statistical measures provided by the World Bank - along with the URL you'd need to use to create a model for this measure, and a sample dataset queried for this measure.

  - You will get popups asking for Merge Variable values for datasources.  You can use BR  (for Brazil) in all the popups.  

### WorldBankDashboard

- This page allows the user to select a single country (from a statstical region) and then shows several tabs of statical measures about the country. 

    - You will get popups asking for Merge Variable values for datasources.  You can use BR  (for Brazil) in all the popups. 

    - The world bank API allows you to call up to 60 statistical measures from a single statistical source in a single call  by providing the source ID and indicator codes separated by ; (semicolon).
    
    Example: ``http://api.worldbank.org/v2/country/chn;ago/indicator/AG.AGR.TRAC.NO;SP.POP.TOTL?source=2``
    
    a maximum of 1,500 characters allowed between two /’s (back-slashes). A maximum of 4,000 characters are allowed in the entire URL.


### Page Notes
- When you open the page for the first time in the composer, you will be asked to provide a value for the {{country}} merge variable. You can simply cancel the modal - but a red page error will persist. You can also enter your favorite country.  (BRA, GER,  ESP, RSA) 

- This page uses two models for each basic statictical category.  A first "Index" model just retrieves 1 row of data for each of the indicators in the category.  This model is used to create a deck - with a card for each indicator.  The second "details" model retrieves 10 rows of data for each indicator - for the particular country that has been seleted.  Then "context" is used on the components so that in a card the information fromt he details model is filtered to the particular indicator.  2 queries can be used to show KPI tiles and charts about as many as 60 indicators. 

- Each of the detailed models has a pretty complicated formula field designed to transform a measure into more readable KPI indicator.  Numbers are abbreviated to Thousands(K) and Millions (M),  and appropriate rounding is put in place.  This allows for more consistent readability.  Look for the ``DisplayValue`` UI-Only field in the ``PopoulationDynamics`` model. 

- The Inequality tab uses 5 indicators that show the amount of national income that belongs to each population quintile. Another UI only formula here uses a case statement to translate the indicator name into a more reader friendly value like "Top 20%"

## Next Steps

- This page makes no attempt to be elegantly styled.  You migh use the design system posted in the [sampleStyleGuidePage experiment](https://github.com/skuid/skuid-labs/tree/master/experiments/pages/sampleStyleGuidePage_).   Try to make a chart variant that looks more like a sparkline so that statistical information can be shown is a very compressed area,  While hiding gridlines and values.  



