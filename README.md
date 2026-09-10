# DCU Student Analytics – Live SQL Project

A beginner-friendly SQL portfolio project that lets visitors **write and run SQL queries live in the browser**.

> ⚠️ The 100 student records are completely fictional and created only for portfolio/learning purposes. This project does not contain or represent real DCU student data.

## Features
- Live SQL editor
- Run SQL and see results immediately
- 100 fictional student records
- Count Irish and international students
- Compare Master's and Bachelor's enrolments
- Group students by course
- View SQL results in a table
- Dashboard summary cards

## Technologies
- HTML
- CSS
- JavaScript
- SQLite running in the browser using `sql.js`

## Example Queries

### Count all students
```sql
SELECT COUNT(*) AS total_students
FROM students;
```

### Count international students
```sql
SELECT COUNT(*) AS international_students
FROM students
WHERE nationality = 'International';
```

### Compare degree levels
```sql
SELECT degree_level, COUNT(*) AS total
FROM students
GROUP BY degree_level;
```

### Students by course
```sql
SELECT course, COUNT(*) AS enrolled
FROM students
GROUP BY course
ORDER BY enrolled DESC;
```

## Run locally
Download/clone the project and open `index.html`.

## Publish on GitHub Pages
1. Create a GitHub repository named `dcu-sql-live-project`
2. Upload `index.html`, `style.css`, `app.js`, and `README.md`
3. Open **Settings → Pages**
4. Under **Build and deployment**, select **Deploy from a branch**
5. Select branch `main` and folder `/ (root)`
6. Save

Your portfolio project will then have a live URL similar to:

https://github.com/inderj16)/dcu-sql-live-project/`

## Suggested GitHub repository description
**Interactive SQL Student Analytics dashboard with a live SQLite query runner built using HTML, CSS, JavaScript and sql.js.**
