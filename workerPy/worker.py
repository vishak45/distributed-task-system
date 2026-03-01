import asyncio
from bullmq import Worker
from processor import process_spam_detection
from datasetValidator import validate_dataset
import logging
import base64
import tempfile
import os

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def process_job(job, token):
    """Process incoming jobs based on queue type"""
    try:
        task = job.data
        logger.info(f"Processing job {job.id}: {task}")
        
        task_type = task.get('type')
        
        if task_type == 'email-spam':
            # Extract text input for spam detection
            text_input = task.get('data', {}).get('textInput', '')
            if not text_input:
                raise ValueError("No text input provided for spam detection")
            
            result = process_spam_detection(text_input)
            return {
                'status': 'completed',
                'taskId': task.get('id'),
                'result': result
            }
            
        elif task_type == 'dataset-validator':
            # Handle file-based validation
            file_data = task.get('data', {}).get('uploadedFile')
            if not file_data:
                raise ValueError("No file provided for dataset validation")
            
            # Decode base64 file and save temporarily
            file_buffer = base64.b64decode(file_data.get('buffer', ''))
            with tempfile.NamedTemporaryFile(mode='wb', suffix='.csv', delete=False) as f:
                f.write(file_buffer)
                temp_path = f.name
            
            try:
                result = validate_dataset(temp_path)
            finally:
                os.unlink(temp_path)  # Clean up temp file
            
            return {
                'status': 'completed',
                'taskId': task.get('id'),
                'result': result
            }
        else:
            raise ValueError(f"Unknown task type: {task_type}")
            
    except Exception as e:
        logger.error(f"Job {job.id} failed: {e}")
        raise

async def main():
    try:
        logger.info("Starting Python BullMQ workers...")
        
        # Create workers for each queue
        email_worker = Worker(
            'email-spam',
            process_job,
            {"connection": {"host": "redis", "port": 6379}}
        )
        
        validator_worker = Worker(
            'dataset-validator', 
            process_job,
            {"connection": {"host": "redis", "port": 6379}}
        )
        
        logger.info("Python workers started, listening on 'email-spam' and 'dataset-validator' queues...")
        
        # Keep workers running
        while True:
            await asyncio.sleep(1)
            
    except Exception as e:
        logger.error(f"Worker failed: {e}")
        raise

if __name__ == '__main__':
    asyncio.run(main())