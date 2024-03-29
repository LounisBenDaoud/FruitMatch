import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Level2Page } from './level2.page';

const routes: Routes = [
  {
    path: '',
    component: Level2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Level2PageRoutingModule {}
