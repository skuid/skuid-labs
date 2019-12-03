# XKCD API

XKCD is a webcomic created in 2005 by Randall Munroe. The comic's tagline describes it as "A webcomic of romance, sarcasm, math, and language".
The site provides a RESTful API to retrieve comic titles, URLs, post dates, transcripts, and other metadata. This metadata is provided in an easily-parsed, plaintext format.

Try the API:   Put this URL in your browser:  https://xkcd.com/info.0.json
It returns an array of JSON data.  Skuid can use this as a datasource. This is the most straightforward REST API possible, and therefore a great way to start learning with Skuid. 

## How to use this API: 
- Create a new Data Source. 
    - Type:  REST
    - Label: XKCD
    - URL / Endpoint:   https://xkcd.com
    - Use Proxy:   True
    - Authentication:  None 

- Create a new page
- Create a model that retrieves information about the latest published comic. 
    - Data Source Type: REST
    - Data Source:  XKCD
    - Model Behavior: Read-Only
    - DataSource URL:  info.0.json
    - All other properties can be default

Select "Fields" on the model properties to see the available fields.  Add the ones you care about to your model. 

## Page Ideas. 

- Add an Image to your page to show the {{img}} field. 
- Use a Form to show the metadata about the comic. 

## Sample Page. 

Grab the XML from "Random_XKCD" file in this directory to see a random comic generator. 
This page uses a custom formula to generate the random number. 

##Next Steps.

Make a better website than XKCD.com! 