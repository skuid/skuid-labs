# Progress Bars with V2

## Description
Several different ways to achieve the effect of a progress bar with V2 pages and a DSS.

## Progress Bar: Steppers
Steppers can be a little tricky to do in V2 with no custom css, but they're still possible. The key to the stepper effect are a combination of responsive grids and wrappers.

### Responsive grids:
* There should be 1 main responsive grid with a division for each step that should show up. It may be a good idea to set grid percent restrictions so that the grids all remain in one row no matter what the screen size may be.
* For steppers with overlapping colors: A responsive grid inside each of the divisions besides the first. Inside this sub grid there should be 2 divisions: one for the arrow shape for the previous step fitted to its content, and another flexible one for any text that needs to show up in the step.
* For steppers with outlines: A third division in the sub grid on the left will be needed. It should also be fitted to the content for the arrow with the desired outlined color.  

### Wrappers:
* Step color backgrounds: Skuid lets you set background colors on the fly, but for a progress bar it's better to define them in the DSS so that style variant conditions can be used to switch out which background colors are applied when.
* Arrow wrapper: this is a wrapper with no content, two thick transparent borders defined on the top and bottom, and thick a colored border on the left. The thickness of the left border in comparison to the other two will determine how acute/long the arrow is. The thickness of the top and bottom borders may need to be adjusted to match the height of the connected step. However, if the top and bottom borders are not equal it will change the angle the arrow is pointing.
```
.wrapper-border {
  border-top: 24px solid transparent;
  border-bottom: 24px solid transparent;
  border-left: 32px solid #005cb9;
}
```
* Arrow outlined effect: This is achieved by having two arrows, one on the left that is the color of the outline, and another that is the color of the background. A negative margin is then applied to layer these arrows on top of each other so only the outline remains visible.
```
.wrapper-border-outline {
  border-top: 24px solid transparent;
  border-bottom: 24px solid transparent;
  border-left: 32px solid #fff;
  margin-left: -34px;
}
```

## Progress Bar: Percents
Percent based progress bars are much simpler than steppers because there's not much styling needed and responsive grids already are set up to operate off of percents.

Make sure that the division that the progress bar + text is set in is flexible, and that all other divisions are at fixed percents. Render conditions on the the other devisions will cause the progress bar to expand as the other divisions are removed.

## Future Improvement
For future flexibility and abstraction, this really ought to be in a custom component, but that functionality is not out yet for V2.

## Usage
Note: This example uses a UI-only model for dummy data, so it should work in any Salesforce org or Skuid site.

1. Import the `ProgressBarDSS.designsystem` design system into your Salesforce org.
2. Create a new Skuid page and paste/upload the XML file.
3. Edit away
