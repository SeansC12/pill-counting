FROM python:3.9-bookworm

WORKDIR /python-server

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

COPY . .

ENV ROBOFLOW_API_KEY=FlWb1hTgAsBf3qK4jJmx
ENV INFERENCE_SERVER_URL=http://inference-server:9001

CMD [ "flask", "run", "-p", "5001", "--host=0.0.0.0"]