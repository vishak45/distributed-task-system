from rq import Worker
from redis import Redis
from processor import process_spam_detection
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == '__main__':
    try:
        redis_conn = Redis(host='redis', port=6379)  # No decode_responses for RQ
        redis_conn.ping()  # Test connection
        logger.info("Connected to Redis")
        
        worker = Worker(['python-spam'], connection=redis_conn)
        logger.info("Python Spam Detection Worker started, listening on 'python-spam' queue...")
        worker.work()  # Continuously checks queue and processes jobs
        
    except Exception as e:
        logger.error(f"Worker failed to start: {e}")
        raise