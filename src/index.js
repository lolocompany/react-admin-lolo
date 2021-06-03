import { Admin as LoloAdmin } from './Admin';
import { Resource as LoloResource } from './Resource';
import { default  as LoloCreate } from './Create';
import { default as LoloEdit } from './Edit';
import { default as LoloList } from './List';
import dataProvider from './data_provider';
import { useAdminContext } from './hooks/useAdminContext';

export {
	LoloAdmin,
	LoloResource,
	LoloCreate,
	LoloEdit,
	LoloList,
	dataProvider,
	useAdminContext
}