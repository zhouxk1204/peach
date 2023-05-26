import { Pipe, PipeTransform } from "@angular/core";
import { ROLE } from "../constants/commom.constant";

@Pipe({
  name: "role",
})
export class RolePipe implements PipeTransform {
  transform(id: number): string {
    return ROLE.find((e) => e.id === id)?.label ?? "error";
  }
}
