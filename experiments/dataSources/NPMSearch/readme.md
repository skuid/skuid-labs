# Search and Analiyze NPM Packages in Skuid
NPM is the world's largest software catalog. It was created in 2009 as an open source project to help JavaScript developers easily share packaged modules of code.

[NPMS.io](https://npms.io/) is an open source search and analysis project that has been built on the NP catalog. In good open-source fashion, they have exposed the technology behind the search engine as a REST API so that others can use it creatively. [Their API docs are here.](https://api-docs.npms.io/)

This API is exposed without any authentication - which makes it super easy to use in Skuid. It is a great way to explore the following concepts in Skuid:
- Searching / filtering for a particular record.
- Display of detail information (and related lists) about a single record.

## How to use this data source

### Create the data source

First you'll need to create a new REST data source. 
* Type: REST
* Name: NPM
* URL / Endpoint: ``https://api.npms.io/v2``
* Use Proxy: False
* Authentication Method: No Authentication


#### Double check the remote site setting

* If you are using Skuid on Salesforce, you will be prompted to appove the creation of a remote site setting for this data source. If your pages do not work, you might need to edit it.  Check in Salesforce Setup at **Security > Remote site settings**.   

#### Create a CORS entry

* Allowing the browser to retrieve data directly is the fastest method for data sources (as opposed to using the Server Proxy), but if you are using Skuid on Salesforce, you will be required that you whitelist the endpoint so you don't have a CORS violation.
* Within Salesforce Setup, go to **Security > CORS**.
* Create a new entry - generally it will be the same domain where you ultimately intend to host the page. ``https://<<mydomain>>.visual.force.com``

### Create a page with this REST model to search for NPM Packages

- Create a new page

- Create a model that searches the NPM registry for particular keywords. 
    - Data Source Type: REST
    - Data Source: NPM
    - Model Behavior: Read-Only
    - Data Source URL: /search?q={{search}}
    - Query on page load: Off. Since this is a Search model - it will need a keyword passed into the merge variable {{search}} before a query is executed, or you will get an error.
    - All other properties can be default. 

- Select “Path to Contents” and choose “Results”. You will be asked to provide a value for the {{search}} merge variable. The word "Skuid" should work.   

- Select "Fields" on the model properties to see the available fields. You can traverse down through the data structure to select specific fields to include in your model. 

- Create a condition that interacts with the {{search}} parameter 
    - Type: Url Parameter
    - URL Parameter: Search
    - Value: Leave this blank
    - State: Filterable Default off. 

## Page Ideas

- Add a table to search for NPM Packages and display information about them. 
- Turn on the search control and have it interact with the model condition you created (Server search). 
- It will also be important for the “Empty Search Behavior” property to be set to “Remove all Model Data”. If you use the "Re-query" property - a blank search will be processed which will cause an error.

## Sample Page

Create a new V2 Page and copy the XML from "NPMS_Package_Search" file in this directory to see a more fully constructed package search tool. It performs the package search we created above, and then lets you select from the search results to retrieve an interesting amount of analysis about a single NPM Package.

### Page Notes
- When you open the page for the first time, you will be asked to provide a value for the {{search}} merge variable. You can simply cancel the modal - but a red page error will persist. You can also enter the name of your favorite NPM package. 

- There are multiple models that touch the same “analysis” endpoint. These models use different “Paths to contents” to retrieve different arrays of data buried in the analysis body. This way, we can create a model of all Github collaborators for the package - and show fields about these collaborators across the multiple records.

- The list of packages on the left hand side of the page has a simple action sequence used to pass the selected package name into a condition found on all the detail models and then requery them.  This is a very typical pattern for master detail pages. 

- The detail panel uses conditional rendering to hide results until a package is selected.  Panels are also hidden when data is not present. No keywords -- no keyword section.  Elegant! 

## Next Steps

- The search API supports a number of other qualifiers that can be used to filters this data.  You should be able to create a filter on Author, or Keyword.

- This page makes no attempt to be elegantly styled.  Use the design system posted in the [sampleStyleGuidePage experiment](https://github.com/skuid/skuid-labs/tree/master/experiments/pages/sampleStyleGuidePage_). Make this package information page really look nice. You will have to choose component variants (especially for wrappers) to get a well styled page. Or follow your own muse and adjust the look and feel in the Design System Studio. 

- The ReadMe block is showing Markdown and HTML code.  Skuid’s V2 components do not currently support display of stored HTML.  Creating a custom component for this would be epic. 