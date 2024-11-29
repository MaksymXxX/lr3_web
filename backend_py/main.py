from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List

class TabEntry(BaseModel):
    heading: str
    details: str

class TabCollection(BaseModel):
    entries: List[TabEntry]

DATA_FILE = "tabs_storage.txt"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/tabs/save")
def save_tab_data(collection: TabCollection):
    try:
        with open(DATA_FILE, "w") as storage:
            for entry in collection.entries:
                storage.write(f"{entry.heading}%%{entry.details}\n")
        return {"message": "Data saved successfully"}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

@app.get("/api/tabs/retrieve")
def get_tab_data():
    result = []
    try:
        with open(DATA_FILE, "r") as storage:
            for line in storage:
                heading, details = line.strip().split("%%")
                result.append({"heading": heading, "details": details})
    except FileNotFoundError:
       
        return {"entries": []}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}

    return {"entries": result}
