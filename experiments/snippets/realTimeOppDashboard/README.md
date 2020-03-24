# Real Time Opportunity Dashboard

Skuid pages generally only query the database on user request.  The user reloads the page or takes some action on the page to trigger a query.  But customers often ask whether Skuid can create a page where new data is constantly retrieved for the page—also known as "polling."  

This page extends Skuid with a simple snippet that polls a "updates indicator" model periodically.  If this model returns data - the user can be warned that there are updates and can update the page. 

It is not wise to simply continuously poll the primary model, as that would freeze the components bound to that model whenever the queries are occuring,  and that cause problems if there were unsaved chagnes. 
