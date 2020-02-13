FROM python:3-alpine3.11

RUN apk add --update gcc && \
  apk add musl-dev && \
  # Required by uWSGI
  apk add linux-headers

WORKDIR /api

COPY ./api/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ./api /api

CMD [ "python", "app.py" ]