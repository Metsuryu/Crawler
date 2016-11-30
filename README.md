# Crawler
A snake clone and MEAN stack demonstration

You can play the game at http://crawler.cloudno.de/


Crawler TODOs:
- Change music to my own when it's ready.
- Replace title with logo when it's ready.
- Translate to Italian
- Clean up code.

Rest of the site TODOs:

- If the window is under a certain size (that would make the game not fit within), show error message instead of game window.
- When a score is added, and the database is full, the lowest or if equal oldest score is removed to make room.
	If the name is the same and the score is higher, update the score and comment. If the score is lower, require other name.
- Add a search function for the highscores
- Add special commands in search function (sorting, filters, advanced search...)
- Add autocomplete to search with regex. When writing, change in real time the name of a variable 
	(maybe with Angular databinding),then search the json with the db entries for a match, 
	and show 4 or 5 of the matching results under the text-box
	the user can select/click the suggestion to autocomplete, and it will search automatically.
- Make a mobile view (detect if user is on mobile, and give them that view instead of standard one.)
- Make the page work well for different screen sizes and when resizing
- Order and clean up everything