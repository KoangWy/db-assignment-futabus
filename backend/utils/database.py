import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def db_connection():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    ssl_cert_path = os.path.join(os.path.dirname(current_dir), "ca.pem")
    
    print(f"Connecting to DB at {os.getenv('DB_HOST')} with SSL: {ssl_cert_path}")

    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("PORT"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        ssl_ca=ssl_cert_path,
        ssl_verify_cert=True
    )