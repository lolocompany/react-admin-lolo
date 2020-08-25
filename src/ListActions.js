import React from 'react';
import { cloneElement } from 'react';
import * as ra from 'react-admin';
import ImportButton from './ImportButton';

const ListActions = (props) => {
  const {
    className,
    exporter,
    filters,
    maxResults,
    ...rest
  } = props;

  const {
    currentSort,
    resource,
    displayedFilters,
    filterValues,
    basePath,
    showFilter,
    total,
  } = ra.useListContext();

  return (
    <ra.TopToolbar className={className} {...ra.sanitizeListRestProps(rest)}>
      {filters && cloneElement(filters, {
        resource,
        showFilter,
        displayedFilters,
        filterValues,
        context: 'button',
        })}
      <ra.CreateButton basePath={basePath} />
      <ra.ExportButton
        disabled={total === 0}
        resource={resource}
        sort={currentSort}
        filterValues={filterValues}
        maxResults={maxResults}
      />
      <ImportButton {...props} />
    </ra.TopToolbar>
  );
};

export default ListActions