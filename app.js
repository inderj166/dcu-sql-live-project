let db;
let defaultQuery = `SELECT nationality, COUNT(*) AS total_students
FROM students
GROUP BY nationality;`;

function esc(value) {
  return String(value).replace(/'/g, "''");
}

async function startDatabase() {
  const SQL = await initSqlJs({
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
  });
  db = new SQL.Database();

  db.run(`CREATE TABLE students (
    student_id INTEGER PRIMARY KEY,
    student_name TEXT,
    age INTEGER,
    nationality TEXT,
    degree_level TEXT,
    course TEXT,
    intake_year INTEGER
  );`);

  const first = ["Aarav","Emma","Rohan","Sophie","Arjun","Aoife","Kabir","Grace","Vihaan","Niamh"];
  const last = ["Sharma","Murphy","Khan","Kelly","Singh","Byrne","Patel","O'Brien","Kaur","Doyle"];
  const masters = ["MSc Business Analytics and AI","MSc Data Analytics","MSc Artificial Intelligence"];
  const bachelors = ["BSc Computer Science","BSc Data Science","BSc Business"];

  const insert = db.prepare("INSERT INTO students VALUES (?,?,?,?,?,?,?)");

  // Exactly 100 fictional records: 45 Irish, 55 International, 60 Master's, 40 Bachelor's.
  for (let i = 1; i <= 100; i++) {
    const nationality = i <= 45 ? "Irish" : "International";
    const degree = i <= 60 ? "Master's" : "Bachelor's";
    const course = degree === "Master's"
      ? masters[(i - 1) % masters.length]
      : bachelors[(i - 1) % bachelors.length];
    const age = degree === "Master's" ? 22 + (i % 12) : 18 + (i % 6);
    const name = `${first[(i - 1) % first.length]} ${last[Math.floor((i - 1) / first.length) % last.length]}`;
    insert.run([i, name, age, nationality, degree, course, 2026]);
  }
  insert.free();

  document.getElementById("status").textContent = "✓ Database ready — 100 fictional student records loaded.";
  updateStats();
  runQuery();
}

function updateStats() {
  const getCount = (where = "") => db.exec(`SELECT COUNT(*) AS n FROM students ${where}`)[0].values[0][0];
  document.getElementById("totalStudents").textContent = getCount();
  document.getElementById("irishStudents").textContent = getCount("WHERE nationality='Irish'");
  document.getElementById("internationalStudents").textContent = getCount("WHERE nationality='International'");
  document.getElementById("mastersStudents").textContent = getCount("WHERE degree_level=\"Master's\"");
  document.getElementById("bachelorsStudents").textContent = getCount("WHERE degree_level='Bachelor's'");
}

function runQuery() {
  const sql = document.getElementById("sqlInput").value.trim();
  const resultArea = document.getElementById("resultArea");
  if (!sql) return;
  try {
    const results = db.exec(sql);
    if (!results.length) {
      resultArea.innerHTML = "<p>Query executed successfully. No rows returned.</p>";
      return;
    }
    let html = "";
    results.forEach(result => {
      html += `<p><strong>Number of records: ${result.values.length}</strong></p><table><thead><tr>`;
      result.columns.forEach(c => html += `<th>${c}</th>`);
      html += "</tr></thead><tbody>";
      result.values.forEach(row => {
        html += "<tr>";
        row.forEach(cell => html += `<td>${cell ?? ""}</td>`);
        html += "</tr>";
      });
      html += "</tbody></table>";
    });
    resultArea.innerHTML = html;
  } catch (error) {
    resultArea.innerHTML = `<p style="color:#b91c1c"><strong>SQL Error:</strong> ${error.message}</p>`;
  }
}

document.getElementById("runBtn").addEventListener("click", runQuery);
document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("sqlInput").value = defaultQuery;
  runQuery();
});
document.querySelectorAll("[data-query]").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("sqlInput").value = button.dataset.query;
    runQuery();
    window.scrollTo({top: 0, behavior: "smooth"});
  });
});

startDatabase().catch(error => {
  document.getElementById("status").textContent = "Database failed to load: " + error.message;
});