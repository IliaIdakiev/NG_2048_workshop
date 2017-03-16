import { Injectable }                   from '@angular/core';

import { Cell }                         from './cell.model';
import { Direction }                    from './enums/direction';
import { KEY_MAP }                      from './constants/key-map';
import { ACTION_MAP, IOperationResult } from './action-handler';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/bufferCount';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/reduce';

const rand           = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const sameValueCells = (cell1: Cell, cell2: Cell) => cell1.value === cell2.value;

@Injectable()
export class GameService {
  
  gridSize:number   = 5;

  cells:   Cell[]   = Array(this.gridSize*this.gridSize).fill(null).map(_ => new Cell());
  rows:    Cell[][] = [];
  columns: Cell[][] = [];
  score:   number   = 0;

  private hasMoves() {
    let hasColumnMoves = false,
        hasRowMoves    = false,

        _columns        = Array(this.gridSize).fill(null),
        _rows           = Array(this.gridSize).fill(null);

    _columns = _columns.map((_,i) => this.columns[i]);
    _rows    = _rows   .map((_,i) => this.rows[i]);

    _columns.map((x) => {
      x.map((_,i) => {
        if (i < this.gridSize - 1 && sameValueCells(x[i], x[i+1]))
          hasColumnMoves = true;
      })
    })

    _rows.map((x) => {
      x.map((_,i) => {
        if (i < this.gridSize - 1 && sameValueCells(x[i], x[i+1]))
          hasColumnMoves = true;
      })
    })

    return hasRowMoves || hasColumnMoves;
  }

  private _hasMoves() {

    const column1 = this.columns[0];
    const column2 = this.columns[1];
    const column3 = this.columns[2];
    const column4 = this.columns[3];
    const hasColumnMoves =
      sameValueCells(column1[0], column1[1]) || sameValueCells(column1[1], column1[2]) || sameValueCells(column1[2], column1[3]) ||
      sameValueCells(column2[0], column2[1]) || sameValueCells(column2[1], column2[2]) || sameValueCells(column2[2], column2[3]) ||
      sameValueCells(column3[0], column3[1]) || sameValueCells(column3[1], column3[2]) || sameValueCells(column3[2], column3[3]) ||
      sameValueCells(column4[0], column4[1]) || sameValueCells(column4[1], column4[2]) || sameValueCells(column4[2], column4[3]);

    if (hasColumnMoves) return true;
    const row1 = this.rows[0];
    const row2 = this.rows[1];
    const row3 = this.rows[2];
    const row4 = this.rows[3];

    const hasRowMoves =
      sameValueCells(row1[0], row1[1]) || sameValueCells(row1[1], row1[2]) || sameValueCells(row1[2], row1[3]) ||
      sameValueCells(row2[0], row2[1]) || sameValueCells(row2[1], row2[2]) || sameValueCells(row2[2], row2[3]) ||
      sameValueCells(row3[0], row3[1]) || sameValueCells(row3[1], row3[2]) || sameValueCells(row3[2], row3[3]) ||
      sameValueCells(row4[0], row4[1]) || sameValueCells(row4[1], row4[2]) || sameValueCells(row4[2], row4[3]);

    return hasRowMoves;
  }

  private hasEmptyCells(): boolean {
    return this.cells.reduce((acc, cell) =>  acc || cell.isEmpty, false);
  }

  get isGameOver(): boolean {
    return !this.hasEmptyCells() && !this.hasMoves();
  }

  restart() {
    this.cells = Array(this.gridSize*this.gridSize).fill(null).map(_ => new Cell());
    this.score = 0;
    this.initializeGame();
  }

  initializeGame() {
     Observable.from(this.cells)
      .bufferCount(this.gridSize)
      .bufferCount(this.gridSize)
      .do(rows => this.rows = rows)
      .map(rows => rows.map(row => Observable.from(row)))
      .switchMap(obsArray => Observable.zip(...obsArray))
      .bufferCount(this.gridSize)
      // .do(_ => {console.log(this.rows, this.columns)})
      .subscribe(columns => this.columns = columns);
  }

  constructor() {
    this.initializeGame();
  }

  move(direction: Direction): Observable<any> {
    return ACTION_MAP[direction](direction === Direction.Left || direction === Direction.Right ? this.columns : this.rows)
      .map((result: IOperationResult) => { this.score += result.mergeScore; return result; });
  }

  randomize(amount: number) {
    let keepGoing      = this.hasEmptyCells(),
        generatedCells = 0; // @ AK
    while (keepGoing) {
      const randIndex  = rand(0, (this.gridSize*this.gridSize) - 1),
            randValue  = rand(1, 2) === 1 ? 2 : 4,
            cell: Cell = this.cells[randIndex];

      if (!cell.value) {
        cell.value = randValue;
        generatedCells++;

        if (generatedCells >= amount) // @ AK
          keepGoing = false;
      }
    }
  }
}
