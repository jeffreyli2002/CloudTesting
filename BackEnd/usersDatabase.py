from pymongo import MongoClient

# Define the database name (replace 'User_DB' with your actual database name)
temp = 'User_DB'

# Function to encrypt text
def encrypt(inputText, N, D):
    """
    Encrypts the input text by reversing it and shifting character ASCII values.

    Parameters:
    inputText (str): The text to be encrypted.
    N (int): Multiplier for shifting the ASCII values.
    D (int): Direction for shifting the ASCII values (positive or negative).

    Returns:
    str: The encrypted text.
    """
    # Reverse the input text
    reversedText = inputText[::-1]
    encryptedText = ""
    # Iterate through each character in the reversed text
    for c in reversedText:
        # Encrypt the character by shifting its ASCII value
        new_0 = chr(ord(c) + N * D)
        # Check if the new character is within a specific ASCII range
        if 34 <= ord(new_0) <= 126:
            encryptedText += new_0
        else:
            new_1 = chr((ord(new_0) % 127) + 34)
            encryptedText += new_1
    return encryptedText

# Function to decrypt text
def decrypt(encryptedText, N, D):
    """
    Decrypts the encrypted text by reversing it and shifting character ASCII values back.

    Parameters:
    encryptedText (str): The text to be decrypted.
    N (int): Multiplier for shifting the ASCII values.
    D (int): Direction for shifting the ASCII values (positive or negative).

    Returns:
    str: The decrypted text.
    """
    # Reverse the encrypted text
    reversedText = encryptedText[::-1]
    decryptedText = ""
    # Iterate through each character in the reversed text
    for c in reversedText:
        # Decrypt the character by shifting its ASCII value back
        new_0 = chr(ord(c) - N * D)
        # Check if the new character is within a specific ASCII range
        if 34 <= ord(new_0) <= 126:
            decryptedText += new_0
        else:
            new_1 = chr((ord(new_0) % 127) + 34)
            decryptedText += new_1
    return decryptedText

'''
Structure of User entry:
User = {
    'userId': userId,     # Unique identifier for the user
    'password': password, # Encrypted password
    'joiningPJ' : []      # List of projects the user is joining
}
'''

# Function to add a new user
def addUser(client, userId, password):
    """
    Adds a new user to the database with encrypted password.

    Parameters:
    client (MongoClient): The MongoDB client.
    userId (str): The unique identifier for the user.
    password (str): The user's password.

    Returns:
    tuple: (bool, str) where the first element indicates success and the second element is a message.
    """
    # Check if the same user already exists
    if __queryUser(client, userId) is not None:
        return False, 'User already exists.'
        
    # Encrypt the password
    N = 3
    D = 2
    encrypted_password = encrypt(password, N, D)
    
    # Create the user document
    User = {
        'userId': userId,
        'password': encrypted_password,  # Store encrypted password
        'joiningPJ' : []
    }

    # Insert the user into the database
    db = client[temp]
    users = db['users']
    try:
        result = users.insert_one(User)
        # Check if the user was successfully added
        if result.inserted_id:
            return True, 'User added successfully.'
        else:
            return False, 'Failed to add user.'
    except Exception as e:
        return False, f'Error: {str(e)}'

# Helper function to query a user by userId
def __queryUser(client, userId):
    """
    Queries the database for a user with a specific userId.

    Parameters:
    client (MongoClient): The MongoDB client.
    userId (str): The unique identifier for the user.

    Returns:
    dict or None: The user document if found, otherwise None.
    """
    db = client[temp]
    users = db['users']
    # Find a user with the given userId
    user = users.find_one({'userId': userId})
    return user

# Function to log in a user
def login(client, userId, password):
    """
    Authenticates a user by checking the provided password against the stored encrypted password.

    Parameters:
    client (MongoClient): The MongoDB client.
    userId (str): The unique identifier for the user.
    password (str): The user's password.

    Returns:
    tuple: (bool, str) where the first element indicates success and the second element is a message.
    """
    # Query the user by userId
    user = __queryUser(client, userId)
    if user is None:
        return False, 'User not found.'
    
    # Decrypt the stored password
    encrypted_password = user['password']
    decrypted_password = decrypt(encrypted_password, 3, 2)
    
    # Check if the provided password matches the decrypted password
    if password == decrypted_password:
        return True, 'Login successful.'
    else:
        return False, 'Incorrect password.'

# Function to allow a user to join a project
def join_project(client, userId, projectId):
    """
    Adds a project to the list of projects a user is joining.

    Parameters:
    client (MongoClient): The MongoDB client.
    userId (str): The unique identifier for the user.
    projectId (str): The unique identifier for the project.

    Returns:
    tuple: (bool, str) where the first element indicates success and the second element is a message.
    """
    db = client['User_DB']
    projects = db['projects']
    users = db['users']

    # Check if the project exists
    existing_project = projects.find_one({'projectId': projectId})
    if not existing_project:
        return False, 'Project does not exist.'

    # Check if the user exists
    user = users.find_one({'userId': userId})
    if not user:
        return False, 'User does not exist.'
    
    # Ensure the user has a 'joiningPJ' list
    if 'joiningPJ' not in user:
        user['joiningPJ'] = []

    # Check if the user has already joined the project
    if projectId in user['joiningPJ']:
        return False, 'Project already added to user joiningPJ.'
    else:
        # Add the project to the user's 'joiningPJ' list
        result = users.update_one(
            {'userId': userId},
            {'$addToSet': {'joiningPJ': projectId}}
        )
        if result.modified_count > 0:
            return True, 'Project successfully added to user joiningPJ.'
        else:
            return False, 'Failed to add project to user joiningPJ.'

# Function to get all projects a user is joining
def get_evetyPRO_user_joining(client, userId):
    """
    Retrieves all projects a user is currently joining.

    Parameters:
    client (MongoClient): The MongoDB client.
    userId (str): The unique identifier for the user.

    Returns:
    tuple: (bool, list or str) where the first element indicates success and the second element is a list of projects or an error message.
    """
    try:
        db = client[temp]
        users = db['users']
        
        # Query the user by userId
        user = users.find_one({'userId': userId})
        
        if user is None:
            return False, 'User not found.'
        
        # Retrieve the 'joiningPJ' list; return empty list if not present
        joining_projects = user.get('joiningPJ', [])
        
        return True, joining_projects
    
    except Exception as e:
        return False, f'An error occurred: {str(e)}'


