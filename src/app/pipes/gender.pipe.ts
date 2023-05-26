import { Pipe, PipeTransform } from "@angular/core";
import { GENDER } from "../constants/commom.constant";

@Pipe({
  name: "gender",
})
export class GenderPipe implements PipeTransform {
  transform(id: number): string {
    return GENDER.find((e) => e.id === id)?.label ?? "error";
  }
}
