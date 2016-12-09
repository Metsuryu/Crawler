/*###########English###########*/

//View
let nameLabel = "Name";
let commentLabel = "Comment";
let scoreLabel = "Score";
let submitScoreBTNLabel = "Submit score";
let aboutBTNLabel = "About";
let gameGuideBTNLabel = "Game guide";
let showScoresBTNLabel = "Show highscores";
let hideScoresBTNLabel = "Hide highscores";
let dismissAll = "Dismiss all &times;"
let highscoresLabel = "Highscores";
let nameTableLabel = "Name <input id=\"searchField\" type=\"text\" name=\"searchTable\" placeholder=\"&#128269; Search\" data-ng-model=\"searchNG\">";
let yes = "Yes";

//Messages
let tooSmallCsl = "The browser window is too small. The game window is 600x600. Consider closing the console and reloading.";
let wayTooSmall = "Your browser window is too small to fit the game window (600x600).\
You could try increasing your monitor resolution, making some space in the browser by removing toolbars \
or other addons that take space, or just using a larger monitor.";
let tooSmall = "Your browser window is too small to fit the game window normally, so \
when you click play, the game window will move to the top-left corner of the screen.";
let alreadySubmitted = "Your current score was already submitted.<br>Play another game to get a better score.";
let submitInstructions = "Enter your name above,<br>a comment (optional), and then click \"Submit Score\"";
let aboutMsg = "I made this page to demonstrate how MongoDB, Express, AngularJS, and Node.js \
work together to create a \"MEAN\" web app.<br>\
At first it was just a database interface, but then I made this clone of the game \"Snake\" \
that at the end lets you send your score to the database.";
let gameGuideMsg = "\
      <span style=\"color: black;\">★</span>Use the arrow keys to move<br>\
      <span style=\"color: black;\">★</span>Eat the food (the white dots)<br>\
      <span style=\"color: black;\">★</span>When the Crawler gets long enough to cover the entire playing field, you win<br>\
      <span style=\"color: black;\">★</span>Get a higher score by eating the bonus food (the green dots)<br>\
      <span style=\"color: black;\">★</span>Click the game frame again to pause<br>\
      <span style=\"color: black;\">★</span>Press ENTER to open the settings menu";
let updateScoreMsg = "There is already a highscore with the same name, this will update the score. Continue?";
let dbFullMsg = "Since the database is full, submitting this score will remove the lowest existing highscore to make room. Continue?";
let hsUpdated = "Highscore updated.";
let errorMsg = "An error has occurred.";
let enterANameMsg = "You must enter a name.";
let pickDifferentNameMsg = "This name already achieved an equal or better score.<br>Pick another name, or get a better score.";
let successfullySubmitted = "The score was submitted.";

//TODO: Game
/*
#Clicca per giocare
#Punteggio
#Velocità
#Impostazioni
#Musica: No
#Audio: No
#Limite Velocità
#"INVIO" per continuare

#Hai Perso
#Il tuo punteggio è:
#Vuoi inviare il tuo punteggio?
	#Si
	#Gioca ancora
*/


/*###########Italiano###########*/
function toItalian(){
	//View
	nameLabel = "Nome";
	commentLabel = "Commento";
	scoreLabel = "Punteggio";
	submitScoreBTNLabel = "Invia punteggio";
	aboutBTNLabel = "Informazioni";
	gameGuideBTNLabel = "Guida gioco";
	showScoresBTNLabel = "Mostra punteggi";
	hideScoresBTNLabel = "Nascondi punteggi";
	dismissAll = "Chiudi tutti &times;"
	highscoresLabel = "Punteggi";
	nameTableLabel = "Nome <input id=\"searchField\" type=\"text\" name=\"searchTable\" placeholder=\"&#128269; Cerca\" data-ng-model=\"searchNG\">";
	yes = "Sì";

	//Messages
	tooSmallCsl = "La finestra del browser è troppo piccola. La finestra del gioco è 600x600. Prova a chiudere la console e ricaricare la pagina.";
	wayTooSmall = "La finestra del tuo browser è troppo piccola per il gioco (600x600).\
	Puoi provare ad aumentare la risoluzione del tuo monitor, fare spazio nel tuo browser rimuovendo toolbars \
	o altre estensioni che occupano spazio, oppure usa un monitor più grande.";
	tooSmall = "La finestra del browser è un po troppo piccola, quindi \
	quando clicchi gioca, la finestra di gioco si sposterà nell'angolo in alto a sinistra dello schermo.";
	alreadySubmitted = "Your current score was already submitted.<br>Play another game to get a better score.";
	submitInstructions = "Enter your name above,<br>a comment (optional), and then click \"Submit Score\"";
	aboutMsg = "Ho sviluppato questa pagina per dimostrare come\
	MongoDB, Express, AngularJS, e Node.js vengono usati per\
	creare una web app \"MEAN\".<br>\
	Inizialmente era solo un interfaccia per il database,\
	ma in seguito ho sviluppato questo clone del gioco \"Snake\"\
	che permette di mandare il punteggio al database.";
	gameGuideMsg = "\
      <span style=\"color: black;\">★</span>Usa i tasti freccia per muoverti<br>\
      <span style=\"color: black;\">★</span>Mangia il cibo(i quadrati bianchi)<br>\
      <span style=\"color: black;\">★</span>Quando il Crawler diventa abbastanza lungo da coprire l'intero schermo, vinci il gioco<br>\
      <span style=\"color: black;\">★</span>Ottieni un punteggio più alto mangiando il cibo bonus (i quadrati verdi)<br>\
      <span style=\"color: black;\">★</span>Clicca nuovamente la schermata per mettere il gioco in pausa<br>\
      <span style=\"color: black;\">★</span>Premi INVIO per aprire il menù delle impostazioni";
	updateScoreMsg = "C'è già un punteggio con lo stesso nome, vuoi aggiornare il punteggio?";
	dbFullMsg = "Dato che il database è pieno, inviare questo punteggio rimuoverà il punteggio più basso per fare spazio a questo. Continuare?";
	hsUpdated = "Punteggio aggiornato.";
	errorMsg = "Errore.";
	enterANameMsg = "Devi inserire un nome.";
	pickDifferentNameMsg = "Questo nome ha già ottenuto un punteggio uguale o superiore.<br>Scegli un altro nome, o ottieni un punteggio migliore.";
	successfullySubmitted = "Punteggio inviato.";

//Game
/*
#Clicca per giocare
#Punteggio
#Velocità
#Impostazioni
#Musica: No
#Audio: No
#Limite Velocità
#"INVIO" per continuare

#Hai Perso
#Il tuo punteggio è:
#Vuoi inviare il tuo punteggio?
	#Si
	#Gioca ancora
*/


};

function toEnglish(){
	//TODO: change variables back to english, without the "let"
}

function applyTranslation(){
	//TODO: Apply to the view the changes made to the variables after calling the toItalian or toEnglish function.
};