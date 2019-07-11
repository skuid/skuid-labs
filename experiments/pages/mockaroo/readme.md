**Mockaroo Data**

Using Mockaroo random data generator in Skuid Pages: 

1. Go to www.mockaroo.com and create an account. A free account seems to be reasonably performant. 
1. Capture your API key, listed in your My Account page.
1. Access these schemas:

   - **Contacts**: https://www.mockaroo.com/9b3032d0
   - **Measures**: https://www.mockaroo.com/da735e80
   - **Meetings**: https://www.mockaroo.com/2e11fac0
   
1. Clone each schema by clicking **More > Clone this Schema** and then **Save this Schema**.
1. Create APIs for each one by clicking **Create API...**

Now, within Skuid create a new **Mockaroo** data source with the following properties:

- **Name**: Mockaroo
- **URL/Endpoint**: https://my.api.mockaroo.com
- **Authentication**:  none

Finally, open **URL Paramater to include in every request** section and add your API key there: 
``key : <<YourMockarooKey>>``

Create new page—API version set to v1—with XML from **Mockaroo** XML file in this folder.