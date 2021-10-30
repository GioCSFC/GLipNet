FROM python:3.8

WORKDIR /lipnreading-app

COPY requirements.txt . 

RUN pip install -r requirements.txt

COPY server.py .

COPY ./img ./img
COPY ./static ./static
COPY ./templates ./templates

CMD ["python", "./server.py"]