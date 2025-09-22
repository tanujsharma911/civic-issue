

# 🏙️ Civic Issue Reporting & Resolution System  

A crowdsourced civic issue reporting platform built under the **Smart India Hackathon 2025**.  
Our solution helps citizens report civic problems (like garbage, broken roads, sewage), while municipalities can verify, assign, and resolve issues more efficiently.  

---

## 🚩 Problem Statement  
Citizens often face issues like uncollected garbage, broken infrastructure, and sewage problems.  
Current reporting systems are:  
- Slow in response.  
- Filled with duplicate/unverified complaints.  
- Difficult for municipalities to manage ward-level assignments.  

---

## 💡 Our Solution  
We developed an **AI-powered, citizen-friendly web app** where:  
- Citizens can **report issues with photos & location (auto geo-tagging)**.  
- AI verifies the issue using **Visual Question Answering (VQA)** models.  
- System auto-assigns issue to the **correct ward (via LGD codes)** and notifies municipal officers.  
- Dashboard for municipalities to track, assign (Field Engineers), and resolve complaints.  
- Ranking system for **states, cities, and wards** based on resolution rate.  

---

## ✨ Features  
✔️ **AI Verification** – Detects real vs fake complaints.  
✔️ **Duplicate Detection** – Prevents spam & saves time.  
✔️ **Ward Mapping (LGD Codes)** – Automatically routes to the correct ward.  
✔️ **Predictive Analysis** – Forecasts future issues.  
✔️ **Status Tracking System** – Citizens can track their complaint in real time.  
✔️ **Ranking System** – Compares cities/wards based on resolution rate.  
✔️ **User-Friendly Interface** – Simple for citizens, powerful for municipalities.  

---

## 🛠️ Tech Stack  
- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Python, Flask
- **Database:** Supabase (Postgres)  
- **AI Models:** Hugging Face (ViLT for VQA, Duplicate Detection)  
- **Other Tools:** Capacitor.js (mobile integration), GitHub Actions (CI/CD)  

---

## ⚙️ Installation & Setup  
Run all line by line

### 1. Create folder and open terminal in that folder
```bash
git clone https://github.com/your-username/civic-issue-system.git .
```
### 2. Start frontend
```bash
cd frontend
npm run dev
```
### For mac users 🍎
```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```
### For windows 💻
```bash
cd server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```