# Smart Adopt
Smart adopt is a library capable of intelligently adopting records and field values between different models on the same or different data source objects/tables.

## Use Cases
Some of the primary use cases involve mass-creating junction objects and simplifying multi-select experiences.

## Features
- Updating existing records which match between 2 models
- Create new records in the destination model where there are unmatched records
- Mark records for deletion in the destination model where none exists in the source. 
- Arbitrarily specify key fields between 2 models 
- Selectively choose which data fields to include in a given operation

## Installation
Copy the contents of SmartAdopt.js into a new snippet titled "SmartAdopt", and copy the contents of SmartAdopt.xml into the actionsequences node in your page XML. The purpose of the action XML is simply to provide declarative input parameters for our snippet.

## Parameters
* **SourceModel**: The model acting as the source for your adopt action.
* **SourceModelIDField**: The field on the source model to use as the key for matching records on the destination model.
* **DestinationModel**: The model into which the source records are inserted, updated, or marked for deletion.
* **DestinationModelIDField**: The field on the destination model to use as the key for matching records from the source model.
* **Create**: Specifies whether to copy new records from the source model into the destination model where no match is found in the destination. 1 for true, 0 or blank for false.
* **Update**: Specifies whether to update an existing record in the destination model with data in the matched source model record. 1 for true, 0 or blank for false.
* **Delete**: Specifies whether to mark a record for deletion in the destination model if there was no matched record found in source. 1 for true, 0 or blank for false.
* **IDOnly**: Ignores ALL matched fields except for the ID/key fields and ONLY create or mark for deletion records in the destination model. 1 for true, 0 or blank for false.
* **Append**: Specifies whether new records should be added to tbe beginning or the end of the destination model. 1 for append to the end, 0 or blank to add new records at the beginning.
* **IncludeFields**: A comma separated list of fields to include in the update or create record actions. A blank value here copies all values from all matched field names. Note: Do not use IncludeFields and ExcludeFields together.
* **ExcludeFields**: A comma separated list of fields to exclude from the update or create record actions. A blank value here copies all values from all matched field names. Note: Do not use IncludeFields and ExcludeFields together.
