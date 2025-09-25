# Use a lightweight Python 3.9 image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /code

# Copy and install dependencies
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy your application code
COPY . /code/

# Expose port 8000 for the app
EXPOSE 8000

# Command to start the Gunicorn server
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:app"]