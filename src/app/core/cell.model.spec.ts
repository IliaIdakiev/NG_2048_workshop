import { Cell } from './cell.model';

describe('Direction action tests', () => {
  let cell1: Cell, cell2: Cell, cell3: Cell;
  beforeEach(() => {
    cell1 = new Cell();
    cell2 = new Cell();
    cell3 = new Cell();
  });

  it('should sum cell 3 and 2 and move value from 1 to 2', () => {
    cell1.value = 2;
    cell2.value = 2;
    cell3.value = 2;

    cell3.merge(cell2);

    cell2.merge(cell1);
    cell3.merge(cell2);

    expect(cell1.value).toEqual(null);
    expect(cell2.value).toEqual(2);
    expect(cell3.value).toEqual(4);
  });

  it('should sum 3 and 2 and move value from 1 to 2 and test isMerged', () => {
    cell1.value = 4;
    cell2.value = 2;
    cell3.value = 2;

    cell3.merge(cell2);

    cell2.merge(cell1);
    cell3.merge(cell2);

    expect(cell1.value).toEqual(null);
    expect(cell2.value).toEqual(4);
    expect(cell3.value).toEqual(4);
  });

  it('should sum 3 and 2 and move value from 1 to 2 and test reset', () => {
    cell1.value = 4;
    cell2.value = 2;
    cell3.value = 2;

    cell3.merge(cell2);

    cell3.resetMerged();
    cell2.merge(cell1);
    cell3.merge(cell2);

    expect(cell1.value).toEqual(null);
    expect(cell2.value).toEqual(null);
    expect(cell3.value).toEqual(8);
  });

  it('should sum 3 and 2 and move value from 1 to 2 and isMerged 2', () => {
    cell1.value = 2;
    cell2.value = 2;
    cell3.value = 4;

    cell3.merge(cell2);

    cell3.resetMerged();
    cell2.merge(cell1);
    cell3.merge(cell2);

    expect(cell1.value).toEqual(null);
    expect(cell2.value).toEqual(4);
    expect(cell3.value).toEqual(4);
  });
});
