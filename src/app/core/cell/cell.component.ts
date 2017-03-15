import { Component, OnInit, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { Cell } from '../cell.model';
@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})
export class CellComponent implements OnInit {
  cell: Cell;

  @Input('cell') set _cell(cell: Cell) {
    if (cell.value === 2048) this.success.emit(true);
    this.cell = cell;
  }
  @Output() success: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  private get class(): string {
    if (this.cell.value === null) return '';
    else return 'color-' + this.cell.value;
  }
}
