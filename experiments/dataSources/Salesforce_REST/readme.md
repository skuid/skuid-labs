## Salesforce data access using REST
Salesforce has a super rich array of APIs that provide access to far more data than can be gathered from Skuid's direct SFDC data source type.  

Some examples of this include: 

* Access to Data.com objects
* Access to the [interface API](https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_get_started.htm)-  like creating a model of field picklist values. 
* Access to many [setup objects](https://developer.salesforce.com/docs/atlas.en-us.220.0.object_reference.meta/object_reference/sforce_api_objects_concepts.htm) not exposed as objects to Skuid.  

Fortunately it is easy to build a REST data source that accesses Salesforce so you can use these other APIs and access these objects. 

## How to use this data source

### Create the data source

First you'll need to create a new REST data source that connects to the target Salesforce org.  Configure it as follows:
* URL / Endpoint: ``https://<<MyDomain>>.my.salesforce.com``
* Use Proxy:  False
* Authentication Method:  **No authentication**
* Add the following to "Common Request Headers" section. 
``Authorization: Bearer {{$Api.Session_Id}}``


#### Double check the remote site setting

* Skuid will try to automatically set up a remote site setting _for your org_ in SFDC for this data source,  but you might need to edit it.  Check in Salesforce Setup at **Security > Remote site settings**  

#### Create a CORS entry

* Allowing the browser to retrieve data directly is the fastest method for Data Sources (as opposed to using the Server Proxy),  but it does require that you whitelist the endpoint so you don't have a CORS violation.  
* Go to **Security > CORS** 
* Create a new entry - generally it will be the same domain where you ultimately intend to host the page.  ``https://<<mydomain>>.visual.force.com``


### Create REST model methods to connect to specfic APIs


#### Retrieve all metadata related to contact object:      

*   Query method with this URL:   ``/services/data/v46.0/sobjects/Contact/describe``
*   Use "Path to contents" to access folders within this response. 
    
#### Add a contact

*     Insert method with this URL:  ``/services/data/v46.0/sobjects/Contact``
*     Insert the fields for contact as JSON in the request body

####  Query contacts   
* Query method with this URL:  ``/services/data/v46.0/query/?q=SELECT+id,FullName,Email+from+Contact``
* The query string accepts your full SOQL query.     
