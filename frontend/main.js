const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [currentView, setCurrentView] = React.useState("login");

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Student Management System</h1>

      {!isLoggedIn ? (
        <>
          <div className="mb-3">
            <button
              className={`btn ${
                currentView === "login" ? "btn-primary" : "btn-outline-primary"
              } me-2`}
              onClick={() => setCurrentView("login")}
            >
              Login
            </button>
            <button
              className={`btn ${
                currentView === "register"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setCurrentView("register")}
            >
              Register
            </button>
          </div>

          {currentView === "login" ? (
            <LoginForm setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <RegisterForm setCurrentView={setCurrentView} />
          )}
        </>
      ) : (
        <Dashboard />
      )}
    </div>
  );
};

const LoginForm = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [error, setError] = React.useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5002/api/auth/login",
        formData
      );

      if (res.data.success) {
        setIsLoggedIn(true);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title text-center">Admin Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const RegisterForm = ({ setCurrentView }) => {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5002/api/auth/register",
        formData
      );
      setSuccess("Registration successful! You can now log in.");
      setError("");

      setTimeout(() => {
        setCurrentView("login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
      setSuccess("");
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title text-center">Admin Registration</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="reg-email" className="form-label">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="reg-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="reg-password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="reg-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [students, setStudents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5002/api/students");
      setStudents(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching students:", err);
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`http://localhost:5002/api/students/${id}`);
        fetchStudents();
      } catch (err) {
        console.error("Error deleting student:", err);
      }
    }
  };

  return (
    <div>
      <div className="row mb-4">
        <div className="col-md-12">
          <h2>Dashboard</h2>
          <AddStudentForm fetchStudents={fetchStudents} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <h3>Student List</h3>
          {loading ? (
            <p>Loading students...</p>
          ) : students.length === 0 ? (
            <p>No students found. Add a student to get started.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll Number</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Semester</th>
                    <th>Program</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.rollNumber}</td>
                      <td>{student.email}</td>
                      <td>{student.phoneNumber}</td>
                      <td>{student.currentSemester}</td>
                      <td>{student.program}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteStudent(student._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AddStudentForm = ({ fetchStudents }) => {
  const [formData, setFormData] = React.useState({
    name: "",
    rollNumber: "",
    email: "",
    phoneNumber: "",
    currentSemester: "",
    program: "B.Tech CSE",
  });
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5002/api/students", formData);
      setSuccess("Student added successfully!");
      setError("");

      setFormData({
        name: "",
        rollNumber: "",
        email: "",
        phoneNumber: "",
        currentSemester: "",
        program: "B.Tech CSE",
      });

      fetchStudents();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to add student");
      setSuccess("");
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h4 className="card-title">Add New Student</h4>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="rollNumber" className="form-label">
                Roll Number
              </label>
              <input
                type="text"
                className="form-control"
                id="rollNumber"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="currentSemester" className="form-label">
                Current Semester
              </label>
              <input
                type="number"
                className="form-control"
                id="currentSemester"
                name="currentSemester"
                min="1"
                max="8"
                value={formData.currentSemester}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="program" className="form-label">
                Program
              </label>
              <select
                className="form-select"
                id="program"
                name="program"
                value={formData.program}
                onChange={handleChange}
                required
              >
                <option value="B.Tech CSE">B.Tech CSE</option>
                <option value="B.Tech ECE">B.Tech ECE</option>
                <option value="B.Com General">B.Com General</option>
                <option value="B.Com Honors">B.Com Honors</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Add Student
          </button>
        </form>
      </div>
    </div>
  );
};

const rootElement = document.getElementById("root");

if (ReactDOM.createRoot) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
} else {
  ReactDOM.render(<App />, rootElement);
}
