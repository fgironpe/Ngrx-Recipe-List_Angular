import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { Injectable } from '@angular/core';

@Injectable()
export class ShoppingListService {
    ingredientsChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();

    /*private ingredients: Ingredient[] = [
      new Ingredient('Apples', 5),
      new Ingredient('Tomato', 10)
    ];*/

    ingredients: Ingredient[] = [];

    getIngredients() {
      return this.ingredients.slice();
    }

    getIngredient(index: number) {
      return this.ingredients[index];
    }

    addIngredient(ingredient: Ingredient) {
      this.ingredients.push(ingredient);
      this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]) {
      /* push(...ingredients): añade a un array todos los elementos del array pasado como parámetro uno a uno */
      this.ingredients.push(...ingredients);
      this.ingredientsChanged.next(this.ingredients.slice());
    }

    updateIngredient(index: number, newIngredient: Ingredient) {
      this.ingredients[index] = newIngredient;
      this.ingredientsChanged.next(this.ingredients.slice());
    }

    deleteIngredient(index: number) {
      this.ingredients.splice(index, 1);
      this.ingredientsChanged.next(this.ingredients.slice());
    }

    }
