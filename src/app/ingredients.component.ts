import { All, Ingredient } from './ingredients';
import { PropertyIngredient } from './ingredients';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'ingredients',
    templateUrl: 'ingredients.component.html'
})
export class IngredientsComponent implements OnInit {
    list: Array<Ingredient>;
    constructor(private all:All) {
        this.list=all.elements;
     }

    toggle(ep: PropertyIngredient):void {
        ep.known = ! ep.known;
        this.all.save();
    }

    add(i:Ingredient):void{
        i.quantity+=1;
        this.all.save();
    }

    remove(i:Ingredient):void{
        i.quantity-=1;
        this.all.save();
    }

    ngOnInit() { }
}