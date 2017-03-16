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
function _operation(entry1: Cell[], entry2: Cell[]): IOperationResult {
  let mergeScore = 0, result1, result2, result3, result4;

  if ((result1 = entry1[0].merge(entry2[0])) && entry1[0].wasMerged) mergeScore += entry1[0].value;
  if ((result2 = entry1[1].merge(entry2[1])) && entry1[1].wasMerged) mergeScore += entry1[1].value;
  if ((result3 = entry1[2].merge(entry2[2])) && entry1[2].wasMerged) mergeScore += entry1[2].value;
  if ((result4 = entry1[3].merge(entry2[3])) && entry1[3].wasMerged) mergeScore += entry1[3].value;

  return {
    mergeScore,
    hasMoved: result1 || result2 || result3 || result4
  };
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

export const _ACTION_MAP: { [x: number]: (entry: Cell[][]) => Observable<any> } = {
  [Direction.Up]:    (rows: Cell[][]): Observable<any> => {
    resetMerge(rows);
    const operands = [[rows[1], rows[0]], [rows[2], rows[1], rows[0]], [rows[3], rows[2], rows[1], rows[0]]];
    return merge(operands);
  },
  [Direction.Down]:  (rows: Cell[][]): Observable<any> => {
    resetMerge(rows);
    const operands = [[rows[2], rows[3]], [rows[1], rows[2], rows[3]], [rows[0], rows[1], rows[2], rows[3]]];
    return merge(operands);
  },
  [Direction.Left]:  (columns: Cell[][]): Observable<any> => {
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
