from pymongo import MongoClient

'''
Structure of Project entry:
Project = {
    'projectName': projectName,  # Name of the project
    'projectId': projectId,      # Unique identifier for the project
    'description': description,  # Description of the project
    'hwSets': {                  # Dictionary of hardware sets associated with the project
        'HWset1': {'capacity': 100, 'availability': 100},  # Capacity and availability of HWset1
        'HWset2': {'capacity': 100, 'availability': 100}   # Capacity and availability of HWset2
    }
}
'''

# Function to query a project by its ID
def queryProject(client, projectId):
    """
    Query a project from the database using its projectId.

    Args:
        client (MongoClient): MongoDB client for database connection.
        projectId (str): The unique ID of the project to query.

    Returns:
        dict: The project document if found, or None if not found.
    """
    db = client['User_DB']  # Access the database named 'User_DB'
    projects = db['projects']  # Access the 'projects' collection
    project = projects.find_one({'projectId': projectId})  # Find the project by projectId
    return project  # Return the project document (or None if not found)

# Function to create a new project
def createProject(client, userId, projectName, projectId, description):
    """
    Create a new project and associate it with a user.

    Args:
        client (MongoClient): MongoDB client for database connection.
        userId (str): The ID of the user creating the project.
        projectName (str): The name of the project.
        projectId (str): The unique ID for the project.
        description (str): Description of the project.

    Returns:
        tuple: (bool, str) indicating success and a message.
    """
    db = client['User_DB']  # Access the database named 'User_DB'
    projects = db['projects']  # Access the 'projects' collection
    users = db['users']  # Access the 'users' collection

    # Check if a project with the same projectId already exists
    existing_project = projects.find_one({'projectId': projectId})
    if existing_project:
        return False, 'Project already exists'

    # Define the new project structure
    project = {
        'projectName': projectName,
        'projectId': projectId,
        'description': description,
        'hwSets': {  # Initialize hardware sets with default capacities and availabilities
            'HWset1': {'capacity': 100, 'availability': 100},
            'HWset2': {'capacity': 100, 'availability': 100}
        }
    }

    # Insert the project into the 'projects' collection
    result = projects.insert_one(project)
    if result.inserted_id:
        # Add the projectId to the user's 'joiningPJ' field
        users.update_one(
            {'userId': userId},
            {'$addToSet': {'joiningPJ': projectId}}
        )
        return True, 'Project created and added to user joiningPJ.'
    else:
        return False, 'Failed to create project.'

# Function to check out hardware from a project
def checkOutHW(client, projectId, hwSetName, qty):
    """
    Check out hardware from a project.

    Args:
        client (MongoClient): MongoDB client for database connection.
        projectId (str): The ID of the project.
        hwSetName (str): The name of the hardware set.
        qty (int): The quantity to check out.

    Returns:
        bool: True if successful, False otherwise.
    """
    db = client['User_DB']  # Access the database named 'User_DB'
    projects = db['projects']  # Access the 'projects' collection
    
    # Find the project by projectId
    project = projects.find_one({'projectId': projectId})
    if not project:
        return False  # Project not found
    
    hwSets = project.get('hwSets', {})  # Get the hardware sets for the project
    hwSet = hwSets.get(hwSetName)  # Get the specific hardware set by name
    if not hwSet:
        return False  # Hardware set not found in the project
    
    availability = hwSet.get('availability', 0)  # Get the current availability
    if qty > availability:
        checked_out_qty = availability  # Set quantity to available amount
        hwSet['availability'] = 0  # Update availability to 0
        hwSets[hwSetName] = hwSet  # Update the hardware set in the dictionary
        projects.update_one(  # Update the project in the database
            {'projectId': projectId},
            {'$set': {'hwSets': hwSets}}
        )
        return False  # Not enough hardware available to fulfill the request
    
    # Deduct the quantity from availability
    hwSet['availability'] = availability - qty
    hwSets[hwSetName] = hwSet  # Update the hardware set
    
    # Update the project document in the database
    result = projects.update_one(
        {'projectId': projectId},
        {'$set': {'hwSets': hwSets}}
    )
    
    return result.modified_count > 0  # Return True if the update was successful

# Function to check in hardware to a project
def checkInHW(client, projectId, hwSetName, qty):
    """
    Check in hardware to a project.

    Args:
        client (MongoClient): MongoDB client for database connection.
        projectId (str): The ID of the project.
        hwSetName (str): The name of the hardware set.
        qty (int): The quantity to check in.

    Returns:
        bool: True if successful, False otherwise.
    """
    db = client['User_DB']  # Access the database named 'User_DB'
    projects = db['projects']  # Access the 'projects' collection
    
    # Find the project by projectId
    project = projects.find_one({'projectId': projectId})
    if not project:
        return False  # Project not found
    
    hwSets = project.get('hwSets', {})  # Get the hardware sets for the project
    hwSet = hwSets.get(hwSetName)  # Get the specific hardware set by name
    if not hwSet:
        return False  # Hardware set not found in the project
    
    capacity = hwSet.get('capacity', 0)  # Get the capacity of the hardware set
    availability = hwSet.get('availability', 0)  # Get the current availability
    if availability + qty > capacity:
        return False  # Cannot exceed capacity when checking in
    
    # Update availability by adding the checked-in quantity
    hwSet['availability'] = availability + qty
    hwSets[hwSetName] = hwSet  # Update the hardware set
    
    # Update the project document in the database
    result = projects.update_one(
        {'projectId': projectId},
        {'$set': {'hwSets': hwSets}}
    )
    
    return result.modified_count > 0  # Return True if the update was successful
