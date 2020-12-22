import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter_supplier'
})
export class FilterPipeSupplier implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if(!items) return [];
    if(!searchText) return items;
    
    searchText = searchText.toLowerCase();
        return items.filter( it => {
          return it.name.toLowerCase().includes(searchText);
        });
   } 
}