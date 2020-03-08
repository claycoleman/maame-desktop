import React, { useContext, useMemo, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTable, useSortBy } from 'react-table';
import { BounceLoader } from 'react-spinners';
import Table from 'react-bootstrap/Table';
import moment from 'moment';

import useRecentUsage from './useRecentUsage';
import { RecentUsageSortingMode, RecentUsageSortingModeToSortingKey } from './helpers';
import { useTopLevelOrganization } from '../../components/Firebase';

function formatDate({ cell: { value } }) {
  return moment(value).format('D MMM YYYY');
}

const RecentUsageTable = ({ recentUsage, loading }) => {
  const storeUsers = useSelector(state => state.users);
  // _loading,
  const data = useMemo(
    () =>
      !loading && recentUsage != null && storeUsers != null
        ? Object.keys(recentUsage)
            .map(userId =>
              storeUsers[userId] != null
                ? {
                    ...recentUsage[userId],
                    name: `${storeUsers[userId].firstName} ${storeUsers[userId].lastName}`,
                  }
                : null,
            )
            .filter(Boolean)
        : [],
    [loading, recentUsage, storeUsers],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns: [
        {
          Header: ' ',
          columns: [
            {
              Header: 'Name',
              accessor: 'name',
            },
          ],
        },

        {
          Header: 'Info',
          columns: [
            {
              Header: 'Most Recent Registrant Date',
              accessor: 'latestRegistrant',
              sortDescFirst: true,
              Cell: formatDate,
            },
            {
              Header: 'Total Registrants',
              accessor: 'totalRegistrants',
              sortDescFirst: true,
            },
            {
              Header: 'Most Recent Update to Client',
              accessor: 'latestUpdate',
              sortDescFirst: true,
              Cell: formatDate,
            },
            {
              Header: 'Most Recent Visit',
              accessor: 'latestVisit',
              sortDescFirst: true,
              Cell: formatDate,
            },
            {
              Header: 'Total Visits',
              accessor: 'totalVisits',
              sortDescFirst: true,
            },
          ],
        },
      ],
      data,
    },
    useSortBy,
  );

  return (
    <Table striped bordered hover>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, index) => (
              // Add the sorting props to control sorting. For this example
              // we can add them into the header props
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                {/* Add a sort direction indicator */}
                <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell, index) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default RecentUsageTable;
