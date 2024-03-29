import { Component, OnInit } from '@angular/core';
import { Card } from '../card.interface';

@Component({
  selector: 'app-level1',
  templateUrl: './level1.page.html',
  styleUrls: ['./level1.page.scss'],
})
export class Level1Page implements OnInit {
  public gameState; // Keep track of the current game state
  public startGame; // Will set to false to display intro
  public countDown; // Lets show 3 seconds countDown
  public totalTime; // How long the player has to win
  public countTime; // Elapsed time while game is playing
  public shownTime; // Time shown as string format
  public interTime; // Timer: 1 second for in game tracking
  public interCount; // Timer: 1 second for in game counter

  public previewTime = 5; // Duration of the preview phase in seconds
  public previewInProgress = false; // Flag to indicate if the preview phase is in progress

  public cardsTotal = 12; // Total cards to match (divided by 2)
  public cardsArray: Card[] = []; // Store all cards pairs
  public userLife = 4; // Total amount of tries user gets
  public imageDir = '../assets/img/fruits/';
  public images = [
    'apple',
    'strawberry',
    'apple-green',
    'cherry',
    'grape-green',
    'grape-purple',
    'peach',
    'pear',
  ];

  public selectCards1pos = -1; // Selected card #1 position
  public selectCards1val = -1; // Selected card #1 value
  public selectCards2pos = -1; // Selected card #2 position
  public selectCards2val = -1; // Selected card #2 value
  public selectOldPos = -1; // Store old position

  public debugText = 'Debug text goes here :)';

  constructor() {}

  ngOnInit() {
    this.restartGame();
  }

  // Function to populate cards array with position and value pairs from 0 to 6
  populateCards() {
    this.cardsArray = [];
    var x = 0;
    var y = 0;
    for (var i = 0; i < this.cardsTotal; i++) {
      // Push card to array and assign value
      this.cardsArray.push({ pos: i, val: y });
      // Flip x to assign next card same value
      if (x == 0) x = 1;
      else {
        x = 0;
        y++;
      }
    }
  }

  // Function to preview the cards
  startPreview() {
    this.previewInProgress = true;
    // Show all cards during the preview phase
    setTimeout(() => {
      this.previewInProgress = false;
      // Start the actual game after the preview phase ends
      this.startGame = true;
      this.gameState = 'init';
    }, this.previewTime * 1000);
  }

  // Function to select a card
  selectCard(pos: number, val: number, i: number) {
    if (this.previewInProgress) {
      // Don't allow card selection during the preview phase
      return;
    }

    var actOne = false;

    // Code to select the second card
    if (this.selectCards1pos > -1 && this.selectCards2pos == -1) {
      this.selectCards2pos = pos;
      this.selectCards2val = val;
      actOne = true;
    }

    // Code to select the first card
    if (this.selectCards1pos == -1 && !actOne) {
      this.selectCards1pos = pos;
      this.selectCards1val = val;
      this.selectOldPos = i;
    }

    // If we have both cards selected, check for match or fail
    if (actOne && this.selectCards1pos > -1 && this.selectCards2pos > -1) {
      setTimeout(() => {
        // If the cards match, do this...
        if (this.selectCards1val == this.selectCards2val) {
          this.debugText = 'Cards match!';
          this.cardsArray.splice(this.selectOldPos, 1, {
            pos: this.selectOldPos,
            val: -1,
          });
          this.cardsArray.splice(i, 1, { pos: i, val: -1 });
          this.resetSelects();
          this.winCon();
        }
        // Otherwise, take a life and reset
        else {
          this.debugText = 'Cards not match!';
          this.userLife -= 1;
          this.resetSelects();
          if (this.userLife <= 0) this.loseCon();
        }
      }, 1000);
    }
  }

  // Function to shuffle an array
  shuffle<T>(a: T[]): T[] {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Inclusive range
      const temp = a[i];
      a[i] = a[j];
      a[j] = temp;
    }
    return a;
  }

  // Function to restart the game
  restartGame() {
    this.gameState = 'load';
    this.startGame = false;
    this.countDown = 5;
    this.totalTime = 60;
    this.countTime = 0;
    this.shownTime = 0;
    this.interCount = null;

    this.userLife = 4;
    this.resetSelects();
    this.populateCards();
    this.shuffle(this.cardsArray);
    this.shuffle(this.images);
    this.startPreview();

    setTimeout(() => {
      this.startGame = true; // Actually starts the game
      this.gameState = 'init'; // Game has been initialized
    }, this.countDown * 1000);

    // This will subtract 1 from countdown start time
    this.interCount = setInterval(() => {
      if (this.countDown < 0) {
        clearInterval(this.interCount);
        this.countDown = null;
      } else this.countDown -= 1;
    }, 1000);

    // This timer will keep track of the time once the game starts
    setTimeout(() => {
      this.interTime = setInterval(() => {
        if (this.countTime >= this.totalTime) this.loseCon();
        if (this.gameState == 'init') {
          this.countTime += 1; // Add 1 second to the counter
          var minutes = Math.floor((this.totalTime - this.countTime) / 60);
          var seconds = this.totalTime - this.countTime - minutes * 60;
          this.shownTime = minutes.toString() + ':' + seconds.toString();
        } else {
          clearInterval(this.interTime);
          this.interTime = null;
        }
      }, 1000);
    }, this.countDown * 1000 + 200);
  }

  // Win Condition
  winCon() {
    var winCheck = false;
    // If at least 1 or more cards have not been solved,
    // then the user hasn't solved the game
    for (var i = 0; i <= this.cardsArray.length; i++) {
      if (this.cardsArray[i].val != -1) winCheck = true;
      // If winCheck is false, player has won the game
      if (winCheck == false) this.gameState = 'win';
    }
  }

  // Lose condition
  loseCon() {
    this.gameState = 'lose';
  }

  // Function to reset the selected cards
  resetSelects() {
    this.selectCards1pos = -1; // Selected cards #1 position
    this.selectCards1val = -1; // Selected cards #1 value
    this.selectCards2pos = -1; // Selected cards #2 position
    this.selectCards2val = -1; // Selected cards #2 value
  }
}
