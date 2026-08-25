import {Injectable} from '@angular/core';

/**
 * Common interfaces of the project
 */

/**
 * Interface to notifications.
 */
export interface Notifications {
  date: string;
  descriptionPath: string;
  id: number;
  usersId: number;
  viewed: number;
  parameters: string;
}

/**
 * Interface to languages.
 */
export interface Languages {
  iana: string;
  id: number;
  name: string;
}
