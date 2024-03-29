import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {Recipe} from '../recipe.model';

import * as fromApp from "../../store/app.reducer";
import * as RecipesAction from "../store/recipe.actions";
import * as ShoppingListActions from "../../shopping-list/store/shopping-list.actions";
import {Store} from "@ngrx/store";
import {map, switchMap} from "rxjs/operators";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>
  ) {
  }

  ngOnInit() {
    this.route.params
      .pipe(
        map(params => +params['id']),
        switchMap(id => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map(state => {
          return state.recipes.find(
            (recipe, index) => index === this.id);
        }
      )).subscribe(recipe => this.recipe = recipe);
  }

  onAddToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.store.dispatch(new RecipesAction.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }

}
