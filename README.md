# Music Quiz Web App

# Functional specification

The project is to create a music quiz app where you can play against your friends and score points. You start by creating a room that your friends can join (using websockets) and then you choose your songs that you want to be in the quiz. The songs (30 second previews) and images will be fetched from the Deezer API https://developers.deezer.com/api and to score points your friends have to guess the name of the song. They guess by filling in the empty squares similar to Wordle and the time limit is 30 seconds. I started early with this and have managed to get most of the UI working.

The points system will be similar to scribble.io where you will not guess on your own song but you will gain points by how fast the others can guess correctly. This will discourage people from choosing very difficult songs since they will not gain any points either if their friends can not guess on time.

# Technical specification

Frontend: React with Typescript and Chakra UI as a UI library. Websockets will be handled with Socket.io-client.

Backend: Express server connected to an online MongoDB database, Mongoose will be used as database ORM. To manage the communication throughout the game every client will have an open socket to the server which is set up with Socket.io

