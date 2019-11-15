# autoLoadMore.js
This inline JavaScript (NOT snippet) used to load more rows into a model when the "Load More" button is scrolled into the window.  This creates a scroll-and-load experience like Salesforce.  There must be enough rows in the model to allow for a scroll though - I'm sure other trigger events could be provided, but this is based on "too many to load at once" in a performance friendly experience, and then load more when scrolling long enough.  We tend to use this with the "Max # of records (Limit)" field set between 50-100, but it will depend on what is being queried and when you see a performance degradation from overloading.  It will require modification of the model and field names to match yours.


# autoLoadMore.xml
This is a sample page which uses this inline JavaScript to load more records. In a standard developer org, there are likely not enough sample accounts to really leverage this, so the "Max # of records (Limit)" is set very low.  You'll need to zoom the page or decrease the size of your browser window so you have to scroll to see the last row.  

The rich text component is simply a demonstration of related functionality you can use based on the status.  At some clients, we've used a loading image instead.  Text was simplier for this demonstration, but it is not required (but suggested some form of feedback is provided to allow the user know more records are loading).
