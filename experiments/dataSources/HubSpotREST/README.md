# Skuid + HubSpot REST API

## Connect to your HubSpot instance
[HubSpot REST API documentation](https://developers.hubspot.com/docs/api/overview)

### Data Source
* Go to Data Sources and create a new data source with these attributes:
    * For Type, choose REST
    * For URL / Endpoint, use `https://api.hubapi.com`
    * For Common request headers, for field, use Authorization, and for value, use `Bearer <your API Key>`
    * Save

Notes:
* To obtain an API key from your HubSpot instance, follow [HubSpot's documentation](https://developers.hubspot.com/docs/api/private-apps) 


## Directory
* [Standard Objects](standardObjects)
* [Custom Objects](customObjects)
* [Extend HubSpot with Skuid DB](extendSkuidDB)
