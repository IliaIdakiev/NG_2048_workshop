import { Direction }  from './enums/direction';
import { Cell }       from './cell.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/pairwise';

export interface IOperationResult { mergeScore: number; hasMoved: boolean; };

function operation(entry1: Cell[], entry2: Cell[]): IOperationResult {
  let mergeScore  = 0,
      results     = entry1.map( (x,i) => {
                    return x.merge(entry2[i]);
                  }),
      hasMoved    = false;

  results.map((x,i) => {
    if (x) {
      hasMoved = true;
      if (entry1[i].wasMerged)
        mergeScore += entry1[i].value;
    }
  })

  return { mergeScore, hasMoved };
}

function merge(operands: Cell[][][]): Observable<any> {
  return Observable.from(operands)
    .mergeMap(rows => {
      // console.log(rows);
      let delayTime = 0;
      return Observable
              .from(rows)
              .pairwise()
              .mergeMap(pair => {
                delayTime += 10;
                return Observable
                        .of(pair)
                        .delay(delayTime);
              });
    })
    .map(([op1, op2]) => operation(op2, op1));
}

function resetMerge(entites: Cell[][]) {
  // Reset all previous merges so cells can merge in the next move;
  entites.forEach(cells => cells.forEach(cell => cell.resetMerged()));
}

function handleMap(rows: Cell[][], reverse: boolean = false): Observable<any> {
  resetMerge(rows);
  let operands = [];
  rows.map((x,i) => {
    let j = 0,
        inner = [];
    if (reverse) {
      j = rows.length - 1;
      while (j >= rows.length - (i+2)) {
        inner.unshift(rows[j]);
        j --;
      }
    }
    else {
      while (j <= i+1) {
        inner.unshift(rows[j]);
        j ++;
      }
    }
    if (i < rows.length - 1)
      operands.push(inner);
  })
  return merge(operands);
}

export const ACTION_MAP: { [x: number]: (entry: Cell[][]) => Observable<any> } = {
  [Direction.Up]:    (rows: Cell[][]): Observable<any> => {
    return handleMap(rows);
  },
  [Direction.Down]:  (rows: Cell[][]): Observable<any> => {
    return handleMap(rows, true);
  },
  [Direction.Left]:  (columns: Cell[][]): Observable<any> => {
    return handleMap(columns);
  },
  [Direction.Right]: (columns: Cell[][]): Observable<any> => {
    return handleMap(columns, true);
  }
};
