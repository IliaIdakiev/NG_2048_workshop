export class Cell {
  wasMerged: boolean = false;
  value: number = null;

  get isEmpty(): boolean {
    return this.value === null;
  };

  merge(cell: Cell): boolean {
    const val = cell.value;
    if (!val || this.wasMerged || cell.wasMerged) return false;
    if (this.value && this.value !== val) return false;
    if (this.value) {
      this.value += val;
      this.wasMerged = true;
    } else {
      this.value = val;
    }
    cell.value = null;
    return true;
  }

  resetMerged() {
    this.wasMerged = false;
  }
};
