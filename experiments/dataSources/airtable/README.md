# Airtable

Note: **This is a read-only example**, but we're trying ways to make this read/write using [templated request bodies](https://docs.skuid.com/latest/en/data/rest/#request-bodies). Stay tuned to this experiment for that in the future.

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

**Warning**: Ensure that the sheet you're accessing within your Airtable base **does not have any empty rows**. Skuid will parse the metadata of your sheet based on the least populated row. Have an empty row? You won't be able to retrieve any fields. Only filled out one column in a row? You'll only be able to retrieve that one column. Make sure that your data is well-populated.

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

## Configure a Skuid model

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

**To repeat the warning from above**: Ensure that the sheet you're accessing within your Airtable base **does not have any empty rows**. Skuid will parse the metadata of your sheet based on the least populated row. Have an empty row? You won't be able to retrieve any fields. Only filled out one column in a row? You'll only be able to retrieve that one column. Make sure that your data is well-populated.

If you've set the data source URL correctly, clicking on **Fields** will show you a list of accessible fields. Your first set is likely to look like this:

- Created Time
- Fields
- Id

You'll want to select Id, Created Time (if you prefer), and then you'll want to click into the Fields "field." You'll find your sheet's columns listed here. Select all relevant fields, and then build your page!

## Sample page

The included sample page is based off of Airtable's default Applicant Tracking base. It has one model for the Applicants sheet, aka object, and it lists all of the default columns. To see it in action, do the following:

1. Create the data source as outlined above
2. Upload the XML to your Skuid site as a **v1** page.
3. **You will see an error!** This is because you need to update the base ID for the model. Replace the `<Your_Base_Id>` string within the model's data source URL with **your base ID.**
4. Save and preview.

And you're set! While this basic example doesn't do much, it does illustrate how you would configure your own Airtable model.

## Next steps

Using templated request bodies should allow us to read/write, but I'm having some issues with this right now. Will update when those are sorted, or feel free to submit a PR on this!

## Additional resources

If you're having trouble with your data source URLs, Airtable has a codepen for generating properly encoded API calls: [https://codepen.io/airtable/full/rLKkYB](https://codepen.io/airtable/full/rLKkYB)
