import os
import random
import shutil
from datetime import datetime, timedelta
from app.database import SessionLocal, engine
from app.models import Base, User, Case, Hearing, CaseNote, Evidence
from app.core.security import get_password_hash

# ===============================================================
# 🏗️ Database Init
# ===============================================================
Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ===============================================================
# 👤 Users
# ===============================================================
users_data = [
    {"email": "admin@example.com", "role": "ADMIN"},
    {"email": "registrar@example.com", "role": "REGISTRAR"},
    {"email": "judge@example.com", "role": "JUDGE"},
    {"email": "prosecutor@example.com", "role": "PROSECUTOR"},
    {"email": "civilian@example.com", "role": "CIVILIAN"},
    {"email": "civilian2@example.com", "role": "CIVILIAN"},
    {"email": "civilian3@example.com", "role": "CIVILIAN"},
]

for u in users_data:
    existing = db.query(User).filter_by(email=u["email"]).first()
    if not existing:
        user = User(
            email=u["email"],
            role=u["role"],
            password_hash=get_password_hash("password123")
        )
        db.add(user)
db.commit()

# Fetch roles for linking
admin = db.query(User).filter_by(role="ADMIN").first()
registrar = db.query(User).filter_by(role="REGISTRAR").first()
judge = db.query(User).filter_by(role="JUDGE").first()
prosecutor = db.query(User).filter_by(role="PROSECUTOR").first()
civilians = db.query(User).filter(User.role == "CIVILIAN").all()

# ===============================================================
# 📁 Ensure Evidence Directory Exists
# ===============================================================
EVIDENCE_DIR = "uploads/evidence"
os.makedirs(EVIDENCE_DIR, exist_ok=True)

# ===============================================================
# ⚖️ Create 15 Cases
# ===============================================================
case_titles = [
    "Land Dispute in Rural Area",
    "Environmental Pollution Complaint",
    "Illegal Construction Report",
    "Theft Case at Community Center",
    "Noise Disturbance by Factory",
    "Water Contamination Claim",
    "Defamation Case",
    "Breach of Contract Dispute",
    "Traffic Violation Appeal",
    "Property Ownership Dispute",
    "Animal Cruelty Report",
    "Cyber Fraud Investigation",
    "Workplace Harassment Complaint",
    "Boundary Wall Encroachment",
    "Assault Case in Market Area"
]

cases = []
for idx, title in enumerate(case_titles, 1):
    creator = random.choice(civilians)
    assigned_to = judge
    case = Case(
        title=title,
        description=f"Auto-generated case #{idx} regarding {title.lower()}",
        status=random.choice(["PENDING", "UNDER REVIEW", "CLOSED"]),
        created_by_id=creator.id,
        assigned_to_id=assigned_to.id
    )
    db.add(case)
    db.commit()
    db.refresh(case)
    cases.append(case)

print(f"✅ Seeded {len(cases)} cases")

# ===============================================================
# 🏛️ Hearings (1 per Case)
# ===============================================================
for case in cases:
    hearing = Hearing(
        case_id=case.id,
        registrar_id=registrar.id,
        judge_id=judge.id,
        scheduled_date=datetime.utcnow() + timedelta(days=random.randint(2, 30)),
        location=random.choice(["Courtroom A", "Courtroom B", "Courtroom C"]),
        status=random.choice(["SCHEDULED", "POSTPONED", "HELD"]),
        notes=f"Hearing scheduled for case '{case.title}'"
    )
    db.add(hearing)
db.commit()
print("✅ Added hearings for all cases")

# ===============================================================
# 🗒️ Case Notes (1–2 per Case)
# ===============================================================
for case in cases:
    for i in range(random.randint(1, 2)):
        author = random.choice([judge, prosecutor])
        note = CaseNote(
            case_id=case.id,
            author_id=author.id,
            note=f"Note {i+1} for case '{case.title}' — Review in progress.",
            created_at=datetime.utcnow() - timedelta(days=random.randint(0, 5))
        )
        db.add(note)
db.commit()
print("✅ Added notes for all cases")

# ===============================================================
# 📂 Evidence (1–2 per Case)
# ===============================================================
for case in cases:
    for i in range(random.randint(1, 2)):
        filename = f"evidence_case_{case.id}_{i+1}.txt"
        file_path = os.path.join(EVIDENCE_DIR, filename)

        # Create dummy evidence file
        with open(file_path, "w") as f:
            f.write(f"Dummy evidence content for {case.title} (file {i+1}).")

        # Create DB record
        evidence = Evidence(
            case_id=case.id,
            uploader_id=random.choice(civilians).id,
            filename=filename,
            filetype="text/plain",
            file_path=file_path,
            uploaded_at=datetime.utcnow()
        )
        db.add(evidence)
db.commit()
print("✅ Added evidence for all cases")

# ===============================================================
# 🎯 Finalize
# ===============================================================
db.close()
print("🎉 Database seeded with 15 cases, hearings, notes, and evidence successfully!")
