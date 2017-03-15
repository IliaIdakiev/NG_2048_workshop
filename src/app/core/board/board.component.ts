import { Component, OnInit, ViewChildren, QueryList, HostListener, AfterViewInit } from '@angular/core';
import { CellComponent } from '../cell/cell.component';
import { KEY_MAP } from '../constants/key-map';
import { ACTION_MAP, IOperationResult } from '../action-handler';
import { GameService } from '../game.service';
import { Cell } from '../cell.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, AfterViewInit {

  cells: Cell[];
  gameOver: boolean = false;
  score: number = 0;

  @HostListener('window:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {
    let moveSuccessful = false;
    const direction = KEY_MAP[event.keyCode];
    if (this.gameOver || direction === undefined) return;
    this.game.move(direction).subscribe((result: IOperationResult) => {
      moveSuccessful = moveSuccessful || result.hasMoved;
    }, console.error, () => {
      this.score = this.game.score;
      if (moveSuccessful) this.game.randomize();
      this.gameOver = this.game.isGameOver;
    });
  }

  constructor(private game: GameService) {
    this.initGame();
  }

  initGame() {
    this.cells = this.game.cells;
    this.gameOver = false;
    this.game.randomize();
    this.game.randomize();
  }

  restart() {
    this.score = 0;
    this.game.restart();
    this.initGame();
  }

  successHandler() {
    alert('You win!');
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }
}
