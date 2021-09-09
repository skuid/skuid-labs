# Remove Salesforce Header with Lightning to Visualforce Redirect

## Description:
This folder contains the custom lightning component, controller, and Visualforce (VF) sample code necessary to redirect your Lightning tab to a VF page with no Salesforce header. 



## Setup Instructions

### Visualforce Setup
Create a new [VF page](https://developer.salesforce.com/docs/atlas.en-us.pages.meta/pages/pages_quick_start_hello_world.html) and copy the code from the vForceSkuidPage file, adding the name of your Skuid page in the ``page`` attribute of the ``skuid:page`` component.

For more information about this Visualforce component, [see the skuid:page Skuid docs](https://docs.skuid.com/latest/en/skuid/deploy/salesforce/visualforce/skuid-page-visualforce-component.html).
 
**Note**: Make sure end users have the necessary permissions to view your Skuid page **and** the VF page once deployed.

### Lightning Setup
In your lightning developer console, create a new component(ex: sfHeaderRemoval), and under Component Configuration, check the appropriate boxes you would like to make a bundle with(i.e., Lightning pages, lightning tab, etc.). 

First, copy and paste the code in: `headerRemoval.cmp` into your newly created component. 

Next, copy the code in `headerRemovalController.js` into the controller and replace the URL with the VF page URL
 
## Usage:
In the custom Lightning tab
* Add the custom component on the top of the page and save. 

When you click on the new tab, it will redirect you to the VF page without the SF header. 

Thank's [k10-tti](https://github.com/k10-tti) for contributing to the community! 