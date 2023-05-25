import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "gender",
})
export class GenderPipe implements PipeTransform {
  transform(value: number): string {
    return ["女", "男", "未知"][value];
  }
}
