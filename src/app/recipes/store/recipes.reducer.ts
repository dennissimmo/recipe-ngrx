import {Recipe} from "../recipe.model";

import * as RecipeActions from "./recipe.actions";

const initialState = {
  recipes: []
};

export interface State {
  recipes: Recipe[];
}

export function recipesReducer(state: State = initialState, action: RecipeActions.RecipesActions) {
  switch (action.type) {
    case RecipeActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      };
    case RecipeActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    case RecipeActions.UPDATE_RECIPE:
      const updatedRecipe = state.recipes[action.payload.index];
      const newRecipe = {
        ...updatedRecipe,
        ...action.payload.newRecipe
      };

      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.index] = newRecipe;

      return {
        ...state,
        recipes: updatedRecipes
      };
    case RecipeActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, index) => index !== action.payload)
      };
    default: return state;
  }
}
