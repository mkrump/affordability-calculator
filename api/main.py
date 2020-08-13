import sys

import uvicorn as uvicorn
from fastapi import FastAPI

from config import settings
from routes import income_dist

app = FastAPI()
if settings.census_api_key is None:
    raise sys.exit("census_api_key required")

app.include_router(income_dist.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
