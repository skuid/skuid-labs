# Skuid + HubSpot REST API
HubSpot CRM platform helps businesses organize and manage their interactions with customers and prospects. It provides features such as contact management, sales pipeline tracking, email integration, and task management. HubSpot API supports both read and write operations, allowing developers to retrieve data from HubSpot, as well as create, update, and delete data within the platform. It provides access to various endpoints that represent different entities in HubSpot, such as contacts, companies, deals, tasks, and marketing campaigns. For more info, see [HubSpot REST API documentation](https://developers.hubspot.com/docs/api/overview)

## HubSpot prerequisites

Before we get started you'll need the following: 
- A HubSpot CRM instance or a [HubSpot developer instance](https://developers.hubspot.com/get-started)
- An [API key for your account](https://developers.hubspot.com/docs/api/private-apps): The API key is what Skuid will send along with its authentication request to prove that you're you. We'll use this in the data source configuration step.

## Create a Skuid data source

In your Skuid site, configure a data source with these properties:

- **Name**: HubSpotTestApp
- **Data Source Type**: REST
- **URL**: ``https://api.hubapi.com``
- **Authentication Method**: No Authentication
- **Use (Apex) Proxy**: Checked

And within *Headers to send with every request*, append the following values in the **Common Request Parameters**:

- Accept: ``application/json``
- Content-Type: ``application/json``
- Authorization: ``Bearer <paste your API key here>``

If prompted for a Remote Site Setting, accept it. Otherwise, you'll need to create one manually. 


## Directory
* [Standard Objects](standardObjects)
* [Custom Objects](customObjects)
* [Extend HubSpot with Skuid DB](extendSkuidDB)
