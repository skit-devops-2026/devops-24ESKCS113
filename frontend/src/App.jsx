import React, { useState, useEffect } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

// Sample student profiles
const sampleStudents = [
  {
    _id: "1",
    name: "Aarav Sharma",
    college: "SKIT Jaipur",
    offeredSkills: ["HTML", "CSS"],
    requiredSkills: ["JavaScript", "React"]
  },
  {
    _id: "2",
    name: "Priya Verma",
    college: "SKIT Jaipur",
    offeredSkills: ["Python", "Data Analysis"],
    requiredSkills: ["Web Design", "React"]
  },
  {
    _id: "3",
    name: "Kabir Singh",
    college: "Jaipur Engineering College",
    offeredSkills: ["React", "JavaScript"],
    requiredSkills: ["Python", "UI Design"]
  }
];

// Navbar
function Navbar() {
  return (
    <nav className="navbar">
      <Link className="brand" to="/">
        SkillSwapify
      </Link>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/profile">My Profile</NavLink>
        <NavLink to="/notifications">Notifications</NavLink>
        <NavLink to="/login">Login</NavLink>
      </div>
    </nav>
  );
}

// Footer
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <Link className="footer-brand" to="/">
          SkillSwapify
        </Link>

        <p>
          Share your skills, learn something new, and grow together.
        </p>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/profile">My Profile</Link>
          <Link to="/notifications">Notifications</Link>
          <Link to="/login">Login</Link>
        </div>

        <p className="footer-bottom">
          © {new Date().getFullYear()} SkillSwapify. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// Home page
