import { Component, Input } from '@angular/core';
import { Cell } from '../cell.model';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent {
  @Input() cell: Cell;

  constructor() { }

  private get class(): string {
    const base = `color-${this.cell.value}`;
    if (this.cell.value === null) return 'empty';
    if (this.cell.wasMerged) return `${base} merged`;
    return base;
  }
}
