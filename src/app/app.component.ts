import { FormulasComponent } from './formulas.component';
import { IngredientsComponent } from './ingredients.component';
import { All } from './ingredients';
import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [All, IngredientsComponent, FormulasComponent],
    entryComponents:[IngredientsComponent,  FormulasComponent]
    
})
export class AppComponent {
    collapsed = true;
    mode: string;

    constructor() {
        this.viewIngredients();
    }

    viewIngredients(): void {
        this.mode = "ingredients";
    }

    viewFormulas(): void {
        this.mode = "formulas";
    }

    navbarToggle() {
        this.collapsed = !this.collapsed;
    }
}
