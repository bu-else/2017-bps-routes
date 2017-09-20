# Non-functional requirements and Use-cases for BPS-BUS

### Non-functional requirements (brainstorm):
* Logging
  * Traffic to the website
  * Performance on the client side
  * User actions (registration, login, submission)
* Storage
  * Solutions might be somewhat large (could be compressed client-side)
  * Temporary storage for submissions still under evaluation (and may only choose to keep valid solutions or the best ones)
  * Store *n* solutions
* Configuration
  * Could this be reused for other cities or for other contests
  * How many solution you would like to store?
  * Dataset for other school district -> For flexibility to adapt to other places.
* Performance
  * Evaluation on the client side
  * Transferring data (compress the data before transfer?)
  * Browser compatibility issues (No IE, No Safari)
  * Retrieving solutions
  * Visualizing the solution
* Cost
  * Storage and bandwidth
* Interoperability: does it need to work with other services or frameworks
  * Mapping API
  * Third-party storage service
  * What environment will this operate in?
  * Let user login with their Google or Github account. (OAuth) -> We will get their email for their contact. 
* Flexibility
  * Could this be reused for other application domains or scenarios
* Accessibility
  * Public website, so maybe it should follow some guidelines or conform to some standards
* Security
  * DDOS?
  * Verify that users are humans
  * Registration to upload
  * Limit submission rate
  * Should solutions be encrypted?
* Disaster recovery
  * Backup the data and user accounts

### Use Cases

#### Submission Use Case
* Description
    * An user can submit his/her solution to the Boston Public School routing challenge.
* Actors
    * Submitter/Player (Primary)
    * Administrator (Secondary)

* Flow of events
    * Basic flow
        * User navigates to the registration page.
        * Anonymous User:
            1. Check the ranking board *(go to alternative flow #4)* (The score board is always there)
        * * User registers/login (what is the visible ID, think about the vandalism).
        * User agrees to the Terms of Use.
        * User lands on the homepage/dashboard
        * Authenticated User (can happens out of order):
            1. Download the dataset
            2. See his/her past submissions
            3. Evaluate new submission and submit
            4. Check the ranking board
            5. Change contact information
        * User logs out
    * Alternative flow
        1. Download the dataset
            * User clicks on link to https://www.bostonpublicschools.org/transportationchallenge to download dataset
        2. See user's past submissions
            * User sees a list of their past submissions (has the option to sort it)
            * Click on a submission to view details
        3. Evaluate new submission and submit
            *  User clicks on new submission link
            *  User copy and pastes the code
            *  User clicks on "evaluate"
            *  User sees their result (score/rank)
            *  User sees the visualization of the result
            *  User submits (CAPCHA)
            *  User is taken to confirmation page
            *  User clicks on the return button to return to home

        4. Check the ranking board
            * User clicks on ranking link
            * User sees a list of ranking
            * User tries to filter by range of dates 
            * User clicks on a specific submission
            * User see the visualization of the clicked submission
        5. Change contact information
            * User navigates to the settings page
            * User clicks on edit
            * User is shown the current contact information
            * User changes the current contact information
            * User clicks on save
            * User is taken back to the settings page 

#### BPS Administrator Use Case
* Description
    * A BPS administrator can view ranking of solutions as well as each submitter's contact information.
* Actors
    * Administrator (primary)
* Flow of events
    * Basic Flow
        * Admin user sign-in.
        * Lands on ranking board page
        * Admin can:
            1. View ranking board
            2. Change dataset
            3. Contact User
        
    * Alternative Flow
        1. View ranking board
            * Click on specific submission on ranking board
            * View submission details 
            * View user contact information (see alternative flow #3)
        2. Change dataset
            * Admin clicks on new dataset
            * Admin uploads new dataset file (csv)
            * Admin clicks save to save new dataset
        3. Contact User
            * Admin clicks on a user's username
            * Admin is taken to their profile page
            * Admin clicks on email address
            * Admin sends email
