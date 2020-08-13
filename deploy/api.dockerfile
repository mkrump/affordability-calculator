FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7

WORKDIR /api

COPY ./api/requirements.txt ./
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY ./api /api

CMD ["gunicorn", "main:app", "-b :5000", "-w 4", "-k uvicorn.workers.UvicornWorker"]