# Launch Dynamic Lightning Modal from Skuid

Have you ever wanted to call a Lightning Screen Flow or some other cool custom component in a Skuid Page?

Below we will cover what it looks like to build a dynamic Lightning modal (that accepts parameters) that can be launched from Skuid. This modal can contain pretty much any Lightning component, that fits in a Lightning modal, although its most commonly been used to contain Lightning Screen Flows.

The fundamental approach is this:

 1. Create a custom Lightning component that contains the event listeners, modal, etc.
 1. Create a Skuid page,as instructed in this report, that contains the necessary models, action sequences, and javascript to communicate with the lightning component.
 1. Add both the custom Lightning component and the Skuid page to a Lightning Page in the Lightning App Builder.


## How to use this

### Create Skuid Page

1. Download the [XML](lightningModalLauncherPage.xml) for this page.
1. From the Skuid Pages list, click **Create new page**, select **Upload XML**, and then select the file you downloaded.
1. In the actions on the button labeled "Launch Lightning Modal", select the action labeled "Run: CallFlow" to see a list of options/inputs. 
1. Update the input titled "flowName" with the name of the Flow you would like to inlcude in the modal.
- NOTE: This page is sending the running user's firstName and lastName , the flow should have input variables created in order to accept these.
1. Save.

### Create Lightning Component
1. In Salesforce Setup, navigate to developer console
1. In the toolbar select File > New > Lightning Component and name it "showScreenFlowModal" and click "Submit"
1. Copy/Paste the component [cmp] (lightningModalLauncher.cmp) and controller [Apex] (lightningModalLauncherController.Apex) code from the provided files and save.

### Build Lightning Page
1. In the Lightning App Builder, add both the newly created Skuid Page and the newly created custom component.
1. Save.
1. View the Lightning page and press the "Launch Lightning Modal" to see the Flow inside a Lightning modal.
