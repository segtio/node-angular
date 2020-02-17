import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';

// For Common Mock test
@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  imports: [RouterTestingModule],
  exports: [RouterTestingModule],
  providers: []
})
export class AppTestModule {}
