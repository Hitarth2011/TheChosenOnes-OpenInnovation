import "./App.css";

function App() {
  return (
    <div className="app">

      {/* login */}
      <div className="login">
        <button>Login</button>
      </div>

      {/* background doodles */}
      <div className="doodle circle1"></div>
      <div className="doodle circle2"></div>
      <div className="doodle square1"></div>
      <div className="doodle square2"></div>
      <div className="doodle ring1"></div>
      <div className="doodle ring2"></div>

      {/* HERO */}
      <section className="hero">
        <h1>The Future of Guidance</h1>
        <p>
          Where experience meets intelligence and ambition meets direction.
        </p>
        <button className="exploreBtn"> Explore Platform </button>
      </section>

      {/* STUDENTS */}
      <section className="section">
        <div className="card">
          <span className="badge students">FOR STUDENTS</span>
          <h2>Clarity in the Age of Confusion</h2>
          <p>
            Students face endless choices but little direction. Our intelligent system analyzes interests,
            achievements and ambitions to provide structured career guidance and decision clarity.
          </p>
        </div>
      </section>

      {/* MENTORS */}
      <section className="section">
        <div className="card">
          <span className="badge mentors">FOR MENTORS</span>
          <h2>Experience Should Never Retire</h2>
          <p>
            Decades of professional experience should not disappear after retirement. Mentors can guide
            ambitious individuals and turn knowledge into real impact for the next generation.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="featureCard">
          <h3>AI Career Intelligence</h3>
          <p>
            Smart analysis of goals, interests and academic data to generate personalized career pathways.
          </p>
        </div>

        <div className="featureCard">
          <h3>Mentorship Network</h3>
          <p>
            Connect students with experienced professionals who provide real-world career insights.
          </p>
        </div>

        <div className="featureCard">
          <h3>Skill Gap Detection</h3>
          <p>
            Identify missing skills and receive targeted recommendations to improve readiness.
          </p>
        </div>

        <div className="featureCard">
          <h3>Opportunity Discovery</h3>
          <p>
            Discover internships, projects and growth opportunities aligned with your strengths.
          </p>
        </div>
      </section>

      {/* SYSTEM */}
      <section className="section">
        <div className="card">
          <span className="badge system">INTELLIGENT SYSTEM</span>
          <h2>Where Data Meets Destiny</h2>
          <p>
            Insights are tracked through active users, time spent, interaction frequency, ratings and
            feedback — improving confidence and helping individuals achieve meaningful educational
            and career outcomes.
          </p>
        </div>
      </section>

      {/* IMPACT */}
      <section className="section">
        <div className="card">
          <span className="badge system">
            IMPACT
          </span>

          <h2>Transforming Potential into Progress</h2>

          <p>
            The platform measures its impact through active users,
            interaction frequency, time spent, feedback ratings
            and overall engagement. These insights reflect how
            effectively individuals gain clarity, improve decision
            confidence and successfully move toward their
            educational and career aspirations.
          </p>
        </div>
      </section>

      {/* VISION */}
      <section className="section">
        <div className="card">
          <span className="badge vision">VISION</span>
          <h2>A Bridge Between Generations</h2>
          <p>
            A world where no student feels lost and no experience goes unused.
            A platform where ambition meets wisdom and futures are guided
            by intelligence and experience.
          </p>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="section">
        <div className="card">

          <span className="badge students">
            GET STARTED
          </span>

          <h2>Your Future Deserves Direction</h2>

          <p>
            Whether you are a student searching for clarity
            or a professional ready to share experience,
            this platform brings ambition and wisdom together.
            Join the ecosystem that transforms uncertainty
            into opportunity and guidance into success.
          </p>

          <button className="exploreBtn">
            Begin Your Journey
          </button>

        </div>
      </section>

    </div>
  );
}

export default App;