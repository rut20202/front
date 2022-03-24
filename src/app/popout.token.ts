import { InjectionToken } from '@angular/core';

export interface PopoutData {
  modalName: string;
  htmlContent: string;
}

export const POPOUT_MODAL_DATA = new InjectionToken<PopoutData>('POPOUT_MODAL_DATA');

export enum PopoutModalName {
  'searchResult' = 'SEARCH_RESULT'
}

export let POPOUT_MODALS = {
  SEARCH_RESULT: {}
};