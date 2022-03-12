import { ActionType } from '../action-types';

interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  payload: {
    id: string;
    direction: 'up' | 'down';
  };
}

interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: string;
}

interface InsertCellAction {
  type: ActionType.INSERT_CELL_BEFORE;
  payload: {
    id: string;
    type: 'code' | 'text';
  };
}

interface UpdateCellACtion {
  type: ActionType.UPDATE_CELL;
  payload: {
    id: string;
    content: string;
  };
}

export type Action =
  | MoveCellAction
  | DeleteCellAction
  | UpdateCellACtion
  | InsertCellAction;