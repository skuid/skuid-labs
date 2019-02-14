# Condition Clone

The purpose of 'Condition Clone' is to synchronize condition states and values across multiple conditions and models. Conditions that need to synchronize will be named with a `CC_`, `CA_`, or `CV_` prefix, to clone the whole condition, condition 'active' property, or condition 'value' respectively.

## Inline.js

This script runs on page load and builds an index of all conditions present on all models tagged with the above prefixes.

## RunCC InlineShippet.js

This snippet should be called from a "change condition" action for every model that may initiate a condition change that needs to be propagated.

## Example

Let's say we have 2 models on the page, both pointing at the Opportunity object. One model is a list of opportunities, and the other is an aggregation of opportunities. Each model will have an Account ID condition, and each condition will be named `CC_AccountID`.

We then create an action on each model that fires on any condition change. Both of these actions need only call the `RunCC` snippet. Now, whenever anything changes the value or activates/deactivates the `CC_AccountID` condition on either model, the counterpart condition on the other model will be immediately updated to the new state and value.