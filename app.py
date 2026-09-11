from flask import Flask, jsonify, render_template
import sqlite3
from datetime import datetime, date

app = Flask(__name__)
DB_FILE = "feedings.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS feedings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def get_last_feeding():
    conn = sqlite3.connect(DB_FILE)
    row = conn.execute("SELECT timestamp FROM feedings ORDER BY id DESC LIMIT 1").fetchone()
    conn.close()
    return datetime.fromisoformat(row[0]) if row else None

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/status")
def status():
    last = get_last_feeding()
    if last and last.date() == date.today():
        return jsonify({"fed_today": True, "time": last.strftime("%H:%M")})
    return jsonify({"fed_today": False, "time": None})

@app.route("/api/feed", methods=["POST"])
def feed():
    conn = sqlite3.connect(DB_FILE)
    conn.execute("INSERT INTO feedings (timestamp) VALUES (?)", (datetime.now().isoformat(),))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
    