import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from "@ngrx/effects";
import * as RecipesActions from "./recipe.actions";
import {switchMap, withLatestFrom} from "rxjs/operators";
import {Recipe} from "../recipe.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import { map } from "rxjs/operators";
import {Store} from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";

@Injectable()
export class RecipeEffects {

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http
        .get<Recipe[]>(
          environment.firebaseDB
        );
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      });
    }),
    map(recipes => new RecipesActions.SetRecipes(recipes))
  );

  @Effect( { dispatch: false })
  storeRecipes = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http
        .put(
          environment.firebaseDB,
          recipesState.recipes
        );
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {

  }
}
