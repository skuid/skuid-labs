Using Mockaroo random data generator in Skuid Pages: 

Go to Mockaroo.com and create an account.  Capture your API KEY. 

Access these Schemas.  Clone the schemas (Under More link)  and create APIs for each one. 
Contacts:  https://www.mockaroo.com/9b3032d0
Measures:  https://www.mockaroo.com/da735e80
Meetings:  https://www.mockaroo.com/2e11fac0


Create a new "MockaRoo" datasource.
- Name "MockaRoo"
- URL/Endpoint: https://my.api.mockaroo.com
- Authentication:  none
- Open "URL Paramater to include in every request" section:  Add  API KEY there. Should be "Key : <<YourKey>>" 

Copy XML into a new page. 
API should be V1
