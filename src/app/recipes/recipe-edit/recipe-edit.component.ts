import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: UntypedFormGroup;

  private storeSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params.id;
      this.editMode = params.id != null;
      this.initForm();
    });
  }

  ngOnDestroy() {
    if(this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new UntypedFormArray([]);

    if (this.editMode) {
      this.storeSub = this.store.select('recipes')
        .pipe(
          map(recipeState => {
            return recipeState.recipes.find((recipe, index) => {
              return index === this.id; 
            });
          })
        )
        .subscribe(recipe => {
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;
          if (recipe.ingredients)  {
            for (let ingredient of recipe.ingredients) {
              recipeIngredients.push(new UntypedFormGroup({
                'name': new UntypedFormControl(ingredient.name, Validators.required),
                'amount': new UntypedFormControl(ingredient.amount, [
                  Validators.required,
                  Validators.pattern(/^[1-9]+[0-9]*$/)
                ])
              }));
            }
          }
        });
    }
    this.recipeForm = new UntypedFormGroup({
      'name': new UntypedFormControl(recipeName, Validators.required),
      'imagePath': new UntypedFormControl(recipeImagePath, Validators.required),
      'description': new UntypedFormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.store.dispatch(new RecipesActions.UpdateRecipe({ index: this.id, newRecipe: this.recipeForm.value }));
    } else {
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value));
    }
    this.recipeForm.reset();
    this.onCancel();
  }

  onAddIngredient() {
    this.ingredients.push(
      new UntypedFormGroup({
        'name': new UntypedFormControl(null, Validators.required),
        'amount': new UntypedFormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onDeleteIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as UntypedFormArray;
  }

}
