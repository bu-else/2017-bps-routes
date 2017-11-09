Task planning
===

# Milestones
- There will be four milestones:
  - Oct. 19, 2017
      - ~~Setup Oauth (Firebase)~~
      - Bootstrap views:
          - ~~Ranking board (home page)~~
          - ~~Profile page~~
          - Submission workflow
          - Viewing result
      - Figure out how to parse Excel and display data (list of potential tools)
  - Nov. 2, 2017
      - ~~Setup MOC~~
      - ~~Integrate submission workflow and parsing Excel spreadsheet.~~
      - Connect front-end and back-end (identify required end-points)
          - Retriving user's submission
          - Checking if an user is an administrator
          - Upload file to MOC/filestore
          - End-points (in express)
              - / 
              - /submit
                  - Do not allow user with username "submit"
              - /users/{username}
              - /users/{username}/submissions/{id} 
      - Create some dummy user
      
  - Nov. 16, 2017
      - Complete algorithm for evaluating solution
      - Display solution on map
      - Administrator View
          - If you are an administrator, you also get to see the contact information of an user when you are looking at their profile page.
          - Put in a conditional in the rendering to check if an user is an administrator 
  - Dec. 7, 2017 (Last milestones is a bit more than three weeks due to the Thanksgiving break)
      - Display solution statistics
      - Run simulation
      - Upload solution file to datastore in Firebase


# Works to complete
- Front-end
  - Basic Bootstrap layout
  - Viewing of submission
- Front-end (result)
    - Client-side checkingh
    - Displaying result (school bus simulation)
        - Mapping API
- Backend (Firebase):
    - OAuth
    - Storing data (submission)
    - User profile
- Administrator view (?)
    - Can see submitter's contact information


- Make submission page match wireframe
- Make spinning thing with spin.js
- Leaflet js

# Other note
**Example schema for storing Bus Route**
```javascript
busRoutes = {
    B286: {
        long : [],
        lat  : [],
    },
    B287: {
        long : [],
        lat  : [],
    }
}
```
