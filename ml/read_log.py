import os

log_path = r"C:\Users\This PC\.gemini\antigravity-ide\brain\06f536cb-d9df-489d-b146-36250080f55f\.system_generated\tasks\task-783.log"
if os.path.exists(log_path):
    with open(log_path, "r", encoding="utf-8") as f:
        print(f.read())
else:
    print(f"Log path does not exist: {log_path}")
