import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MaterialModule } from "./material.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AddComponent } from "./dialog/add/add.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DeleteComponent } from "./dialog/delete/delete.component";
import { PipesModule } from "./pipes/pipes.module";

@NgModule({
  declarations: [AppComponent, AddComponent, DeleteComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
