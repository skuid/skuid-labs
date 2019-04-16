# Skuid Labs

Skuid Labs is an open source repository where Skuid employees, community champions, and curious developers can toy with and contribute exciting, cutting-edge, and potentially-on-fire experiments. We want to see what makes working with Skuid better and faster for you.

Currently everything is nested under the `experiments` directory, where you’ll find the following:

- **Custom components**: New drag-and-drop components designed for bespoke needs that Skuid’s out-of-the-box components may not meet.
- **Custom field renderers**: These are used within some components to render fields in unique ways.
- **Formulas**: Custom formulas for use within UI-only fields.
- **Snippets**: General Javascript code fragments for use as payload handling snippets, Action Framework additions, etc.
- And more to come!

We want this to be a repository for unique pieces of content that push the limits of Skuid. Because of that adventurous goal, a banner saying **_Beware ye who enter_** hangs above the door. 

_There are no warranties, no support, and no guard rails for any of the projects within this repo. **Use at your own risk**_.

You’ve officially entered expert mode. Go forth and create!

## Contributing

We encourage contributions! Feel free to clone the repo and submit a PR. We just ask that you do the following:

- Ensure that your file names are **[camelCase](https://en.wikipedia.org/wiki/Camel_case)**.
- Create a folder for your experiment in the proper directory.
- Leave enough code comments to explain your experiment (or leave a description in a README file written in Markdown).

   - If applicable, note the [API version](https://docs.skuid.com/latest/en/skuid/api-version/) the [managed package release version](https://skuid.com/releases/) in which your experiment is intended to be used.
- Use [ESLint](https://eslint.org/) to ensure that your code matches our styles.

  The easiest way to do this is to install [Node.js](https://nodejs.org/en/download/) and run the following commands:

  ```bash 
  cd /path/to/skuid-labs 
  npm install 
  ```

  This will install ESLint and its dependencies into a local `node_modules` directory. You can then run the linter by using `npm run lint`.

  - If you’ll be using variables that are not defined in the file, you may [set your globals in a comment at the top of your file](https://eslint.org/docs/user-guide/configuring#specifying-globals), but only use this when appropriate.
  - We recommend ES5 for maximum compatibility among browsers.

We’ll have a more in-depth contributing guide, as well as a style guide, in the future.