# Database design explanation
Since we are running everything within the Firebase platform, we have decided to use Cloud Firestore.
We had the option of Realtime Database, however, for organizational purposes as well as caching advantages, we have decided on Cloud Firestore.

Note that Cloud Firestore is a NoSQL database, where everything is stored in collections and documents with no set schema.

## "Schema"
Despite no set schema, we have set a general idea of our storage, to keep things uniform.
However, due to the heavily user-oriented data, we still believe NoSQL fits better here.

There will be two main collections:
### Courses
Courses till store the data for the courses we import from our web scraping.
Each document will primarily store 2 pieces of data: The full course name and the course code.
This master list of courses is something everyone can read from (but not edit) for their own tags.


### Users
The Users collection will store the majority of our data.
Under a user document, we will store their name, uid, and email address.
Each user document will have 4 sub-collections:

These essentially function as tags, but reference the global course list.
#### tags
This subcollection will store the custom tags that a user creates.
It allows them to set a full and shortname (like the course name and code), and a color. We will also store the date the user created the tag.
#### freetime
This subcollection stores the times a user marks themselves available to schedule their tasks.
Rather than storing these all as an array, we decided to do each week as a document. 
This allows us to query weeks at a time, and allow the user to add time in advance.
Each document stores the start of the week as the ID (for querying purposes) and a map of timestamps (for the beginning of the freetime and the end of the freetime).
#### tasks
Finally, we have our tasks subcollection.
This is where the majority of data will be stored.
Here we will store the following items relating to the task

 - name
 - estimated time to complete the task (in minutes)
 - due date (stored as a timestamp)
 - task description
 - whether or not it has been completed
 - a priority (stored as an integer)
 - The scheduled start time(stored as a timestamp) - when the user schedules
 - The schedules end time(stored as a timestamp) - when the user schedules
 - An string for the associated tag (stores a reference to tags documents)