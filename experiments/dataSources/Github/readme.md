# Connect to Github.com APIs via a Skuid REST Data Source 

Many companies leverage Github for source control and as a secure source code repository. For any organization in a regulated industry, this brings compliance obligations including auditability of access control, authorization, and change management. This guide is a tutorial for creating an auditing dashboard leveraging Skuid and Github to help you meet these obligations. 

## Setting up your Github service account and API token 

In the interest of security and audit trail, we recommend that you create a service account in Github and add it to your Organization for this integration. Keep in mind that you will need to explicitly add this service account to any private repositories in order for the service account to be able to interact with it. **TIP: Role Based Access Control implemented via Github Teams is preferable to adding this service account to individual repositories**.

## Generating an API token 

To generate an API token in Github, login to your service account and [here](https://github.com/settings/tokens). Then, select "Personal access tokens". You will be prompted to enter your password. Do so and then select the appropriate permissions for your API token. For this application select, "repo" and "user". Finally, generate your token and keep it secure. You will need to enter it in the Skuid Data Source in the next step. **NOTE: The permissions required will depend on your specific integration.**

## Creating the data source

The next step is to create your Skuid Data Source. To do this, go to the "Data Sources" tab and click "Create". You should create the data source with the following values: 

* Type: REST
* Name: Github
* URL/Endpoint: https://api.github.com
* Use proxy: True
* Authentication Method: Basic HTTP Authentication
* Credential source: Shared by all Site users
* Site-wide default username: <Github service account username>
* Site-wide default password: <Github service account API token>
* Common request headers: "User-Agent: {{$UserAgent}}"
* Common request headers: "Accept: application/vnd.github.groot-preview+json" 

**NOTE: If you want to allow write access with this data source the Credental Source should be set to "Per-user, with optional site wide defaults" this way each user can enter their individual credentals and authorization/audit trail are preserved.**


## Creating a page which connects to specific APIs

You are now ready to create a Skuid page with your Github data source and start getting data on the screen. First, go to the "Pages" tab and select "Create". Next create a "Model" with the following values: 

* Model Id: Github_Teams
* Data Source Type: REST
* Data Source: Github
* Model Behavior: Read-Only
* Data Source URL: /orgs/<INSERT COMPANY ORG NAME HERE>/teams

All other values are default. 

Click "Fields" under your new model’s name. You should see a list of all of the fields available in the response! 

## Page Ideas 

Now that you have a working integration with Github you can leverage any of their endpoints by creating a new Skuid model and altering the "Data Source URL" to whatever endpoint you are trying to reach. A link to their API documentation can be found [here](https://developer.github.com/v3/). You might consider leveraging the "teams" endpoint for each of your repositories to easily audit which teams have what level of access. You could also leverage the Pull Requests and/or the Commits endpoints to audit details of changes to your repos.  

## Tips and Gotchas

* Github standard page size(the number of results it returns per query) is 25. This can be expanded up to 100 by appending the "per_page" parameter to the end of your Data Source URL.

* Github has a rate limit of 5000 requests per hour for authenticated requests and 60 an hour for unauthenticated requests. While this likely not something you'll run into it is good to be aware of.
 
* If you are running into authentication problems check to make sure your service account has access to the repo you are trying to access. This can also manifest in an "incomplete response" such as returning only public repositories when you query all repositories.
