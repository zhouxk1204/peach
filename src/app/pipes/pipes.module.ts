import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GenderPipe } from "./gender.pipe";
import { RolePipe } from "./role.pipe";

@NgModule({
  declarations: [GenderPipe, RolePipe],
  imports: [CommonModule],
  exports: [GenderPipe, RolePipe],
})
export class PipesModule {}
