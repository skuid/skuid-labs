# Show MORE Salesforce data in Skuid using REST
The standard Salesforce data source type allows you to connect to most sObjects and build compelling UI's with that data.  However there are some types of data within your org not accessible through the standard Salesforce Datasource.  Boo....

Don't worry! Salesforce provides a rich array of APIs that provide access to this type of data. In Skuid, it's easy to create a REST data source to retrieve data from these API's and create custom UIs.

Examples of this data include: 

* Access to [Data.com search](https://developer.salesforce.com/docs/atlas.en-us.datadotcom_api_dev_guide.meta/datadotcom_api_dev_guide/datadotcom_api_dev_guide_intro.htm)
* Access to the [interface API](https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_get_started.htm)-  like creating a model of field picklist values. 
* Access to many [setup objects](https://developer.salesforce.com/docs/atlas.en-us.220.0.object_reference.meta/object_reference/sforce_api_objects_concepts.htm) not exposed as objects to Skuid.  


## How to use this data source

### Create the data source

First you'll need to create a new REST data source that connects to the  **the current Salesforce org**.  While you can use this to connect to data in an external org, the example below assumes you want to access data within the org where you are working with Skuid.  Configure it as follows:

* Name:  SFDC_API
* URL / Endpoint: ``https://<<MyDomain>>.my.salesforce.com``
* Use Proxy:  False
* Authentication Method:  No Authentication
* Add the following to "Common Request Headers" section. 
``Authorization: Bearer {{$Api.Session_Id}}``


#### Double check the remote site setting

* Skuid may try to automatically set up a remote site setting _for your org_  for this data source. If your pages do not work, you might need to edit it.  Check in Salesforce Setup at **Security > Remote site settings**  

#### Create a CORS entry

* Allowing the browser to retrieve data directly is the fastest method for data sources (as opposed to using the Server Proxy),  but it does require that you whitelist the endpoint so you don't have a CORS violation.  
* Within Salesforce Setup, go to **Security > CORS**.
* Create a new entry - generally it will be the same domain where you ultimately intend to host the page.  ``https://<<mydomain>>.visual.force.com``


### Create a page with this REST model to connect to specfic APIs

#### Access to Einstein Analytics data

 Look at the folder below for specific instructions and page examples using this data source.   

#### Retrieve all metadata related to contact object:      

* Query method with this URL:   ``/services/data/v46.0/sobjects/Contact/describe``
* Use "Path to contents" to access folders within this response. 
    
#### Add a contact

* Insert method with this URL:   ``/services/data/v46.0/sobjects/Contact``
* Insert the fields for contact as JSON in the request body.

####  Query contacts   
* Query method with this URL:  ``/services/data/v46.0/query/?q=SELECT+id,FullName,Email+from+Contact``
* The query string accepts your full SOQL query.     

## Deploy this DataSource in Lightning Experience

Salesforce does not allow a custom Lightning component to access their own SF API. [See more details about why here.](https://salesforce.stackexchange.com/questions/55306/how-to-call-a-salesforce-rest-url-from-lightning-component). If you try to deploy the Skuid pages build with this model using the Skuid Page Lightning component - it won't work.  But if you use the VisualForce page component available in the Lightning App Builder - and expose your Skuid page with that method.  It will work!   

[This page](https://docs.skuid.com/latest/v2/en/skuid/deploy/salesforce/visualforce/skuid-page-visualforce-component.html#object-controller-independent-pages) in our Docs has the VF markup you will need to use. 
