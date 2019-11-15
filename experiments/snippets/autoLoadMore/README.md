# autoLoadMore.js
This inline JavaScript (NOT snippet) used to load more rows into a model when the "Load More" button is scrolled into the window.  This creates a scroll-and-load experience like Salesforce.  There must be enough rows in the model to allow for a scroll though - I'm sure other trigger events could be provided, but this is based on "too many to load at once" in a performance friendly experience, and then load more when scrolling long enough.  We tend to use this with the "Max # of records (Limit)" field set between 50-100, but it will depend on what is being queried and when you see a performance degradation from overloading.  It will require modification of the model and field names to match yours.


# autoLoadMore.xml
This is a sample page wich uses this inline javascript to load more records.  In a standard developer org, there are likely not enough sample accounts to really leverage this, so the "Max # of records (Limit)" is set very low.  You'll need to zoom the page so you have to scroll to see the last row.  
