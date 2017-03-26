import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { CellComponent }  from './cell/cell.component';
import { BoardComponent } from './board/board.component';
import { GameService }    from './game.service';

@NgModule({
  imports:      [CommonModule],
  declarations: [CellComponent, BoardComponent],
  exports:      [CellComponent, BoardComponent],
  providers:    [GameService]
})
export class CoreModule { }
