FROM ultralytics/ultralytics:latest-jetson-jetpack4
# FROM nvidia/cuda:11.3.1-base-ubuntu18.04 

WORKDIR /python-server

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

# RUN wget https://nvidia.box.com/shared/static/cs3xn3td6sfgtene6jdvsxlr366m2dhq.whl -O torch-1.7.0-cp36-cp36m-linux_aarch64.whl
# RUN pip install 'Cython<3'
# RUN pip install torch-1.7.0-cp36-cp36m-linux_aarch64.whl

COPY . .

ENV ROBOFLOW_API_KEY=FlWb1hTgAsBf3qK4jJmx
ENV INFERENCE_SERVER_URL=http://inference-server:9001

CMD [ "flask", "run", "-p", "5001", "--host=0.0.0.0"]