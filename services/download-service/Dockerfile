FROM python:3.11-slim 
WORKDIR /app
RUN apt-get update && apt-get install -y gcc
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY main.py .    
EXPOSE 8002
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]