# JLPT Flashcard

Beta stage:
added a full wordlist
lacking of settings
working on UI

This is a really small project with the aim to create a simple web interface for a basic flashcard system about jplt words from N5 to N1.
The idea is to have few functionality, an organized dataset and fast interaction, ideal as a shortcut on mobile phones.

Built with react and vite ...and AI support
Kuromoji+react-furigana+dompurify

## Sources
To create my dataset I started from:
* https://jlpt-vocab-api.vercel.app/ (https://github.com/wkei/jlpt-vocab-api)
* https://github.com/scriptin/jmdict-simplified
merging some data like POS

## Other useful resources
* JLPT http://www.tanos.co.uk/jlpt/
* JMDict https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project
* Kanji Api https://kanjiapi.dev/
* Kuromoji to create furigana https://github.com/takuyaa/kuromoji.js
* https://docs.google.com/spreadsheets/d/1uaUcQNyADAwP4k5rb0UNiQ1c8wPtWl1plqDHQryr75E

## Utils
In my utils folder there's the script used to merde one list with some addition from JMDict.
