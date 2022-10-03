import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { LoggingService } from '../../logging.service';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) slForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService, private loggingService: LoggingService) { }

  ngOnInit(): void {
    this.subscription = this.slService.startedEditing.subscribe(( index: number) => {
      this.editedItemIndex = index;
      this.editedItem = this.slService.getIngredient(index);
      this.editMode = true;
      this.slForm.setValue({
        name: this.editedItem.name,
        amount: this.editedItem.amount
      });
    });

    this.loggingService.printLog('Hello from ShoppingListComponent ngOnInit');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
;  }

  onAddItem(form: NgForm) {
      const value = form.value;
      const newIngredient = new Ingredient(value.name, value.amount);

      if (this.editMode) {
        this.slService.updateIngredient(this.editedItemIndex, newIngredient);
      } else {
        this.slService.addIngredient(newIngredient);
      }
      this.slForm.reset();
      this.editMode = false;
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear();
  }
}
