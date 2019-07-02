**Mockaroo Data**

Using Mockaroo random data generator in Skuid Pages: 

Go to www.Mockaroo.com and create an account.  Capture your API KEY. 
A free account seems to be reasonably performant. 

Access these Schemas. 
- Contacts:  https://www.mockaroo.com/9b3032d0
- Measures:  https://www.mockaroo.com/da735e80
- Meetings:  https://www.mockaroo.com/2e11fac0

Clone the schemas (Under More link)  
Create APIs for each one. 


Create a new "MockaRoo" datasource.
- Name "MockaRoo"
- URL/Endpoint: https://my.api.mockaroo.com
- Authentication:  none
- Open "URL Paramater to include in every request" section:  Add  API KEY there. Should be "Key : <<YourKey>>" 

Create new page with XML from "Mockaroo" xml file in this folder. 
API should be V1
