const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static(path.join(__dirname)));

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Automatically create the table if it doesn't exist yet
        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    
    const sql = 'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)';
    
    db.run(sql, [name, email, subject, message], function(err) {
        if (err) {
            console.error('Error inserting data: ', err);
            return res.status(500).send('An error occurred while sending your message.');
        }
        
        console.log('New query saved from:', name);
        
        // Success page
        res.send(`
            <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
                <h2 style="color: #3b82f6;">Message Sent Successfully!</h2>
                <p>Thank you, <strong>${name}</strong>. Our admin team will look into your query.</p>
                <a href="/" style="color: #06b6d4; text-decoration: none;">&larr; Go back to the homepage</a>
            </div>
        `);
    });
});


app.get('/admin', (req, res) => {
    db.all('SELECT * FROM contacts ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).send('Error reading database.');
        }

        let html = `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2>Admin Dashboard - User Queries</h2>
                <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%; text-align: left;">
                    <tr style="background-color: #f3f4f6;">
                        <th>Date</th><th>Name</th><th>Email</th><th>Service</th><th>Message</th>
                    </tr>
        `;
        
        rows.forEach(row => {
            html += `<tr>
                <td>${row.created_at}</td>
                <td>${row.name}</td>
                <td>${row.email}</td>
                <td>${row.subject}</td>
                <td>${row.message}</td>
            </tr>`;
        });
        
        html += `</table><br><a href="/" style="color: #3b82f6;">Back to Website</a></div>`;
        res.send(html);
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});