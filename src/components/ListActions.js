import React, { cloneElement } from 'react';
import * as ra from 'react-admin';
import { ImportButton } from './';

const ListActions = props => {
  const { className, exporter, filters, maxResults, hasCreate, ...rest } = props;

  const { currentSort, resource, displayedFilters, filterValues, basePath, showFilter, total } =
    ra.useListContext();

  return (
    <ra.TopToolbar className={className} {...ra.sanitizeListRestProps(rest)}>
      {filters &&
        cloneElement(filters, {
          resource,
          showFilter,
          displayedFilters,
          filterValues,
          context: 'button',
        })}
      {hasCreate ? (
        <>
          <ra.CreateButton basePath={basePath} />
          <ImportButton {...props} />
        </>
      ) : null}
      <ra.ExportButton
        disabled={total === 0}
        resource={resource}
        sort={currentSort}
        filterValues={filterValues}
        maxResults={maxResults}
      />
    </ra.TopToolbar>
  );
};

export default ListActions;
