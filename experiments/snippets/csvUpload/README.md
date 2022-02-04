# CSV Upload - using PapaParse library

Adding data to your application is often best facilitated with some "data import" function.  Skuid does not include a solution for this problem "out of the box", but the functionality can be developed by extending Skuid with the [PapaParse javascript library](https://www.papaparse.com/).  

The page below allows the following: 
- Using Skuid File Upload component - select a CSV file and brings it into client side memory  (As as field on a UI Only model)
- Use a snippet (that extends PapaParse) to move field data into new rows of a second model. 

    In the example page - the target model is a UI Only model, but it could be connected to any data source. And once the model rows have been created from the parsed CSV data - you could use normal Skuid actions to save them to your data source (depending on the volume limits for CRUD operations within the data source).

## Additional notes: 

1. You will need to [download the PapaParse library](https://www.papaparse.com/) and host it as a static resource (salesforce) or file (skuid platform). Then refer to that file as an external resource in the Javascript resources of your page.

2. The sample uses a dataset retrieved from [Mockaroo](https://mockaroo.com/0c45cb80). A great sample data generation tool.

## Instructions
- V2 Page API Used
- Data source: Only Uses UI-Only Models   
- Design system:  Uses default INK design system  
- Page XML:  [Copy the XML from this page](CSV_Parser.xml), or save it as an XML file, and upload it as a new page in your Salesforce Org.
- Javascript Resource:  Download [PapaParse](https://www.papaparse.com/) library and add it to your org as a Static Resource (if on Salesforce) or a FILE (if on Skuid Platform)  