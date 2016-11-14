import { All, Formula } from './ingredients';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'formulas',
    templateUrl: 'formulas.component.html'
})
export class FormulasComponent implements OnInit {
    value:number;
    formula: Formula;
    constructor(private all:All) {
     }

    ngOnInit() {
        console.log("Will generate");
        this.next();
     }

     next(){
         this.all.generateFormula();
         this.formula = this.all.nextFormula;

     }

     done():void{
         this.formula.done();
         this.all.save();
         this.next();
     }
}