import { useState } from "react";
import { useStrapiCollection } from "../hooks/useStrapiCollection";

export default function TestStrapi() {
  const {
    data: expenses,
    isLoading,
    error,
    create,
    update,
    delete: remove,
  } = useStrapiCollection("expenses");

  const [status, setStatus] = useState("");

  const handleTestOperations = async () => {
    try {
      setStatus("Creating expense...");
      const newExpense = {
        name: "Test Expense",
        amount: 100.5,
        balance: 1000.0,
        date: new Date().toISOString().split("T")[0],
        account: "Main Account",
        currency: "EUR",
        valueDate: new Date().toISOString().split("T")[0],
        needsRevision: true,
        notes: "Test expense created via API",
      };

      create(newExpense, {
        onSuccess: (createdExpense) => {
          setStatus("Expense created successfully");

          const expenseId = createdExpense?.data?.documentId;
          console.log("Expense ID:", expenseId);

          if (!expenseId) throw new Error("Failed to retrieve expense ID");

          setStatus("Updating expense...");
          update(
            { documentId: expenseId, updatedData: { amount: 150.5, notes: "Updated test expense" } },
            {
              onSuccess: () => {
                setStatus("Expense updated successfully");

                setStatus("Deleting expense...");
                remove(expenseId, {
                  onSuccess: () => setStatus("Expense deleted successfully"),
                });
              },
            }
          );
        },
      });
    } catch (err) {
      setStatus("Operations failed");
      console.error("Operation failed:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Strapi Integration Test</h1>

      <div style={{ marginBottom: "20px" }}>
        <h2>Expense Operations Test</h2>
        <button
          onClick={handleTestOperations}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Test CRUD Operations
        </button>
        <p
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: status.includes("failed") ? "#ffebee" : "#e8f5e9",
            borderRadius: "4px",
          }}
        >
          Status: {status}
        </p>
        {error && (
          <p
            style={{
              color: "#d32f2f",
              backgroundColor: "#ffebee",
              padding: "10px",
              borderRadius: "4px",
              marginTop: "10px",
            }}
          >
            Error: {error.message}
          </p>
        )}
      </div>

      <div>
        <h2>Current Expenses</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <pre
            style={{
              background: "#f5f5f5",
              padding: "15px",
              borderRadius: "4px",
              overflow: "auto",
              maxHeight: "400px",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            {JSON.stringify(expenses, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
