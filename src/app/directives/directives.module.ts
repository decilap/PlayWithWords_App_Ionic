import { NgModule } from '@angular/core';
import {ColorDirective} from "./color-directive";
import {HighlightDirective} from "./highlight.directive";

@NgModule({
  declarations: [
    ColorDirective,
    HighlightDirective
  ],
  imports: [],
  exports: [
    ColorDirective,
    HighlightDirective
  ]
})
export class DirectivesModule {}
