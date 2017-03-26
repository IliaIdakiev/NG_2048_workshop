import { Component, HostBinding, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { Cell }                                                from '../cell.model';
@Component({
  selector:     'app-cell',
  templateUrl:  './cell.component.html',
  styleUrls:    ['./cell.component.css']
})
export class CellComponent implements OnInit {

  // @Input('cell') set _cell(cell: Cell) {
  //   if (cell.value === 16) {
  //     this.success.emit(true);
  //   }
  //   this.cell = cell;
  // }

  @Input()  cell: Cell;
  @Output() success: EventEmitter<boolean> = new EventEmitter();

  ngOnInit() {
    this.cell.catchSuccess()
    .subscribe(_ => {
      this.success.emit(true);
    });
  }

  private get class(): string {
    if (this.cell.value === null) return '';
    else return 'color-' + this.cell.value;
  }
}
