import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const CreateEmployee = ({ existingEmails = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    employeeId: Date.now(),
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    courses: [],
    image: null,
    createDate: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [duplicateEmailError, setDuplicateEmailError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (id) {
      const storedEmployees =
        JSON.parse(localStorage.getItem("employees")) || [];
      const employee = storedEmployees.find(
        (emp) => emp.employeeId === Number(id)
      );
      if (employee) {
        setFormData(employee);
        if (employee.image) setImagePreview(employee.image);
      }
    }
  }, [id]);

  const validateEmail = (email) => {
    if (email === "") {
      return "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Invalid email format";
    } else if (!id && existingEmails.includes(email)) {
      setDuplicateEmailError("This email is already in use");
      return "";
    } else {
      setDuplicateEmailError("");
      return "";
    }
  };

  const validateMobile = (mobile) => {
    if (mobile === "") {
      return "Mobile number is required";
    } else if (!/^\d+$/.test(mobile)) {
      return "Mobile number must be numeric";
    } else if (mobile.length !== 10) {
      return "Mobile number must be exactly 10 digits";
    } else {
      return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const newErrors = { ...errors };

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        courses: checked
          ? [...prev.courses, value]
          : prev.courses.filter((course) => course !== value),
      }));
    } else if (type === "file") {
      const file = files[0];
      if (file && !["image/jpeg", "image/png"].includes(file.type)) {
        newErrors.image = "Only JPG/PNG files are allowed";
      } else {
        setFormData((prev) => ({ ...prev, [name]: file }));
        setImagePreview(file ? URL.createObjectURL(file) : "");
        delete newErrors.image;
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === "mobile") {
        const mobileError = validateMobile(value);
        if (mobileError) {
          newErrors.mobile = mobileError;
        } else {
          delete newErrors.mobile;
        }
      }
      if (name === "email") {
        const emailError = validateEmail(value);
        if (emailError) {
          newErrors.email = emailError;
        } else {
          delete newErrors.email;
        }
      }
    }
    if (value.trim() === "") {
      newErrors[name] = `${
        name.charAt(0).toUpperCase() + name.slice(1)
      } is required`;
    } else {
      delete newErrors[name];
    }

    setErrors(newErrors);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const newErrors = { ...errors };

    if (name === "name" && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (name === "email") {
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;
    }

    if (name === "mobile") {
      const mobileError = validateMobile(formData.mobile);
      if (mobileError) newErrors.mobile = mobileError;
    }

    if (name === "designation" && !formData.designation) {
      newErrors.designation = "Designation is required";
    }
    if (name === "gender" && !formData.gender) {
      newErrors.gender = "Gender is required";
    }
    if (name === "createDate" && !formData.createDate) {
      newErrors.createDate = "Creation date is required";
    }
    if (name === "courses" && formData.courses.length === 0) {
      newErrors.courses = "At least one course is required";
    }
    if (name === "image" && !formData.image) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const mobileError = validateMobile(formData.mobile);
    if (mobileError) newErrors.mobile = mobileError;

    if (!formData.designation)
      newErrors.designation = "Designation is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.courses.length)
      newErrors.courses = "At least one course is required";
    if (!formData.image) newErrors.image = "Image is required";
    if (!formData.createDate)
      newErrors.createDate = "Creation date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newEmployee = { ...formData };

    if (formData.image instanceof File) {
      newEmployee.image = await convertImageToBase64(formData.image);
    } else {
      newEmployee.image = formData.image;
    }

    let storedEmployees = JSON.parse(localStorage.getItem("employees")) || [];
    if (id) {
      storedEmployees = storedEmployees.map((emp) =>
        emp.employeeId === Number(id) ? newEmployee : emp
      );
    } else {
      storedEmployees.push(newEmployee);
    }

    localStorage.setItem("employees", JSON.stringify(storedEmployees));
    alert(
      id ? "Employee updated successfully" : "Employee created successfully"
    );
    navigate("/employee-list");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        {id ? "Edit Employee" : "Create Employee"}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Name and Email in one row */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="w-1/2">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
            {duplicateEmailError && (
              <p className="text-red-500 text-sm">{duplicateEmailError}</p>
            )}
          </div>
        </div>

        {/* Mobile and Designation in one row */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Mobile No.</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile}</p>
            )}
          </div>

          <div className="w-1/2">
            <label className="block text-gray-700">Designation</label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
            {errors.designation && (
              <p className="text-red-500 text-sm">{errors.designation}</p>
            )}
          </div>
        </div>

        {/* Gender and Courses in one row */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Gender</label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  checked={formData.gender === "M"}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className="mr-2"
                />
                M
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  checked={formData.gender === "F"}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className="mr-2"
                />
                F
              </label>
            </div>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}
          </div>

          <div className="w-1/2">
            <label className="block text-gray-700">Courses</label>
            <div className="flex items-center space-x-4">
              {["MCA", "BCA", "BSC"].map((course) => (
                <label key={course} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="courses"
                    value={course}
                    checked={formData.courses.includes(course)}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className="mr-2"
                  />
                  {course}
                </label>
              ))}
            </div>
            {errors.courses && (
              <p className="text-red-500 text-sm">{errors.courses}</p>
            )}
          </div>
        </div>

        {/* Upload Image and Creation Date in one row */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.image && (
              <p className="text-red-500 text-sm">{errors.image}</p>
            )}
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="w-1/2">
            <label className="block text-gray-700">Creation Date</label>
            <input
              type="date"
              name="createDate"
              value={formData.createDate}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.createDate && (
              <p className="text-red-500 text-sm">{errors.createDate}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {id ? "Update Employee" : "Create Employee"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployee;
