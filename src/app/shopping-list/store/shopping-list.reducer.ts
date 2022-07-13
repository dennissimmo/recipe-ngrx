import {Ingredient} from '../../shared/ingredient.model';
import * as ShoppingListActions from "./shopping-list.actions";

const initialState = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ]
};

export function shoppingListReducer(state = initialState, action: ShoppingListActions.ShoppingListActions) {
  const type = action.type;
  switch (type) {
    case ShoppingListActions.ADD_INGREDIENT :
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };
    case ShoppingListActions.ADD_INGREDIENTS :
      return {
      ...state,
      ingredients: [...state.ingredients, ...action.payload]
    };
    default:
      return state;
  }
}