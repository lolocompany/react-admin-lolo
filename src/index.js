import {
  Admin as LoloAdmin,
  Resource as LoloResource,
  Create as LoloCreate,
  Edit as LoloEdit,
  List as LoloList,
} from './views';
import { dataProvider } from './providers';
import { useAdminContext } from './hooks';
import { default as localStorage } from './helpers/localStorage';

export {
  LoloAdmin,
  LoloResource,
  LoloCreate,
  LoloEdit,
  LoloList,
  dataProvider,
  useAdminContext,
  localStorage,
};
