// Student payment details (for Student Dashboard)
export const studentPayments = [
  { id: 1, type: "Semester Fee", status: "Pending", amount: 12000 },
  { id: 2, type: "Book Bank", status: "Paid", amount: 2000 },
  { id: 3, type: "Attendance Fine", status: "Pending", amount: 500 },
  { id: 4, type: "Library Fine", status: "Paid", amount: 300 },
];

// Batch-wise student data (for Teacher Dashboard)
export const batches = [
  {
    id: 1,
    name: "Batch 2023",
    students: [
      { id: 101, name: "Arsh", status: "Paid" },
      { id: 102, name: "Rahul", status: "Pending" },
      { id: 103, name: "Priya", status: "Paid" },
    ],
  },
  {
    id: 2,
    name: "Batch 2024",
    students: [
      { id: 201, name: "Aman", status: "Pending" },
      { id: 202, name: "Simran", status: "Paid" },
    ],
  },
];
