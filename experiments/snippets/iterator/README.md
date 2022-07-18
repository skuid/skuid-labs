# Model Iterator

This snippet/sequence combo takes a model and an action sequence name as arguments. It will iterate the rows in the
model (or the rows in context, if "UseContext" is 1/true) and execute the given action sequence, using each row as
context for that execution.

From the target action sequence you may access the fields in context in the usual way, such as `{{fieldName}}`. Because
context is easily lost when rows are created/updated/adopted/etc., each row is also passed into the `{{$Input}}`,
allowing access via `{{$Input.fieldName}}`. This also adds an input called `{{$Input.$Iteration}}` that gives you the
iteration number (starting at 1).

You can use this to conditionally update all rows based on their own context, conditionally create new rows in other
models, conditionally trigger actions on rows (in conjunction with model actions), and even save the world.

It should be noted that this has the potential to be VERY expensive, performance wise, should the action sequence you
are calling affect visible components or data being represented by visible components. If you are working with larger
sets of data, it may be helpful to set up rendering conditions where you can 'hide' any components that are related to
the data you're modifying/adding while the iterator is working, in order to prevent render event spam and other possible
slowdowns.

## iterator.js

Paste this into a snippet called 'iterator'. If you would like to call it something else, the action sequence XML will
need to be adjusted appropriately.

## iterator.xml

Paste this into the `<actionsequences>` section of the page XML.