const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [currentView, setCurrentView] = React.useState("login");
  const [userType, setUserType] = React.useState("admin"); // 'admin' or 'student'
  const [userData, setUserData] = React.useState(null);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType("admin");
    setUserData(null);
    setCurrentView("login");
  };

  return (
    <div className="container-fluid p-0">
      {!isLoggedIn ? (
        <div className="row vh-100">
          {/* University Image Section - 60% */}
          <div className="col-md-7 p-0">
            <div className="h-100 d-flex align-items-center justify-content-center bg-light">
              <img
                src="https://media.getmyuni.com/azure/college-images-test/presidency-university-bangalore/exterior-images-db958af1cce9196efa2ff8b6cdc4d455.jpg"
                alt="University"
                className="img-fluid"
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Login Section - 40% */}
          <div className="col-md-5 p-5">
            <div className="h-100 d-flex flex-column justify-content-center">
              <h1 className="text-center mb-4">Student Management System</h1>

              <div className="mb-4 ">
                <div className="btn-group w-100">
                  <button
                    className={`btn ${
                      userType === "admin"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setUserType("admin")}
                  >
                    Admin
                  </button>
                  <button
                    className={`btn ${
                      userType === "student"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={() => setUserType("student")}
                  >
                    Student
                  </button>
                </div>
              </div>

              {userType === "admin" ? (
                <>
                  <div className="mb-3  d-flex justify-content-center">
                    <button
                      className={`btn ${
                        currentView === "login"
                          ? "btn-primary"
                          : "btn-outline-primary"
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
                    <LoginForm
                      setIsLoggedIn={setIsLoggedIn}
                      userType={userType}
                      setUserData={setUserData}
                    />
                  ) : (
                    <RegisterForm setCurrentView={setCurrentView} />
                  )}
                </>
              ) : (
                <LoginForm
                  setIsLoggedIn={setIsLoggedIn}
                  userType={userType}
                  setUserData={setUserData}
                />
              )}
            </div>
          </div>
        </div>
      ) : userType === "admin" ? (
        <Dashboard handleLogout={handleLogout} />
      ) : (
        <StudentDashboard userData={userData} handleLogout={handleLogout} />
      )}
    </div>
  );
};

const LoginForm = ({ setIsLoggedIn, userType, setUserData }) => {
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
      const endpoint =
        userType === "admin"
          ? "http://localhost:5002/api/auth/login"
          : "http://localhost:5002/api/students/login";

      const res = await axios.post(endpoint, formData);

      if (res.data.success) {
        if (userType === "student") {
          setUserData(res.data.student);
        }
        setIsLoggedIn(true);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title text-center">
          {userType === "admin" ? "Admin" : "Student"} Login
        </h3>
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
            {userType === "student" && (
              <small className="text-muted">
                Use the password provided by your admin
              </small>
            )}
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

const studentAttendanceData = [
  {
    slno: 1,
    course: "Data Handling and Visualization (CSE2026)",
    th: 53,
    ah: 45,
    dl: 0,
    ahdl: 45,
    ahp: "84.91 %",
    ahdlp: "84.91 %",
  },
  {
    slno: 2,
    course: "Compiler Design (CSE3077)",
    th: 54,
    ah: 40,
    dl: 0,
    ahdl: 40,
    ahp: "74.07 %",
    ahdlp: "74.07 %",
  },
  {
    slno: 3,
    course: "Front-End Full Stack Development (CSE3150)",
    th: 52,
    ah: 45,
    dl: 0,
    ahdl: 45,
    ahp: "86.54 %",
    ahdlp: "86.54 %",
  },
  {
    slno: 4,
    course: "Java Full Stack Development (CSE3151)",
    th: 53,
    ah: 48,
    dl: 0,
    ahdl: 48,
    ahp: "90.57 %",
    ahdlp: "90.57 %",
  },
  {
    slno: 5,
    course: "Natural Language Processing (CSE3188)",
    th: 54,
    ah: 49,
    dl: 0,
    ahdl: 49,
    ahp: "90.74 %",
    ahdlp: "90.74 %",
  },
  {
    slno: 6,
    course: "Data Structure and Web Development with Python (CSE3217)",
    th: 22,
    ah: 20,
    dl: 0,
    ahdl: 20,
    ahp: "90.91 %",
    ahdlp: "90.91 %",
  },
  {
    slno: 7,
    course: "CLOUD COMPUTING (CSE3343)",
    th: 51,
    ah: 46,
    dl: 0,
    ahdl: 46,
    ahp: "90.20 %",
    ahdlp: "90.20 %",
  },
  {
    slno: 8,
    course: "OPTIMIZATION TECHNIQUES (MAT2031)",
    th: 38,
    ah: 28,
    dl: 0,
    ahdl: 28,
    ahp: "73.68 %",
    ahdlp: "73.68 %",
  },
  {
    slno: 9,
    course: "Aptitude for Employability (PPS4005)",
    th: 26,
    ah: 26,
    dl: 0,
    ahdl: 26,
    ahp: "100.00 %",
    ahdlp: "100.00 %",
  },
];
const studentAttendanceTotal = {
  th: 403,
  ah: 355,
  dl: 0,
  ahdl: 355,
  ahp: "88.09 %",
  ahdlp: "88.09 %",
};

const timetable = [
  {
    day: "Monday",
    hours: [
      "Aptitude for Employability",
      "Aptitude for Employability",
      "OPTIMIZATION TECHNIQUES",
      "",
      "Front-End Full Stack Development",
      "Front-End Full Stack Development",
      "CLOUD COMPUTING",
      "CLOUD COMPUTING",
    ],
  },
  {
    day: "Tuesday",
    hours: [
      "Compiler Design",
      "Compiler Design",
      "Natural Language Processing",
      "",
      "Data Handling and Visualization",
      "Data Handling and Visualization",
      "Java Full Stack Development",
      "Java Full Stack Development",
    ],
  },
  {
    day: "Wednesday",
    hours: [
      "Front-End Full Stack Development",
      "Data Handling and Visualization",
      "",
      "",
      "Natural Language Processing",
      "Compiler Design",
      "Natural Language Processing",
      "Natural Language Processing",
    ],
  },
  {
    day: "Thursday",
    hours: [
      "Compiler Design",
      "",
      "OPTIMIZATION TECHNIQUES",
      "",
      "CLOUD COMPUTING",
      "Front-End Full Stack Development",
      "Data Handling and Visualization",
      "Java Full Stack Development",
    ],
  },
  {
    day: "Friday",
    hours: [
      "OPTIMIZATION TECHNIQUES",
      "CLOUD COMPUTING",
      "Java Full Stack Development",
      "",
      "Data Structure and Web Development with Python",
      "Data Structure and Web Development with Python",
      "Natural Language Processing",
      "Natural Language Processing",
    ],
  },
];

const resultsData = [
  {
    semesters: [
      {
        semester: "Semester 1",
        courses: [
          {
            courseCode: "CIV1008",
            courseName: "Basic Engineering Sciences",
            credits: 2,
            grade: "A",
          },
          {
            courseCode: "ENG1002",
            courseName: "Technical English",
            credits: 2,
            grade: "A",
          },
          {
            courseCode: "KAN1001",
            courseName: "Kali Kannada",
            credits: 1,
            grade: "A",
          },
          {
            courseCode: "MAT1001",
            courseName: "Calculus and Linear Algebra",
            credits: 4,
            grade: "A",
          },
          {
            courseCode: "MAT1003",
            courseName: "Applied Statistics",
            credits: 2,
            grade: "A",
          },
          {
            courseCode: "MEC1006",
            courseName: "Engineering Graphics",
            credits: 2,
            grade: "O",
          },
          {
            courseCode: "PPS1001",
            courseName: "Introduction to Soft Skills",
            credits: 1,
            grade: "A+",
          },
        ],
        creditsRegistered: 14,
        creditsCompleted: 14,
        sgpa: 8.36,
        cumulative: { creditsRegistered: 14, creditsCompleted: 14, cgpa: 8.36 },
      },
      {
        semester: "Semester 2",
        courses: [
          {
            courseCode: "CHE1018",
            courseName: "Environmental Science",
            credits: null,
            grade: "S",
          },
          {
            courseCode: "CSE1001",
            courseName: "Problem Solving using JAVA",
            credits: 3,
            grade: "B+",
          },
          {
            courseCode: "CSE1002",
            courseName: "Innovative Projects-Arduino using Embedded 'C'",
            credits: 2,
            grade: "A",
          },
          {
            courseCode: "CSE2007",
            courseName: "Web Technologies",
            credits: 3,
            grade: "A",
          },
          {
            courseCode: "ECE1001",
            courseName: "Elements of Electronics Engineering",
            credits: 4,
            grade: "B+",
          },
          {
            courseCode: "ENG2001",
            courseName: "Advanced English",
            credits: 2,
            grade: "B+",
          },
          {
            courseCode: "MAT2004",
            courseName: "Discrete Mathematical Structures",
            credits: 3,
            grade: "A+",
          },
          {
            courseCode: "PHY1002",
            courseName: "Optoelectronics and Device Physics",
            credits: 3,
            grade: "A+",
          },
          {
            courseCode: "PPS1002",
            courseName: "Soft Skills for Engineers",
            credits: 1,
            grade: "A",
          },
        ],
        creditsRegistered: 21,
        creditsCompleted: 21,
        sgpa: 7.86,
        cumulative: { creditsRegistered: 35, creditsCompleted: 35, cgpa: 8.06 },
      },
      {
        semester: "Semester 3",
        courses: [
          {
            courseCode: "CSE2007",
            courseName: "Design and Analysis of Algorithms",
            credits: 3,
            grade: "A",
          },
          {
            courseCode: "CSE2009",
            courseName: "Computer Organization and Architecture",
            credits: 3,
            grade: "A+",
          },
          {
            courseCode: "CSE2010",
            courseName: "Operating Systems",
            credits: 3,
            grade: "A",
          },
          {
            courseCode: "CSE2011",
            courseName: "Data Communications and Computer Networks",
            credits: 3,
            grade: "A",
          },
          {
            courseCode: "CSE2027",
            courseName: "Fundamentals of Data Analytics",
            credits: 3,
            grade: "A+",
          },
          {
            courseCode: "CSE2036",
            courseName: "Programming in C++",
            credits: 3,
            grade: "B+",
          },
          {
            courseCode: "CSE2066",
            courseName: "Computer Graphics",
            credits: 3,
            grade: "A",
          },
          {
            courseCode: "ECE2011",
            courseName: "Innovative Projects Using Raspberry Pi",
            credits: 1,
            grade: "O",
          },
          {
            courseCode: "MAT2003",
            courseName: "Numerical Methods for Engineers",
            credits: 2,
            grade: "A+",
          },
          {
            courseCode: "MGT2023",
            courseName: "People Management",
            credits: 3,
            grade: "B+",
          },
          {
            courseCode: "PPS4004",
            courseName: "Aptitude Training - Intermediate",
            credits: 1,
            grade: "O",
          },
        ],
        creditsRegistered: 28,
        creditsCompleted: 28,
        sgpa: 8.21,
        cumulative: { creditsRegistered: 86, creditsCompleted: 86, cgpa: 8.41 },
      },
    ],
  },
];

const StudentDashboard = ({ userData, handleLogout }) => {
  const [currentView, setCurrentView] = React.useState("profile");
  const [studentData, setStudentData] = React.useState(userData);
  const [loading, setLoading] = React.useState(false);
  const [selectedSem, setSelectedSem] = React.useState("");
  const [semesterData, setSemesterData] = React.useState(null);

  React.useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5002/api/students/profile/${userData._id}`
      );
      setStudentData(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setLoading(false);
    }
  };

  const handleSemesterChange = (e) => {
    const sem = e.target.value;
    setSelectedSem(sem);
    setSemesterData(null);

    if (sem) {
      const selectedSemester = resultsData[0].semesters.find(
        (s) => s.semester === sem
      );
      setSemesterData(selectedSemester || null);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand">Student Dashboard</span>
          <div className="d-flex">
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Menu</h5>
                <div className="list-group">
                  <button
                    className={`list-group-item list-group-item-action ${
                      currentView === "profile" ? "active" : ""
                    }`}
                    onClick={() => setCurrentView("profile")}
                  >
                    Profile
                  </button>
                  <button
                    className={`list-group-item list-group-item-action ${
                      currentView === "attendance" ? "active" : ""
                    }`}
                    onClick={() => setCurrentView("attendance")}
                  >
                    Attendance
                  </button>
                  <button
                    className={`list-group-item list-group-item-action ${
                      currentView === "timetable" ? "active" : ""
                    }`}
                    onClick={() => setCurrentView("timetable")}
                  >
                    Timetable
                  </button>
                  <button
                    className={`list-group-item list-group-item-action ${
                      currentView === "results" ? "active" : ""
                    }`}
                    onClick={() => setCurrentView("results")}
                  >
                    Results
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-9">
            {loading ? (
              <p>Loading...</p>
            ) : currentView === "profile" ? (
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Profile</h3>
                  <div className="row">
                    <div className="col-md-6">
                      <p>
                        <strong>Name:</strong> {studentData?.name}
                      </p>
                      <p>
                        <strong>Roll Number:</strong> {studentData?.rollNumber}
                      </p>
                      <p>
                        <strong>Email:</strong> {studentData?.email}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Phone Number:</strong>{" "}
                        {studentData?.phoneNumber}
                      </p>
                      <p>
                        <strong>Current Semester:</strong>{" "}
                        {studentData?.currentSemester}
                      </p>
                      <p>
                        <strong>Program:</strong> {studentData?.program}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : currentView === "attendance" ? (
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Attendance</h3>
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>SL.NO</th>
                          <th>COURSE NAME</th>
                          <th>TH</th>
                          <th>AH</th>
                          <th>DL</th>
                          <th>AH + DL</th>
                          <th>AH%</th>
                          <th>AH+DL%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentAttendanceData.map((row) => (
                          <tr key={row.slno}>
                            <td>{row.slno}</td>
                            <td>{row.course}</td>
                            <td>{row.th}</td>
                            <td>{row.ah}</td>
                            <td>{row.dl}</td>
                            <td>{row.ahdl}</td>
                            <td>{row.ahp}</td>
                            <td>{row.ahdlp}</td>
                          </tr>
                        ))}
                        <tr style={{ fontWeight: "bold" }}>
                          <td colSpan={2}>Total</td>
                          <td>{studentAttendanceTotal.th}</td>
                          <td>{studentAttendanceTotal.ah}</td>
                          <td>{studentAttendanceTotal.dl}</td>
                          <td>{studentAttendanceTotal.ahdl}</td>
                          <td>{studentAttendanceTotal.ahp}</td>
                          <td>{studentAttendanceTotal.ahdlp}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {studentAttendanceData.filter(
                    (row) => parseFloat(row.ahp) < 75
                  ).length > 0 && (
                    <div className="mt-4">
                      <h5>Attendance Tracker</h5>
                      {studentAttendanceData
                        .filter((row) => parseFloat(row.ahp) < 75)
                        .map((row) => {
                          // Find subject name for timetable matching
                          const courseName = row.course.split(" (")[0].trim();
                          // Count remaining periods in timetable
                          let periodsLeft = 0;
                          timetable.forEach((day) => {
                            periodsLeft += day.hours.filter(
                              (h) =>
                                h &&
                                h
                                  .toLowerCase()
                                  .includes(courseName.toLowerCase())
                            ).length;
                          });
                          // Calculate how many periods must be attended to reach 75%
                          const th = row.th;
                          const ah = row.ah;
                          const needed = Math.ceil(0.75 * th);
                          const mustAttend = Math.max(0, needed - ah);
                          return (
                            <div key={row.course} className="mb-2">
                              <div>
                                <strong>{courseName}</strong> is below 75%
                                attendance ({row.ahp}).
                              </div>
                              <div>
                                You have <strong>{periodsLeft}</strong> periods
                                left in your timetable.
                              </div>
                              <div>
                                You need to attend <strong>{mustAttend}</strong>{" "}
                                of {periodsLeft} periods in order to get above
                                75%.
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            ) : currentView === "timetable" ? (
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Timetable</h3>
                  <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>Day/Hour</th>
                          {Array.from({ length: 8 }, (_, i) => (
                            <th key={i}>Hour {i + 1}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {timetable.map((row, i) => (
                          <tr key={i}>
                            <td>
                              <strong>{row.day}</strong>
                            </td>
                            {row.hours.map((hour, j) => (
                              <td key={j} style={{ minWidth: 120 }}>
                                {hour ? (
                                  <div
                                    style={{
                                      background: "#e3f2fd",
                                      borderRadius: 6,
                                      padding: 6,
                                      fontWeight: 600,
                                    }}
                                  >
                                    {hour}
                                  </div>
                                ) : null}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : currentView === "results" ? (
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Results</h3>
                  <div className="mb-3">
                    <label htmlFor="semesterSelect" className="form-label">
                      Select Semester
                    </label>
                    <select
                      id="semesterSelect"
                      className="form-select"
                      value={selectedSem}
                      onChange={handleSemesterChange}
                    >
                      <option value="" disabled>
                        -- Choose a semester --
                      </option>
                      {resultsData[0].semesters.map((s) => (
                        <option key={s.semester} value={s.semester}>
                          {s.semester}
                        </option>
                      ))}
                    </select>
                  </div>
                  {semesterData ? (
                    <div className="table-responsive mt-4">
                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>Course Code</th>
                            <th>Course Name</th>
                            <th>Credits</th>
                            <th>Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {semesterData.courses.map((c) => (
                            <tr key={c.courseCode}>
                              <td>{c.courseCode}</td>
                              <td>{c.courseName}</td>
                              <td>{c.credits ?? "-"}</td>
                              <td>{c.grade}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <p className="mt-2">
                        <strong>SGPA:</strong> {semesterData.sgpa} |{" "}
                        <strong>Cumulative CGPA:</strong>{" "}
                        {semesterData.cumulative.cgpa}
                      </p>
                    </div>
                  ) : selectedSem ? (
                    <p>No results available for {selectedSem}</p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
const Dashboard = ({ handleLogout }) => {
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
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <span className="navbar-brand">Admin Dashboard</span>
          <div className="d-flex">
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>
      <div className="container mt-4">
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Validate form data
      if (
        !formData.name ||
        !formData.rollNumber ||
        !formData.email ||
        !formData.phoneNumber ||
        !formData.currentSemester ||
        !formData.program
      ) {
        setError("All fields are required");
        return;
      }

      const response = await axios.post(
        "http://localhost:5002/api/students",
        formData
      );

      if (response.data) {
        setSuccess("Student added successfully!");
        setFormData({
          name: "",
          rollNumber: "",
          email: "",
          phoneNumber: "",
          currentSemester: "",
          program: "B.Tech CSE",
        });
        fetchStudents();
      }
    } catch (err) {
      console.error("Error adding student:", err);
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(", "));
      } else {
        setError(err.response?.data?.msg || "Failed to add student");
      }
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
                value={formData.currentSemester}
                onChange={handleChange}
                min="1"
                max="8"
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
