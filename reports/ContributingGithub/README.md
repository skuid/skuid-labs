# Contributing to Github only using Github
This document is a step by step tutorial to contribution to Skuid Labs (or other status site generator) using just Github. 

One of the challenges many find to contributing to Github is the infrastructure typically required to do local development and then push changes to the remote repository.  The local copy is a convenience,  and is required if you need to ensure some piece of code works before committing it to the repository.  But in the case of content,  it is not required.  One may work entirely in the remote repository making changes and the daunting infrastructure of a code editor,  terminal commands,  git clients etc can be avoided.  This document shows how one does this work. 

## Instructions

**Step 1.  Go to the SkuidLabs Repo.** 

Remember:  https://github.com/skuid/skuid-labs

**Step 2.  Create a new branch.**
- Open the branch selector button and type name of a new branch (or select the branch you were already working on). 
- Don't try to edit documents in Master.  

<img src="NewBranch.png" width="500"></img>

**Step 3. Navigate to the directory where you want to create your new document.**

<img src="NavigateToFolder.png" width="500"></img>

**Step 4. Click Create New File button.**

**Step 5. Start typing name of new directory and Readme file.**
- When you type a "/" Github will interpret this as a new directory and expose a new text box.
  - Backspace to get back and edit the directory name
- The first file you create should be  `README.md` 

<img src="CreateNewFile.png" width="500"></img>

**Step 6. Write your document using Markdown syntax.**
- [Here is a helpful document](https://help.github.com/en/github/writing-on-github/basic-writing-and-formatting-syntax) for styling your document using Markdown
- Preview your changes as you work. 

<img src="PreviewChanges.png" width="500"></img>

**Step 7. Commit your changes early and often.**
- Navigate to the bottom of your document 
- Write a commit message
- Select the "commit directoy to the <<branch name>> branch
  
<img src="CommitFile.png" width="500"></img>

**Step 8.  After committing - you will have to click edit to keep working.**
- Look for the edit pencil in the title bar for your file. 

### Adding Images and other Files
Commit your Readme file and navigate to the directory your created.   You want to make sure images and other files related to your experiment are in the same Directory as your ReadMe file. 

**Step 9. Click the `Add Files` button and drag files into the big box**

<img src="UploadFiles.png" width="500"></img>

- After uploading you need to commit these files to your repo.  
- Make sure your commit message is suitably snarky. 

**Step 10.  Edit your Readme file to include relative links to the images you just uploaded.**  
- Like this:  `<img src="CommitFile.png" width="500"></img>`

- Upload page xml in the same way 
  - Or create a new file as shown above, with an `.xml` file extension.  
  - Then copy your page xml into that new file. 

- Upload design system zip files in the same way. 

**Step 11.  Rinse and Repeat until you have it just perfect.**

### Open Pull Request for others review before merging. 
Github provides really good tools for collaborative review and editing.  We use the "Pull Request" mechanism to get this started.


