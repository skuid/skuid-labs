# Contributing

## Why contribute?

We created Skuid Labs to provide a central place for Skuid builders to share extensions, components, and other projects that they've created which could benefit other builders. In Skuid Labs like to call these **experiments** to go along with the laboratory theme. If you've got an Skuid project you've created that you want to share with the world, but weren't sure where to go, this is the place.

Your contributions also help shape the future of the Skuid product. When we see the kinds of components, formulas, and other extensions that Skuid builders are creating, that helps give us ideas about where to focus our efforts.

## How do I contribute?

If you've got an experiment you'd like to submit, fork this repository and submit a pull request (PR)! 

If you're unfamiliar with how to do this, read [GitHub's Forking Projects guide](https://guides.github.com/activities/forking/).

We do ask that your submission follow our general code and structure guidelines:

- Ensure that your file names are **[camelCase](https://en.wikipedia.org/wiki/Camel_case)**.
- Create a folder for your experiment in the proper directory.
- Describe your experiment in a `README` file, written in Markdown, at the root of your experiment's directory.
  - In addition to a `README`, add as many code comments as you see fit to properly explain your experiment.
  - If applicable, note the [API version](https://docs.skuid.com/latest/en/skuid/api-version/) the [managed package release version](https://skuid.com/releases/) in which your experiment is intended to be used.
- Consider including a sample page to demonstrate your experiment. 
  - The `XML` and `JSON` files for these pages should reside in the root directory of your experiment.
  - Unless necessary for the concept of the experiment, **avoid using data sources within sample pages**. Instead, use [UI-only models](https://docs.skuid.com/latest/en/skuid/models/ui-only-models-fields.html) with dummy data. Feel free to base your sample pages off of our own [sample page.](https://github.com/skuid/skuid-labs/tree/master/experiments/pages/samplePage)
- We highly encourage screenshots, especially for to illustrate how experiments should look when finished. Include these in a `screenshots` directory, nested within your experiments directory.
  - For an example, see the [E-Signature Component experiment](https://github.com/skuid/skuid-labs/tree/master/experiments/customComponents/v1/esignature).
- We use [ESLint](https://eslint.org/) to ensure that your code matches our styles. If your code editor has an ESLint plugin installed, your code should automatically be linted, but you can alternatively just run `npm run lint` locally.

  The easiest way to do this is to install [Node.js](https://nodejs.org/en/download/). We recommend using `nvm` to install the version of Node associated with this repository (`brew install nvm`) and run the following commands:

  ```bash 
  cd /path/to/skuid-labs
  # Install the associated version of Node
  nvm install
  nvm use
  # Install dev dependencies (ESLint, etc.)
  npm ci
  ```

  - If you’ll be using variables that are not defined in the file, you may [set your globals in a comment at the top of your file](https://eslint.org/docs/user-guide/configuring#specifying-globals), but only use this when appropriate.
  - If you have a 3rd-party library that you are using in a component pack, we prefer that you reference that library via an external reference in your component pack manifest files, rather than including the library's minified JS locally in your component pack, unless the library is fairly small.
  - We recommend using ES5 for maximum compatibility among browsers.

## Who owns the code I contribute?

All content in Skuid Labs is [MIT licensed](LICENSE). Anything that you contribute to Skuid Labs may be freely used and modified by anyone else. **Modified versions of the code you contribute may be incorporated into the Skuid product in the future without your consent and without attribution.**