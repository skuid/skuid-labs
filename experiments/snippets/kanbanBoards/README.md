# Kanban Boards. 

a very popular type of interface for managing lots of objects through a series of phases is the Kanban board.  Perhaps made most popular by Trello. The column arrangement seems very intuitive.  And everyone loves to drag and drop - moving items through the process! 

While Skuid does not offer a Kanban board out of the box - with a little customization and javascript - one can be developed. 

Here are two Skuid Kanban boards:  

1.  Drag and drop opportunity planning wall. 

Here we see opportunities. They are broken down into columns for each stage.  A snippet enables drag and drop interactions, so an opportunity can be dragged from one column into another - which updates the stage name value.

This example uses the following stage names.  
- Prospecting
- Negotiation/Review
- Proposal/Price Quote
- Closed Won
- Closed Lost

If you have defined different stage names in your org,  you will need to update the conditions on the opportunity models. 

2. Task management Kanban.  

Tasks are another type of record that benefit from the Kanban view.  

## Notes

This functionality will only work in V1 Page API pages. The JQuery techniques leveraged in these snippets are not available in the V2 Page API. 
