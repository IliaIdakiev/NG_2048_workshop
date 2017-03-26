import { Direction } from './enums/direction';
import { Cell } from './cell.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/pairwise';

function operation(entry1: Cell[], entry2: Cell[]): number {
  let mergeScore = 0;
  if (entry1[0].merge(entry2[0])) mergeScore += entry1[0].value;
  if (entry1[1].merge(entry2[1])) mergeScore += entry1[1].value;
  if (entry1[2].merge(entry2[2])) mergeScore += entry1[2].value;
  if (entry1[3].merge(entry2[3])) mergeScore += entry1[3].value;
  return mergeScore;
}

function merge(operands: Cell[][][]): Observable<any> {
  return Observable.from(operands)
    .mergeMap(operand => {
      let delayTime = 0;
      return Observable.from(operand).pairwise().mergeMap(pair => {
        delayTime += 50;
        return Observable.of(pair).delay(delayTime);
      });
    })
    .map(([op1, op2]) => operation(op2, op1));
}

function resetMerge(entites: Cell[][]) {
  entites.forEach(cells => cells.forEach(cell => cell.resetMerged()));
}

export const ACTION_HANDLER: { [x: number]: (entry: Cell[][]) => Observable<any> } = {
  [Direction.Up]: (rows: Cell[][]) => {
    resetMerge(rows);
    const operands = [[rows[1], rows[0]], [rows[2], rows[1], rows[0]], [rows[3], rows[2], rows[1], rows[0]]];
    return merge(operands);
  },
  [Direction.Down]: (rows: Cell[][]): Observable<any> => {
    resetMerge(rows);
    const operands = [[rows[2], rows[3]], [rows[1], rows[2], rows[3]], [rows[0], rows[1], rows[2], rows[3]]];
    return merge(operands);
  },
  [Direction.Left]: (columns: Cell[][]): Observable<any> => {
    resetMerge(columns);
    const operands = [[columns[1], columns[0]], [columns[2], columns[1], columns[0]], [columns[3], columns[2], columns[1], columns[0]]];
    return merge(operands);
  },
  [Direction.Right]: (columns: Cell[][]): Observable<any> => {
    resetMerge(columns);
    const operands = [[columns[2], columns[3]], [columns[1], columns[2], columns[3]], [columns[0], columns[1], columns[2], columns[3]]];
    return merge(operands);
  }
};
