# Smart Adopt
Smart adopt is a library capable of intelligently adopting records and fields between different models. There are many different use cases for implementing this library, from mass-creating junction records to simplifying a 'multi-select' experience. It's capable of a number of things including updating existing records which match between 2 models, create new records in the destination model where there are unmatched records, or mark records for deletion in the destination model where none exists in the source. It can also specify key fields arbitrarily between the 2 models and selectively choose which data fields are or are not included in a given upsert operation.

## Installation
Simply copy the contents of SmartAdopt.js into a new snippet titled "SmartAdopt", and copy the contents of SmartAdopt.xml into the actionsequences node in your page XML. The purpose of the action XML is simply to provide declarative input parameters for our snippet.

## Parameters
* **SourceModel**: The model acting as the source for your adopt action.
* **SourceModelIDField**: The field on the source model to use as the key for matching records on the destination model.
* **DestinationModel**: The model into which the source records will be inserted, updated, or marked for deletion.
* **DestinationModelIDField**: The field on the destination model to use as the key for matching records from the source model.
* **Create**: Specifies whether to copy new records from the source model into the destination model where no match is found in the destination. 1 for true, 0 or blank for false.
* **Update**: Specifies whether to update an existing record in the destination model with data in the matched source model record. 1 for true, 0 or blank for false.
* **Delete**: Specifies whether to mark a record for deletion in the destination model if there was no matched record found in source. 1 for true, 0 or blank for false.
* **IDOnly**: Will ignore ALL matched fields except for the ID/key fields and ONLY create or mark for deletion records in the destination model. 1 for true, 0 or blank for false.
* **Iterations**: Handy for creating multiple new records in the destination model. Only works with Create. A blank value here is equivalent to a value of '1'.
* **Append**: Specifies whether new records should be added to tbe beginning or the end of the destination model. 1 for append to the end, 0 or blank to add new records at the beginning.
* **IncludeFields**: A comma separated list of fields to include in the update or create record actions. A blank value here will copy all values from all matched field names. Note: Do not use IncludeFields and ExcludeFields together.
* **ExcludeFields**: A comma separated list of fields to exclude from the update or create record actions. A blank value here will copy all values from all matched field names. Note: Do not use IncludeFields and ExcludeFields together.