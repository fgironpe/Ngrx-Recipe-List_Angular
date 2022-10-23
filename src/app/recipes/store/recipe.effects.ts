import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { Actions, Effect, ofType } from "@ngrx/effects";
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from './recipe.actions';
import { Recipe } from "../recipe.model";

@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(
        'https://ng-course-recipe-book-44dd4-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
      )
    }),
    map(recipes => {
      return recipes.map( recipe => {
        return {
          ...recipe, 
          ingredients: recipe.ingredients ? recipe.ingredients : [] 
        };
      });
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes);
    })
  );

  @Effect({ dispatch: false })
  storeRecipes = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    // Nos permite unir el valor de otro observable en este
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http.put(
        'https://ng-course-recipe-book-44dd4-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
        recipesState.recipes
      )      
    })
  )

  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>,
    private http: HttpClient
    ) {}
}