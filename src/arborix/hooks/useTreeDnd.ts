// src/arborix/hooks/useTreeState.ts
import { useReducer, useRef, useCallback } from 'react';
import { produce, Draft } from 'immer';
import EventEmitter from 'eventemitter3';
import type { TreeData, TreeNodeId, TreeState } from '../types';

type Action =
  | { type: 'SET_DATA'; payload: TreeData }
  | { type: 'TOGGLE_OPEN'; payload: TreeNodeId }
  | { type: 'TOGGLE_CHECK'; payload: TreeNodeId }
  | { type: 'SELECT_NODE'; payload: { id: TreeNodeId; multi: boolean } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'COMMIT_HISTORY' }; // usado internamente após mutações pesadas

const MAX_HISTORY = 50;

const initialTreeState = (data: TreeData): TreeState => ({
  data,
  openIds: new Set<TreeNodeId>(),
  selectedIds: new Set<TreeNodeId>(),
  checkedIds: new Set<TreeNodeId>(),
  history: [data],
  historyIndex: 0,
});

export function useTreeState(initialData: TreeData) {
  const emitter = useRef(new EventEmitter()).current;

  const reducer = (state: TreeState, action: Action): TreeState =>
    produce(state, (draft: Draft<TreeState>) => {
      switch (action.type) {
        case 'SET_DATA':
          draft.data = action.payload;
          draft.history = [action.payload];
          draft.historyIndex = 0;
          break;

        case 'TOGGLE_OPEN':
          if (draft.openIds.has(action.payload)) {
            draft.openIds.delete(action.payload);
          } else {
            draft.openIds.add(action.payload);
          }
          emitter.emit('open-change', action.payload, draft.openIds.has(action.payload));
          break;

        case 'TOGGLE_CHECK':
          // Lógica tri-state completa será usada depois no NodeRenderer
          // Por enquanto apenas toggle simples (será expandida se precisar)
          if (draft.checkedIds.has(action.payload)) {
            draft.checkedIds.delete(action.payload);
          } else {
            draft.checkedIds.add(action.payload);
          }
          emitter.emit('check-change', action.payload);
          break;

        case 'SELECT_NODE':
          if (!action.payload.multi) {
            draft.selectedIds.clear();
          }
          if (draft.selectedIds.has(action.payload.id)) {
            draft.selectedIds.delete(action.payload.id);
          } else {
            draft.selectedIds.add(action.payload.id);
          }
          emitter.emit('selection-change', draft.selectedIds);
          break;

        case 'COMMIT_HISTORY':
          // Limpa futuro e adiciona estado atual ao histórico
          const nextHistory = draft.history.slice(0, draft.historyIndex + 1);
          nextHistory.push(draft.data);

          if (nextHistory.length > MAX_HISTORY) {
            nextHistory.shift();
            draft.historyIndex--;
          }

          draft.history = nextHistory;
          draft.historyIndex = nextHistory.length - 1;
          break;

        case 'UNDO':
          if (draft.historyIndex > 0) {
            draft.historyIndex -= 1;
            draft.data = draft.history[draft.historyIndex];
          }
          break;

        case 'REDO':
          if (draft.historyIndex < draft.history.length - 1) {
            draft.historyIndex += 1;
            draft.data = draft.history[draft.historyIndex];
          }
          break;
      }
    });

  const [state, dispatch] = useReducer(reducer, initialData, initialTreeState);

  // Ações públicas
  const toggleOpen = useCallback((id: TreeNodeId) => {
    dispatch({ type: 'TOGGLE_OPEN', payload: id });
  }, []);

  const toggleCheck = useCallback((id: TreeNodeId) => {
    dispatch({ type: 'TOGGLE_CHECK', payload: id });
    dispatch({ type: 'COMMIT_HISTORY' }); // salva no histórico
  }, []);

  const selectNode = useCallback((id: TreeNodeId, multi = false) => {
    dispatch({ type: 'SELECT_NODE', payload: { id, multi } });
  }, []);

  const setData = useCallback((newData: TreeData) => {
    dispatch({ type: 'SET_DATA', payload: newData });
  }, []);

  const commit = useCallback(() => {
    dispatch({ type: 'COMMIT_HISTORY' });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  return {
    state: state as Readonly<TreeState>, // imutável para o consumidor
    toggleOpen,
    toggleCheck,
    selectNode,
    setData,
    commit,       // chama após mutações externas (ex: DND, rename)
    undo,
    redo,
    canUndo,
    canRedo,
    emitter,
  };
}