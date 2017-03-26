import { Component, ViewChildren, QueryList, HostListener, Input }  from '@angular/core';

import { CellComponent }                                            from '../cell/cell.component';
import { KEY_MAP }                                                  from '../constants/key-map';
import { ACTION_MAP, IOperationResult }                             from '../action-handler';
import { GameService }                                              from '../game.service';
import { Cell }                                                     from '../cell.model';

@Component({
  selector:     'app-board',
  templateUrl:  './board.component.html',
  styleUrls:    ['./board.component.css']
})
export class BoardComponent {

  cells:    Cell[];
  gameOver: boolean = false;
  score:    number  = 0;
  gridSize: number  = 4;


  // @Input(val) 

  @HostListener('window:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {
    let   moveSuccessful = false;
    const direction      = KEY_MAP[event.keyCode];
    
    if (this.gameOver || direction === undefined) return;

    this.game.move(direction)
    .subscribe(
      (result: IOperationResult) => {
        moveSuccessful = moveSuccessful || result.hasMoved;
      },console.error,
      () => {
        this.cells = this.game.cells;
        this.score = this.game.score;
        if (moveSuccessful) this.game.randomize(1, direction);
        if (!this.gameOver)
          this.gameOver = this.game.isGameOver;
      }
    );
  }

  constructor(private game: GameService) {
    this.initGame(this.gridSize);
    // this.gridSize = game.gridSize;
  }

  initGame(gridSize: number) {
    this.gridSize = gridSize
    this.game.initializeGame(this.gridSize);
    this.cells    = this.game.cells;
    this.gameOver = false;
    this.game.randomize(1);
  }

  restart(gridSize: number = this.gridSize) {
    // if (!gridSize)
    console.log(gridSize);
    this.score = 0;
    this.initGame(gridSize);
    // this.game.restart();
  }

  successHandler() {
    alert('You win!');
    this.gameOver = true;
  }
}
