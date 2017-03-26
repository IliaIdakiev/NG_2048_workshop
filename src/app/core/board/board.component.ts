import { Component, HostListener} from '@angular/core';
import { KEY_MAP } from '../constants/key-map';
import { IOperationResult } from '../action-handler';
import { GameService } from '../game.service';
import { Cell } from '../cell.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent  {

  cells: Cell[];
  gameOver: boolean = false;
  score: number = 0;
  completed: boolean = false;

  @HostListener('window:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {
    let moveSuccessful = false;
    const direction = KEY_MAP[event.keyCode];
    if (this.gameOver || direction === undefined) return;
    this.game.move(direction).subscribe((result: IOperationResult) => {
      moveSuccessful = moveSuccessful || result.hasMoved;
    }, console.error, () => {
      if (moveSuccessful) this.game.randomize();
      this.score = this.game.score;
      this.gameOver = this.game.isGameOver;
    });
  }

  constructor(private game: GameService) {
    this.initGame();
  }

  initGame() {
    this.cells = this.game.cells;
    this.gameOver = this.completed = false;
    this.game.randomize();
    this.game.randomize();
  }

  restart() {
    this.score = 0;
    this.game.restart();
    this.initGame();
  }

  successHandler() {
    this.completed = true;
    this.gameOver = true;
  }
}
