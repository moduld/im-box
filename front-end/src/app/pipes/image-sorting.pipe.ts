import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageSorting'
})
export class ImageSortingPipe implements PipeTransform {

  transform(value: any, args: any): any {

    let output;
    if (!args.length) {
      output = value;
    } else {
      let temp = value.filter((item: any) => {
        for (let i = 0; i < args.length; i++) {
          if (item.id === args[i].id) {
            return false;
          }
        }
        return true;
      });
      output = temp;
    }
    return output;
  }
}
