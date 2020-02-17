import {NgModule} from '@angular/core';
import {QuizzListComponent} from './quizz-list';
import {QuizzDetailComponent} from './quizz-detail';
import {RouterModule} from '@angular/router';
import {QUIZZ_ROUTES} from './quizz-routes';

@NgModule({
  imports: [
    RouterModule.forChild(QUIZZ_ROUTES)
  ],
  declarations: [QuizzListComponent, QuizzDetailComponent]
})
export class QuizzModule {}
