import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "role",
})
export class RolePipe implements PipeTransform {
  transform(value: number): string {
    return ["护士", "护士长"][value];
  }
}