function Home() {
  const [students, setStudents] = useState(sampleStudents);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${API}/students`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setStudents(response.data);
        }
      })
      .catch(() => {
        // Sample students remain visible if the server is unavailable.
      });
  }, []);

  const filteredStudents = students.filter((student) => {
    const details = `
      ${student.name}
      ${student.college}
      ${(student.offeredSkills || []).join(" ")}
      ${(student.requiredSkills || []).join(" ")}
    `;

    return details.toLowerCase().includes(search.toLowerCase());
  });

  function requestSkill(student) {
    setMessage(
      `Demo only: a request to ${student.name} has not been sent.`
    );
  }

  return (
    <main className="container">
      <section className="hero">
        <p className="eyebrow">LEARN • TEACH • GROW</p>

        <h1>
          Learn skills.
          <br />
          <span>Share skills.</span>
        </h1>

        <p>
          Exchange what you know with students who know
          what you want to learn.
        </p>

        <Link className="primary" to="/profile">
          Create your profile
        </Link>
      </section>

      <div className="section-head">
        <div>
          <h2>Find your skill partner</h2>
          <p>Search by student name, college, or skill.</p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search skills..."
        />
      </div>

      {message && <p className="notice">{message}</p>}

      <div className="student-grid">
        {filteredStudents.map((student) => (
          <article className="student-card" key={student._id}>
            <div className="avatar">
              {student.name.slice(0, 1).toUpperCase()}
            </div>

            <h3>{student.name}</h3>
            <p className="muted">{student.college}</p>

            <h4>Can teach</h4>

            <div className="tags">
              {(student.offeredSkills || []).map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>

            <h4>Wants to learn</h4>

            <div className="tags secondary-tags">
              {(student.requiredSkills || []).map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>

            <button
              className="primary full"
              type="button"
              onClick={() => requestSkill(student)}
            >
              Request skill (demo)
            </button>
          </article>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <p className="notice">
          No students found. Try another search.
        </p>
      )}
    </main>
  );
}

// Profile page
function Profile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "SKIT Jaipur",
    department: "",
    year: "",
    bio: "",
    interests: "",
    offeredSkills: "",
    requiredSkills: ""
  });

  const [savedProfile, setSavedProfile] = useState(null);
  const [status, setStatus] = useState("");

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    setForm({
      ...form,
      [name]: value
    });
  }

  function makeList(value) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const profile = {
      ...form,
      offeredSkills: makeList(form.offeredSkills),
      requiredSkills: makeList(form.requiredSkills),
      interests: makeList(form.interests)
    };

    setSavedProfile(profile);
    setStatus("Profile preview saved in this browser session.");

    try {
      await axios.post(`${API}/students`, profile);
      setStatus("Profile saved to the server.");
    } catch (error) {
      // The profile preview still works without the backend.
    }
  }

  function editProfile() {
    setForm({
      ...savedProfile,
      offeredSkills: savedProfile.offeredSkills.join(", "),
      requiredSkills: savedProfile.requiredSkills.join(", "),
      interests: savedProfile.interests.join(", ")
    });

    setSavedProfile(null);
    setStatus("");
  }

  if (savedProfile) {
    return (
      <main className="container narrow">
        <h1 className="page-title">Your Profile</h1>

        <section className="panel">
          <div className="avatar">
            {savedProfile.name.slice(0, 1).toUpperCase()}
          </div>

          <h2>{savedProfile.name}</h2>
          <p>{savedProfile.email}</p>

          {savedProfile.phone && (
            <p>Phone: {savedProfile.phone}</p>
          )}

          <p>{savedProfile.college}</p>

          <p>
            {savedProfile.department} · {savedProfile.year}
          </p>

          {savedProfile.bio && (
            <>
              <h3>About Me</h3>
              <p>{savedProfile.bio}</p>
            </>
          )}

          <h3>Interests</h3>
          <p>{savedProfile.interests.join(", ") || "Not added"}</p>

          <h3>Skills I Can Teach</h3>

          <div className="tags">
            {savedProfile.offeredSkills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>

          <h3>Skills I Want to Learn</h3>

          <div className="tags secondary-tags">
            {savedProfile.requiredSkills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>

          <p className="notice">{status}</p>

          <div className="profile-actions">
            <button
              className="outline"
              type="button"
              onClick={editProfile}
            >
              Edit Profile
            </button>

            <button
              className="primary"
              type="button"
              onClick={() => navigate("/")}
            >
              Go to Home
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="container narrow">
      <h1 className="page-title">Create Your Profile</h1>

      <p className="muted">
        Tell other students about yourself and the skills
        you can exchange.
      </p>

      <form className="panel form-grid" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </label>

        <label>
          Email Address
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          Phone Number
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </label>

        <label>
          College
          <input
            name="college"
            value={form.college}
            onChange={handleChange}
            placeholder="Enter your college name"
            required
          />
        </label>

        <label>
          Department / Branch
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          >
            <option value="">Select your branch</option>
            <option value="CSE">Computer Science (CSE)</option>
            <option value="IT">Information Technology (IT)</option>
            <option value="ECE">Electronics (ECE)</option>
            <option value="ME">Mechanical (ME)</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Current Year
          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            required
          >
            <option value="">Select your year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </label>

        <label>
          About You
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Write a short introduction"
            rows="3"
          />
        </label>

        <label>
          Your Interests (comma separated)
          <input
            name="interests"
            value={form.interests}
            onChange={handleChange}
            placeholder="Coding, Dance, Design"
          />
        </label>

        <label>
          Skills You Can Teach
          <input
            name="offeredSkills"
            value={form.offeredSkills}
            onChange={handleChange}
            placeholder="HTML, CSS, Java"
            required
          />
        </label>

        <label>
          Skills You Want to Learn
          <input
            name="requiredSkills"
            value={form.requiredSkills}
            onChange={handleChange}
            placeholder="React, Python, UI Design"
            required
          />
        </label>

        <button className="primary" type="submit">
          Save Profile
        </button>
      </form>
    </main>
  );
}

// Login page
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const response = await axios.post(`${API}/auth/login`, {
        email,
        password
      });

      localStorage.setItem(
        "skillswapifyToken",
        response.data.token
      );

      setStatus("Login successful. Token saved for this demo.");
    } catch (error) {
      setStatus(
        "Login needs a registered account and a running backend server."
      );
    }
  }

  return (
    <main className="container narrow">
      <h1 className="page-title">Login</h1>

      <form className="panel form-grid" onSubmit={handleLogin}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button className="primary" type="submit">
          Login
        </button>

        {status && <p className="notice">{status}</p>}

        <p className="muted">
          Login requires a registered account on the backend.
        </p>
      </form>
    </main>
  );
}

// Notifications page
function Notifications() {
  return (
    <main className="container narrow">
      <h1 className="page-title">Notifications</h1>

      <div className="panel">
        <h3>Accepted request — demo</h3>

        <p className="muted">
          Aarav accepted your sample skill exchange.
        </p>

        <Link className="primary" to="/chat">
          Open chat preview
        </Link>

        <p className="muted small">
          This is placeholder UI. It does not send real notifications.
        </p>
      </div>
    </main>
  );
}

// Chat preview page
function Chat() {
  const [messageText, setMessageText] = useState("");

  const [messages, setMessages] = useState([
    {
      from: "Aarav",
      text: "Hi! Ready to exchange skills?"
    }
  ]);

  function sendMessage(event) {
    event.preventDefault();

    if (messageText.trim() === "") {
      return;
    }

    const newMessage = {
      from: "You",
      text: messageText
    };

    setMessages([...messages, newMessage]);
    setMessageText("");
  }

  return (
    <main className="container narrow">
      <h1 className="page-title">Chat Preview</h1>

      <div className="panel chat-box">
        {messages.map((message, index) => (
          <p key={index}>
            <b>{message.from}:</b> {message.text}
          </p>
        ))}

        <form className="chat-form" onSubmit={sendMessage}>
          <input
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            placeholder="Type a demo message..."
          />

          <button className="primary" type="submit">
            Add Message
          </button>
        </form>

        <p className="muted small">
          Demo messages stay in React state only.
        </p>
      </div>
    </main>
  );
}

// Main App component
export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Home />} />
      </Routes>

      <Footer />
    </>
  );
}

