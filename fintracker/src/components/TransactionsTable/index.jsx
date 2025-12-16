import React, { useState } from "react";
import { Radio, Select, Table } from "antd";
import searchImg from "../../assets/search.svg";

function TransactionsTable({ transactions }) {
  const { Option } = Select;

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  // 🔍 SEARCH + FILTER
  const filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      item.type.includes(typeFilter)
  );

  // 🔃 SORT (immutable copy)
  let sortedTransactions = [...filteredTransactions];

  if (sortKey === "date") {
    sortedTransactions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  } else if (sortKey === "amount") {
    sortedTransactions.sort(
      (a, b) => b.amount - a.amount
    );
  }

  return (
    <div
      style={{
        width: "97%",
        padding: "0rem 2rem",
      }}
    >
      {/* Search + Filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className="input-flex">
          <img src={searchImg} alt="search" width="16" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name"
          />
        </div>

        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      {/* Table Header + Sort + Import/Export */}
      <div className="my-table">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2>My Transactions</h2>

          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
            }}
          >
            <button className="btn">Export to CSV</button>

            <label htmlFor="file-csv" className="btn btn-blue">
              Import from CSV
            </label>

            <input
              id="file-csv"
              type="file"
              accept=".csv"
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* Table */}
        <Table
          dataSource={sortedTransactions}
          columns={columns}
          rowKey={(record, index) => index}
        />
      </div>
    </div>
  );
}

export default TransactionsTable;

