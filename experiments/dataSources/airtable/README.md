# Airtable

Combining the ease of use of a spreadsheet with powerful features of a database, Airtable's product offers a great to organize, well, just about anything. We've used it for a few projects here at Skuid, so of course we wanted to see if we could use Airtable's REST API in a Skuid page. Spoiler alert: you can! This experiment walks you through the basic setup and includes a sample page.

One thing to note is that, while this example walks you through the basics for setting up the data source and an Airtable model **your data source URLs will vary for your specific Airtable base and the column you're acccessing.** For this example we're working from Airtable's Applicant Tracking template.

With all of that said, let's get connecting.

## Airtable prerequisites

Before we get started you'll need the following: 

- An [Airtable account](https://airtable.com/signup): If you haven't signed up for an account yet, go ahead and do so!
- An [API key for your account](https://airtable.com/account): The API key is what Skuid will send along with its authentication request to prove that you're you. We'll use this in the data source configuration step.
- The **ID for your Airtable base**: Bases are where you store information in Airtable, which can then be displayed in a variety of views. Instead of connecting to your Airtable account and querying for your bases from there, you'll instead obtain the base ID for the base you wish to connect to, and then use that ID when configuring your Skuid models.  
  1. Navigate to your [account's base API list page](https://airtable.com/api). Whenever you create a new base, its API will be available from here.
  1. Click the name of the base you wish to access.
  1. Once you've done this, you'll see Airtable's API docs generated specifically for the base you've selected. This is awesome! But for now we'll just need the instance ID; look for the "The ID of this base is..." text:

## Create a Skuid data source

In your Skuid site, configure a data source with these properties:

- **Name**: Airtable
- **Data Source Type**: REST
- **URL**: ``https://api.airtable.com/v0/``
- **Authentication Method**: No Authentication
- **Use (Apex) Proxy**: Checked

And within *Headers to send with every request*, append the following values in the **Common Request Parameters**:

- Accept: ``application/json``
- Content-Type: ``application/json``
- Authorization: ``Bearer <paste your API key here>``

If prompted for a Remote Site Setting, accept it. Otherwise, you'll need to create one manually. 

## Configure a Skuid model for reading Airtable Data

When using Airtable as a data source, you can think of your sheets as *objects*. So for any sheets whose columns you wish to access, you'll need to create a model. Let's do that now.

Go into an existing Skuid page or create a new one. Next, create a new model and configure its basic properties:

- **Name**: Enter a name related to the model's purpose, perhaps related to the Airtable sheet's name.
- **Data Source Type**: REST
- **Data Source**: The Airtable data source you created above
- **Id Field / Primary Key**: Id
- **Model Behavior**: Read-Only

We're not finished with this model's properties, but let's explain what else is happening here. With the model behavior set as read-only, you can enter your data source URL on this tab. Your method will have a data source URL that follows this basic format:

``<baseId>/<sheetName>``

With an actual base ID and sheet name (), it'll look something like this:

``appnibfIletterstRN/Applicants``

When combined with the API URL we set in the Skuid data source, Skuid will send requests to URLs that look like this:

``https://api.airtable.com/v0/appnibfIletterstRN/Applicants``

Notice the connection between the API documentation and how Skuid parses things? So let's set the rest of the properties here:

- **Data Source URL**: ``<baseId>/<ObjectName>``
- **Data Source HTTP Verb**: ``GET``
- **Path to Contents**:  ``records``

Airtable nests its records in a ``records`` key within its response, hence why we must set our path to contents to gain access to the fields we need.

### Add fields

**Note**: If you're having issues with Skuid retrieving metadata (for example, fields missing from the field selector), try to avoid having *empty rows* in your Airtable sheet. It seems that rows with missing columns can sometimes cause issues with metadata retrieval. 

If you've set the data source URL correctly, clicking on **Fields** will show you a list of accessible fields. Your first set is likely to look like this:

- Created Time
- Fields
- Id

You'll want to select Id, Created Time (if you prefer), and then you'll want to click into the Fields "field." You'll find your sheet's columns listed here. Select all relevant fields, and then build your page!


## Lets make this DataSource Full CRUD! 

Reading data is nice.  But when you can read and write.. Why not!!   Skuid supports all the HTTP verbs - so you can Create,  Update and Delete  (as well as just Read). 

Go back to your Read Only model and make the following change: 

- **Model Behavior**: Read/Write

This exposes a "Methods" area of the model,  and moves your Query action there. Now we'll add separate entries for the other methods for doing full CRUD.   Using the Airtable API docs we can configure each of these methods. 

### Delete
Configuring delete is easiest. 

- **Type**: "DELETE"
- **Data Source URL**: ``<baseId>/<ObjectName>/{{id}}``
- **Data Source HTTP Verb**: ``DELETE``

This Data Source URL takes the ID of one record and passes it to Airtable to delete.  You can use the "Mark row(s) for deletion" and "Save" actions to trigger this method.  

### Insert
Lets create a new record. 

- **Type**: "INSERT"
- **Data Source URL**: ``<baseId>/<ObjectName>``
- **Data Source HTTP Verb**: ``POST``
- **Send new field values**: ``As templated request body``
- **Method succeeds if...**: ``Request Succeeds``
- **Response handling**: ``Created Record will be returned``

You configure exactly how the new fields are passed to Airtable in the Custom Request template. 
Below is the template for creating a record with all the fields in the applicants table. 

```json
{"fields": {
        "Email Address": "{{fields.Email Address}}",
        "Name": "{{fields.Name}}",
        "Applying for": [
          "{{fields.Applying for}}"
        ],
        "Onsite Interview Date": "{{fields.Onsite Interview Date}}",
        "Onsite Interview Notes": "{{fields.Onsite Interview Notes}}",
        "Onsite Interview Score": "{{fields.Onsite Interview Score}}",
        "Onsite Interviewer": [
          "{{fields.Onsite Interviewer}}"
            ],
        "Phone": "{{fields.Phone}}",
        "Phone Screen Date": "{{fields.Phone Screen Date}}",
        "Phone Screen Notes": "{{fields.Phone Screen Notes}}",
        "Phone Screen Score": "{{fields.Phone Screen Score}}",
        "Phone Screen Interviewer": [
          "{{fields.Phone Screen Interviewer}}"
        ],
        "Stage": "{{fields.Stage}}"
        }
}
```
### Update
Lets update an existing record.  

- **Type**: "UPDATE"
- **Data Source URL**: ``<baseId>/<ObjectName>/{{id}}``
- **Data Source HTTP Verb**: ``PATCH``
- **Send new field values**: ``As templated request body``
- **Method succeeds if...**: ``Request Succeeds``

The same request body template used for ``Insert`` can be used for ``update``


## Sample page

The included sample page is based off of Airtable's default Applicant Tracking base. It has one model for the Applicants sheet, aka object, and it lists all of the default columns. To see it in action, do the following:

1. Create the data source as outlined above
2. Upload the XML to your Skuid site as a **v2** page.
3. **You will see an error!** This is because you need to update the base ID for the model. Replace the `<Your_Base_Id>` string within all of the model's data source URLs with **your base ID.**  (There are 6 instances where you will have to replace this string - multiselect is your friend)
4. Save and preview.  

Take full CRUD control over your Airtable data! 


## Notes

Airtable Picklist and Reference fields present interesting challenges.  Both are solved in this page. 

Picklists:   
Field metadata suggests that the Picklists are simply ``strings``.  But Skuid allows you to override these fields to be Picklists - and define the options availble.  Look for the ``Stage`` field in the Applicants model. 

Reference Fields: 
The relationship between Applicant and Position is managed with a reference.  The Airtable metadata suggest this an ``Array`` type field.  Skuid does not handle these fields very well, and so you cannot simply override their metadata.  What I had to do was create UI-only Picklist fields to represent these fields.  Look at the "ApplyingFor" field in the Applicants model. 
- The source for the picklist values is another model. 
- Model actions on the Applicants model are used to populate the UI field on model query, and to update the Airtable field whenever the UI-only field is changed.  This keeps the UI elegant and the database correct. 

## Additional resources

If you're having trouble with your data source URLs, Airtable has a codepen for generating properly encoded API calls: [https://codepen.io/airtable/full/rLKkYB](https://codepen.io/airtable/full/rLKkYB)
