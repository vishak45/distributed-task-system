FROM python:3.9

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir pandas redis bullmq joblib scikit-learn

CMD ["python", "worker.py"]
