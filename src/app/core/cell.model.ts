import { Component, HostBinding, Input, Output, EventEmitter } from '@angular/core';

export class Cell {
  wasMerged: boolean = false;
  value:     number  = null;

  success:  EventEmitter<boolean> = new EventEmitter();
  
  get isEmpty(): boolean {
    return this.value === null;
  };

  merge(cell: Cell): boolean {
    const val = cell.value;

    if ((!val || this.wasMerged || cell.wasMerged) || 
        (this.value && this.value !== val))
        return false;

    if (this.value) {
      this.value += val;
      this.wasMerged = true;

      if (this.value == 2048) {
        this.success.emit(true);
      }
    } else {
      this.value = val;
    }
    
    cell.value = null;
    return true;
  }

  catchSuccess() {
    return this.success;
  }

  resetMerged() {
    this.wasMerged = false;
  }
};
