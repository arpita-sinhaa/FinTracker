import React, { useState } from "react";
import { Radio, Select, Table } from "antd";
import searchImg from "../../assets/search.svg";
import Papa from "papaparse";
import { toast } from "react-toastify";

function TransactionsTable({ transactions, addTransaction, fetchTransactions }) {
  const { Option } = Select;

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Tag", dataIndex: "tag", key: "tag" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Date", dataIndex: "date", key: "date" },
  ];

  const filteredTransactions = transactions.filter(
    (item) =>
      item?.name &&
      item?.type &&
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      item.type.includes(typeFilter)
  );

  const sortedTransactions = [...filteredTransactions];

  if (sortKey === "date") {
    sortedTransactions.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }

  if (sortKey === "amount") {
    sortedTransactions.sort(
      (a, b) => Number(b.amount) - Number(a.amount)
    );
  }

  function exportCsv() {
    if (!transactions.length) {
      toast.error("No transactions to export");
      return;
    }

    const csv = Papa.unparse(transactions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function importFromCsv(event) {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        let added = 0;
        let skipped = 0;

        for (const transaction of results.data) {
          if (
            !transaction.name ||
            !transaction.type ||
            isNaN(Number(transaction.amount))
          ) {
            skipped++;
            continue;
          }

          const newTransaction = {
            name: transaction.name,
            type: transaction.type,
            tag: transaction.tag || "",
            date: transaction.date,
            amount: Number(transaction.amount),
          };

          try {
            await addTransaction(newTransaction, true);
            added++;
          } catch {
            skipped++;
          }
        }

        if (added > 0) {
          toast.success(`${added} transactions imported`);
          fetchTransactions();
        }

        if (skipped > 0) {
          toast.warn(`${skipped} rows skipped`);
        }

        event.target.value = null;
      },
      error: () => toast.error("CSV parsing failed"),
    });
  }

  return (
    <div style={{ width: "97%", padding: "0rem 2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
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
          onChange={(value) => setTypeFilter(value || "")}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      <div className="my-table">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <h2>My Transactions</h2>

          <Radio.Group
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="btn" onClick={exportCsv}>
              Export to CSV
            </button>

            <label htmlFor="file-csv" className="btn btn-blue">
              Import from CSV
            </label>

            <input
              id="file-csv"
              type="file"
              accept=".csv"
              onChange={importFromCsv}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <Table
          dataSource={sortedTransactions}
          columns={columns}
          rowKey={(record, index) =>
            record.id || `${record.name}-${record.date}-${index}`
          }
        />
      </div>
    </div>
  );
}

export default TransactionsTable;

