# Sample Data Page

We often need data to illustrate Skuid concepts, so it can be difficult to create a sample page that works for everyone and doesn't require a lot of setup. Instead of asking users to connect to data source X, Y, Z just to try something totally unrelated to the data source itself, this sample page generates a basic list of records using a few action sequences:

1. **Dummy Data Row Template**: A reusable action sequence for generating a row of dummy data. This reduces the complexity for our en masse dummy data creation by allowing us to configure all of a row's data from _one place_.
1. **Create Dummy Data**: A reusable action sequence that uses **Create Dummy Data Row**  to quickly generate data.
1. **Create Data at Page Load**: An event-triggered sequence that runs at page load, filling in model data based off the the sample rows provided in the **Create Dummy Data** action sequence.

This sample data was generated from Wikipedia's [List of largest companies by revenue](https://en.wikipedia.org/wiki/List_of_largest_companies_by_revenue) article.

## Usage

This is primarily intended for users to build their own experiments off of, so there no usage steps to speak of. Just create a new Skuid page from this XML and build from there.

However, if you have another basic data set that you'd like to add, feel free! Just make sure adding the data would not violate any licenses or copyright laws.

## Potential ideas

It would be cool if this page could parse and creates models based off of CSV resources. Two potential strategies for this:

- We could include a `files` folder alongside this sample page that could be deployed using `skuid CLI`, perhaps then have a snippet look at and parse those files.
- Have a Makefile that parses any CSV files within a sub-folder, and then creates an appropriate model and updates the **Create Dummy Data** action.