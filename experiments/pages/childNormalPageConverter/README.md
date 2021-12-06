# Child/Normal Page Converter

## Description

Isn't it a huge pain to create a page and then realize you actually meant to have it nested in a master page? You can save it with XML surgery, but that's annoying and error-prone. And what if you have a page that no longer needs to be nested within a master page? Easier XML surgery, but still XML surgery.

Fret no more!

This experiment aims to automate that hackery. It's a list of pages with two contextual row actions:

- Convert to normal page
- Convert to child page

The actions are pretty self explanatory. And I tried to uplevel most of the actions to action sequences with descriptions. The actual XML conversion is handled by two snippets. Those snippets are commented throughout to illustrate what they're doing. 

The Salesforce version of this page has a few additional scripts to handle the way we have to save pages on Salesforce due to field length limitations.

To install, either copy and paste the XML for your platform of choice into your Skuid site, or use the XML + JSON file with the `skuid CLI`. 

## Caveats

- When converting from a _child page_ to a _normal page_, all components are placed into the page based on the order they appear. If you use page regions as grids, you'll need to recreate those.
- When converting from a  _normal page_ to a _child page_, all components are placed into the **the first page region available**.
- If you reference a master page's resources in a child page and convert that child page to a normal page, it'll mess up.

## Future improvement ideas

- Allow some form of import for reference master pages
- _Child page_ to a _normal page_: Instead of dumping all components vertically into the XML, convert the each `pageregion` component into a Responsive Grid in order to maintain some visual similarity to the original page.
- _Normal page_ to a _child page_: Allow users to select which page region they would like to place their components in. 

## Sources

Here are some sources I used while drafting this:

- Based off some learnings from here: https://stackoverflow.com/questions/14340894/create-xml-in-javascript/34047092#34047092
- HTMLcolleciton to array: https://stackoverflow.com/questions/222841/most-efficient-way-to-convert-an-htmlcollection-to-an-array
- Stringify the XML: https://developer.mozilla.org/en-US/docs/Web/Guide/Parsing_and_serializing_XML

