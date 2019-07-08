# Sample Page

We often need data to illustrate Skuid concepts, it's difficult to create a sample page that works for everyone or that doesn't require a lot of setup work. Instead of asking users to connect to data source X, Y, Z just to try something totally unrelated to the data source itself, this sample page generates a basic list of records using a few action sequences:

1. Create Dummy Data Row: A reusable action sequence for generating a row of dummy data. This reduces the complexity for our en masse dummy data creation.
1. Create Dummy Data: A reusable action sequence that uses **Create Dummy Data Row**  to quickly generate data.
1. Create Data at Page Load: An event-triggered sequence that runs at page load, filling in model data based off the the sample rows provided in the **Create Dummy Data** action sequence.


## Usage

This is primarily intended for users to build their own experiments off of, so there no usage steps to speak of.

Instead, just copy the XML within this directory into a Skuid page and build from there!