import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Cell } from '../cell.model';
@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent {
  cell: Cell;

  @Input('cell') set _cell(cell: Cell) {
    if (cell.value === 2048) this.success.emit(true);
    this.cell = cell;
  }
  @Output() success: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  private get class(): string {
    const base = `color-${this.cell.value}`;
    if (this.cell.value === null) return 'empty';
    if (this.cell.wasMerged) return `${base} merged`;
    return base;
  }
}
