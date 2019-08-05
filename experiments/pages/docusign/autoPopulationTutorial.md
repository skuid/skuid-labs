

## DocuSign Auto-Populate Integration Set-up
 
##### What you’ll need: 
1.	A DocuSign sandbox account (create one here: https://go.docusign.com/trial/).
2.	A Skuid page with data you want to push to a DocuSign template.
3.	(Eventually) admin access to the production DocuSign account that will be sending the template document for signatures.

##### DocuSign : 
1.	In your sandbox account, navigate to the admin section. 
2.	From the menu on the left, select “API and Keys”.
3.	Click “Add Integrator Key”, define a description and save
4.	Select your new integrator key and create the correct Skuid Redirect URIs (generate yours with this tutorial: https://docs.skuid.com/latest/en/data/callback-urls-redirect-uris.html)
5.	Generate a secret key and store it somewhere safe. (Warning: you will only be able to access it one time). Click Save. 
6.	Go back to DocuSign 
7.	Create a template and upload the document that is to be populated and sent 
8.	Define recipients roles and signing order. (If the recipient is going to be variable, only fill in the role name)
9.	Create signature tabs and define a role for each tab. 
10.	Create plain text tabs (fields) for each data item that you want to populate. (Make sure to specify the recipient). 
a.	Define a custom data label (no spaces) for each tab. 
11.	Take note of the Template Id (the Id can be found in the URL when viewing the document)
 

##### Skuid Configure: 
1.	Go to Data Sources > Authentication Providers
2.	Create a new Authentication Provider with a unique name and DocuSign Provider type. 
3.	Set the Authorize Endpoint URL and Token Endpoint URL to:
a.	 Authorize: https://account-d.docusign.com/oauth/auth
b.	Token: https://account-d.docusign.com/oauth/token
4.	Set the Client Id to the Integrator Key Id defined in DocuSign
5.	Set the Client Secret to the Secret Key you saved from DocuSign earlier. Save!
6.	Now go to Data Sources > Data Sources
7.	Create a New Data Source with a unique name and with the REST Data Source Type
8.	Set the URL to  https://demo.docusign.net/restapi and select the Authentication Provider that you created in Steps 1-5.


##### Skuid Page:
1.	Create a REST api model on the DocuSign data source with Read/Write Model Behavior.
2.	On this new model, select Methods>insert
3.	Set values as follows: 
a.	type =Insert
b.	url = /accounts/{{AccountId}}/envelopes/
c.	HTTP verb =POST 
d.	Send new field values = “As templated request body” 
4.	On this model, create a field for every piece of data that you want to insert into the DocuSign template. Also include fields for undefined recipients (name and email). 
5.	For each field you create, set the default value to point to the data you want to merge (Field from another model is the easiest way to do this).
6.	Get ready to create your custom request body!


##### Creating Your Custom Request Body:
Because DocuSign’s REST API is fairly complex, creating a custom request body with merge variables is the way to go. (View an example below!)
You can basically follow the format given in the DocuSign API Explorer:  https://apiexplorer.docusign.com/#/esign/restapi?categories=Envelopes&tags=Envelopes&operations=create but you will only need the following fields: 
1.	Envelope
a.	Status  - either sent or created (for a draft)
b.	Template Id  - referenced above. 
c.	Email Subject - define the subject of the email to be sent with the docusign doc. 
2.	Recipient
a.	name
b.	Email
c.	roleName - same as defined in the DocuSign template
d.	recipientId - the best way to get this is to do a get request on the api explorer  (https://apiexplorer.docusign.com/#/esign/restapi?categories=Envelopes&tags=EnvelopeRecipients&operations=list) 
e.	routingOrder (optional) - can also be defined in DocuSign, but it can be helpful to conditionally choose the routing order in Skuid. 
3.	Recipient tab
a.	tabLabel - Data Label defined in DocuSign
b.	value - the value you want to insert (use merge syntax here!)
c.	font (optional) - choose a font to stylize your text. 
i.	Supported Fonts: Arial, Arial, ArialNarrow, Calibri, CourierNew, Garamond, Georgia, Helvetica,   LucidaConsole, Tahoma, TimesNewRoman, Trebuchet, Verdana, MSGothic, MSMincho, Default.

##### See it in action!: 
1.	In your Skuid page:
2.	Make sure there is a new row on the “POST” model. 
3.	Create an action that saves the new row. 
4.	Look for an email from DocuSign (if you are the first recipient) 
5.	You did it!

##### Promote your key to a production account: 
In order to send real DocuSign documents, you must promote your API key to a production account. Once it has been promoted, you will need to change some of the data source settings to match the new URL etc. 
To do this:
1.	Promote your key (tutorial:https://support.docusign.com/guides/ndse-admin-guide-api-and-keys) 
2.	With the new key in the production account, follow steps 2-5 under the DocuSign section above. 
3.	You will also need to transfer your template, which is made simple by selecting the download option on the template you want to transfer and then selecting new > upload template in the production account. 
4.	In Skuid configure, you will need to modify the authentication provider and data source
a.	New Data source URL: https://na2.docusign.net/restapi/v2 (may change based on your instance)
b.	New Authentication Provider endpoint and token endpoint URLs : https://account.docusign.com/oauth/auth
c.	Also make sure to update the client Id and Client secret if they have changed. 
5.	In your Skuid page, modify the JS snippet to change the url in the request body to: https://na2.docusign.net/restapi/v2/accounts/<accountId>/envelopes/ 
6.	Test it out! 

##### Troubleshooting:
1.	To see the status of your request in your Skuid page, go to inspect > network and look for the request. 
2.	If template fields do not seem to be populating, make sure the first signer is the owner of the tabs in your DocuSign template. Once they sign, the values in the tabs should be visible to other signers. 


##### Example payload snippet:  
 


    {
        "status": "sent",
        "emailSubject": "Please DocuSign this Form",
        "templateId": "<Your template Id>",
        "templateRoles": [{
            "name": "{{RecipientName}}",
            "email":"recipient@gmail.com",
            "roleName": "Recipeint1",
            "recipientId": "1",
            "routingOrder": "1",
            "tabs": {
                "textTabs": [{
                    "tabLabel": "EmployeeName",
                    "value": "{{employeeName}}",
                    "Font": "Calibri"},
                    {
                    "tabLabel": "EffectiveDate",
                    "value": "{{Date}}",
                    "Font": "Calibri"},                        
                    {
                    "tabLabel": "Notes",
                    "value": "{{Notes}}",
                    "Font": "Calibri"
                    }]
            }
            
        },
        {
            "name": "{{employeeName}}",
            "email": "{{employeeEmail}}",
            "roleName": "Employee",
            "recipientId": "2",
            "routingOrder": "2"
        }]
    }


