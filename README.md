# bw-sleep-tracker-pt-BE

## ENDPOINTS

### Auth

* /api/register "POST"
	1. Registers a new user to the database
  2. Takes an object with properties "username", "password"
	  * {username: "lorem", password: "lorem"}
	  * both are required
* /api/login "POST"
  1. Login existing user. Returns the web token. 
	2. Takes an object with properties "username", "password"
	  * {username: "lorem", password: "lorem"}
		* both are reqired
	3. Successful login returns web token
	4. Unsuccessful returns an object with the error in question 

### Users

* /api/users "GET"
  1. Returns a list of all users
	2. JWT must be in the header under "authorize"
	3. Only accessible as admin
* /api/user/:id "GET" 
	1. Returns user that matches the params: id
	  * All the sleep data for that user is included an array of objects
			* {
					sleepData: [{}, {}]
			* }
	2. JWT must be in the header under "authorize"
	3. accessible by the user and admin
* /api/user/:id "PUT"
  1. Modifies user that matches the params: id
	2. Takes an object with the updated user values {id: , username: , password: }
	3. JWT must be in the header under "authorize"
	4. accessible by the user and admin
	5. On success returns the edited record
* /api/user/:id "DELETE"
  1. Deletes user that matches the params: id
	2. JWT must be in the header under "authorize"
	3. accessible by the user and admin
	4. On success returns the number of records deleted

###Sleep Data

* /api/sleepData "POST"
  1. Posts new sleep data to the DB
	2. Takes an object {userID: , start: ,end: ,hours: , scale}
	  * userID is required. Must match the user. 
		* start = start time
		* end = end time
		* hours = diffence of END and START
		* scale = emoji value, currently set for 1 - 4
	3. JWT must be in the header under "authorize"
	4. accessible by the user and admin
	5. On success returns the added record
* /api/sleepData/:id "PUT"
  1. Edits the recored matching the params: id
	2. Takes a sleep data object {userID: , start: ,end: , hours: , scale}
	3. JWT must be in the header under "authorize"
	4. accessible by the user and admin
	5. On success returns the edited record
* /api/sleepData/:id "DELETE"
  1. Deletes record that matches the params: id
	2. JWT must be in the header under "authorize"
	3. accessible by the user and admin
	4. On Success Returns the number of records deleted

