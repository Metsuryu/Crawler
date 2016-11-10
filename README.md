# Crawler
A snake clone and MEAN stack demonstration

You can play the game at http://crawler.cloudno.de/


**Crawler TODOs:**  
- Change music to my own when it's ready.  
- Replace title with logo when it's ready.  
- Translate to Italian.  
- Clean up code.  

Possible things to implement in the future:  
- Make the Crawler more responsive at lower speeds by queueing up movement commands or some other way.  
- Make the music play non-blocking/async so it doesn't freeze until it starts playing when enabling the music.  
- Difficulty options (change the scale).  
	Must also scale the interface appropriately if I do this.  
	Possible scales are 25,30,50,75. Current scale is 20 x must be integer in (canvas/2)/scl = x  

**Rest of the site TODOs:**  
- Make the page work well for different screen sizes and when resizing  
- Limit the number of characters per field to x (100 or 200?)  
- Do more stuff with Angular  
- When a score is added and the database is full, the lowest and oldest score is removed to make room.  
	If the name is the same and the score is higher, update the score and comment. If the score is lower, require other name.  
- Add a search function for the highscores  
- Add special commands in search function (sorting, filters, advanced search...)  
- Limit number of results per page to 15(?) with Angular   
	(pass json of results from db to page, have the first x elements to show   
	on the first page, the next x+x on the second page and so on)  
	Use mongo's limit() and skip() functions to limit results and start from nth result,  
	Can chain the functions to get a sorted, limited list: db.bios.find().sort( { name: 1 } ).limit( 5 )  
- Make columns sortable with Angular filters (orderBy...) [Changing parameters dynamically](https://docs.angularjs.org/api/ng/filter/orderBy)
- Add autocomplete to search with regex. When writing, change in real time the name of a variable   
	(maybe with Angular databinding),then search the json with the db entries for a match,   
	and show 4 or 5 of the matching results under the text-box  
	the user can select/click the suggestion to autocomplete, and it will search automatically.  
- Make a mobile view (detect if user is on mobile, if so give them that view instead of standard one.)  
- Order and clean up everything  
