import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEmployees = () => {
    const storedEmployees = JSON.parse(localStorage.getItem("employees")) || [];
    setEmployees(storedEmployees);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchEmployees();
    const handleStorageChange = () => {
      fetchEmployees();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleEdit = (employeeId) => {
    navigate(`/create-employee/${employeeId}`);
  };

  const handleDelete = (id) => {
    setLoading(true);
    const updatedEmployees = employees.filter(
      (employee) => employee.employeeId !== id
    );
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortConfig.direction === "ascending") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const filteredEmployees = sortedEmployees.filter((employee) => {
    return (
      employee.name.toLowerCase().includes(searchQuery) ||
      employee.email.toLowerCase().includes(searchQuery) ||
      employee.designation.toLowerCase().includes(searchQuery)
    );
  });

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return "↕";
  };

  const getEmployeeImage = (image) => {
    return image ? image : "public/images/p2.jpg";
  };

  return (
    <div className="max-w-8xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      {loading ? (
        <div className="flex justify-center items-center">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Employee List</h2>
            <input
              type="text"
              placeholder="Enter Search Keyword"
              className="p-2 border rounded w-1/3"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {paginatedEmployees.length === 0 ? (
            <p>No employees found.</p>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th
                    className="border px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("employeeId")}
                  >
                    ID {getSortIcon("employeeId")}
                  </th>
                  <th className="border px-4 py-2">Image</th>
                  <th
                    className="border px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Name {getSortIcon("name")}
                  </th>
                  <th
                    className="border px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    Email {getSortIcon("email")}
                  </th>
                  <th className="border px-4 py-2">Mobile</th>
                  <th className="border px-4 py-2">Designation</th>
                  <th className="border px-4 py-2">Gender</th>
                  <th className="border px-4 py-2">Courses</th>
                  <th
                    className="border px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("createDate")}
                  >
                    Create Date {getSortIcon("createDate")}
                  </th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((employee) => (
                  <tr key={employee.employeeId}>
                    <td className="border px-4 py-2">{employee.employeeId}</td>
                    <td className="border px-4 py-2">
                      {employee.image && (
                        <img
                          src={getEmployeeImage(employee.image)}
                          alt="Employee"
                          width="50"
                        />
                      )}
                    </td>
                    <td className="border px-4 py-2">{employee.name}</td>
                    <td className="border px-4 py-2">{employee.email}</td>
                    <td className="border px-4 py-2">{employee.mobile}</td>
                    <td className="border px-4 py-2">{employee.designation}</td>
                    <td className="border px-4 py-2">{employee.gender}</td>
                    <td className="border px-4 py-2">
                      {employee.courses.join(", ")}
                    </td>
                    <td className="border px-4 py-2">{employee.createDate}</td>
                    <td className="border px-4 py-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleEdit(employee.employeeId)}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee.employeeId)}
                        className="bg-red-500 text-white px-2 py-1 ml-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mt-4 flex justify-between">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              disabled={currentPage * itemsPerPage >= filteredEmployees.length}
              onClick={() =>
                setCurrentPage((prev) =>
                  prev * itemsPerPage < filteredEmployees.length
                    ? prev + 1
                    : prev
                )
              }
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeList;
