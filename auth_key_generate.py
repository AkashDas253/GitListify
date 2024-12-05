import os
from dotenv import load_dotenv
import base64

# Load environment variables from the .env file
load_dotenv()

def xor_encode(auth_token, auth_key):
    # Ensure both are in bytes for XOR operation
    auth_token_bytes = auth_token.encode('utf-8')  # Convert the token to bytes
    auth_key_bytes = auth_key.encode('utf-8')  # Convert the key to bytes
    
    # XOR the characters and store the result
    encoded_bytes = bytearray()
    for i in range(len(auth_key_bytes)):  # Loop through the key length
        token_char = auth_token_bytes[i % len(auth_token_bytes)]  # Loop through the token if it's shorter than the key
        key_char = auth_key_bytes[i]  # Get the key byte
        encoded_bytes.append(token_char ^ key_char)  # XOR and append to the result
    
    # Return the Base64 encoded result
    return base64.b64encode(encoded_bytes).decode('utf-8')


# Load the authToken and authKey from the .env file
auth_token = os.getenv('AUTH_TOKEN')  # Retrieves the authToken from .env
auth_key = os.getenv('AUTH_KEY')      # Retrieves the authKey from .env

if auth_token and auth_key:
    # Generate XOR'd token
    xor_token = xor_encode(auth_token, auth_key)
    
    # Output the generated XOR'd token
    print("XOR'd auth token:", xor_token)
else:
    print("Error: AUTH_TOKEN or AUTH_KEY not found in the .env file.")
