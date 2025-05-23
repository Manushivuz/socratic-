from flask import Flask,jsonify,request
import os
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv()

api_key = os.getenv('API_KEY')
genai.configure(api_key=api_key)

# Set up generation configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Initialize the generative model
model = genai.GenerativeModel(
    model_name="tunedModels/dsasocraticexamples-lu4fbkyf4xks",
    generation_config=generation_config,
)

# Create Flask app
app = Flask(__name__)


# Store active chat session
def create_chat_session():
    return model.start_chat(history=[])

# Start the first chat session
chat_session = create_chat_session()

bot_session = create_chat_session()

# API to handle chat messages
current_conversation_id = None


def generate_chat_title(user_message):
    title_prompt = f"Generate a chat title for the following message dont include question marks or give options a proper chat title never use same words for each prompt keep switching it , create proper spacing while generating title {user_message}"
    title_response = chat_session.send_message(title_prompt)
    return title_response.text.strip()

@app.route('/chatprompt', methods=['POST'])
def mlprompt():
    global chat_session, current_conversation_id
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        istrigger = data.get('trigger')
        if(istrigger):
            chat_session = create_chat_session()
        response = chat_session.send_message(user_message)
        print(response.text)
        return jsonify({'response': response.text}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
 
@app.route('/getbotres', methods=['POST'])
def botprompt():
    global bot_session, current_conversation_id
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        istrigger = data.get('trigger')
        if(istrigger):
            bot_session = create_chat_session()
        response = bot_session.send_message(user_message) 
        print(response.text)
        return jsonify({'response': response.text}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
        
@app.route('/gettitle', methods=['POST'])
def titleprompt():
    global chat_session, current_conversation_id
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        print("user msg: ",user_message)
        chat_title = generate_chat_title(user_message)
        print(chat_title);
        return jsonify({'title': chat_title}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
        
        
        
        
if __name__ == '__main__':
    app.run(debug=True,port = 5001)



"""
@app.route('/api/conversations', methods=['GET'])
def get_conversations():
    try:
        user_id = str(session.get('userId'))

        # Return an empty list if the user is not logged in
        if not user_id:
            return jsonify([]), 200

        # Find conversations for the user and retrieve only the first message's user text of each
        conversations = mongo.db.conversations.find(
            {"userId": user_id},
            {"conversations.conversationId": 1, "conversations.messages": {"$slice": 1}}
        )

        # Format the conversations for the sidebar
        chat_list = []
        for chat in conversations:
            for convo in chat.get("conversations", []):
                first_message = convo.get("messages", [{}])[0].get("user", "")
                chat_list.append({
                    "conversationId": str(convo["conversationId"]),
                    "firstMessage": first_message[:30]  # Show only the first 30 characters
                })
        
        return jsonify(chat_list), 200

    except Exception as e:
        return jsonify({'error': 'An error occurred while retrieving chats.'}), 500



@app.route('/api/conversation/<chatId>', methods=['GET'])
def get_conversation_by_id(chatId):
    try:
        # Retrieve the user's ID from the session
        user_id = session.get('userId')
        
        # If the user is not logged in, return an empty conversation to simulate a guest experience
        if not user_id:
            return jsonify({"conversation": []}), 200  # Empty conversation for guest users
        
        # Ensure the ObjectId is formatted correctly and fetch the conversation by conversationId and userId
        conversation = mongo.db.conversations.find_one(
            {"userId": user_id, "conversations.conversationId": chatId},
            {"conversations.$": 1}  # Only retrieve the matching conversation
        )
        
        # If the conversation is found, return it
        if conversation and "conversations" in conversation:
            conversation_data = conversation["conversations"][0]
            return jsonify({
                "conversation": conversation_data.get("messages", [])
            }), 200
        else:
            # If no matching conversation is found, return a 404 response
            return jsonify({"error": "Conversation not found"}), 404

    except Exception as e:
        return jsonify({"error": "An error occurred while fetching the conversation."}), 500

@app.route('/api/start_new_conversation', methods=['POST'])
def start_new_conversation():
    global chat_session, current_conversation_id
    chat_session = create_chat_session()  # Initialize or reset chat session

    # Check if the user is logged in by looking for `userId` in the session
    user_id = session.get('userId')
    
    # Generate a new conversation ID if the user is logged in, to save the conversation
    if user_id:
        current_conversation_id = str(ObjectId())  # Create new ID only for logged-in users
        
        # Check if user already has a conversation document
        existing_user = mongo.db.conversations.find_one({"userId": user_id})
        
        if existing_user:
            # If conversations field is empty or doesn't exist, initialize it
            if "conversations" not in existing_user or not existing_user["conversations"]:
                mongo.db.conversations.update_one(
                    {"userId": user_id},
                    {"$set": {"conversations": []}}  # Initialize empty conversations array
                )
            # Add the new conversation
            mongo.db.conversations.update_one(
                {"userId": user_id},
                {"$push": {"conversations": {"conversationId": current_conversation_id, "messages": []}}}
            )
        else:
            # Create new user document with empty conversations
            mongo.db.conversations.insert_one({
                "userId": user_id,
                "conversations": [{
                    "conversationId": current_conversation_id,
                    "messages": []
                }]
            })

    else:
        # For guest users, set current_conversation_id to None
        current_conversation_id = None

    return jsonify({
        "_id": current_conversation_id,  # Return the new conversation ID or None
        "message": "New conversation started"  # Confirm conversation started
    }), 200



@app.route('/api/conversation/<chatId>', methods=['DELETE'])
def delete_conversation(chatId):
    try:
        # Retrieve the user's ID from the session
        user_id = session.get('userId')
        if not user_id:
            return jsonify({"error": "Unauthorized access"}), 401  # Unauthorized if not logged in

        # Find the user’s document that contains conversations
        user_conversations = mongo.db.conversations.find_one({"userId": user_id})

        if user_conversations:
            # Find the index of the conversation with the provided chatId
            conversation_to_delete = None
            for conversation in user_conversations.get("conversations", []):
                if str(conversation["conversationId"]) == chatId:
                    conversation_to_delete = conversation
                    break
            
            if conversation_to_delete:
                # Delete the conversation from the user's document
                mongo.db.conversations.update_one(
                    {"_id": user_conversations["_id"]},
                    {"$pull": {"conversations": {"conversationId": chatId}}}
                )
                return jsonify({"message": "Conversation deleted successfully"}), 200
            else:
                return jsonify({"error": "Conversation not found or access denied"}), 404
        else:
            return jsonify({"error": "User not found"}), 404

    except Exception as e:
        return jsonify({"error": "An error occurred while deleting the conversation."}), 500



@app.route('/register', methods=['POST'])
def register():
    print('am here',flush=True)
    # Get the JSON data from the request
    name = request.json.get('name')
    email = request.json.get('email')
    password = request.json.get('password')

    # Check for missing data
    if not name or not email or not password:
        return jsonify({"message": "Missing data"}), 400

    # Check if user already exists
    if mongo.db.employees.find_one({"name": name}):
        return jsonify({"message": "User already exists"}), 400

    # Hash the password before storing
    hashed_password = generate_password_hash(password)

    try:
        # Create new employee (user)
        employee_data = {
            "name": name,
            "email": email,
            "password": hashed_password
        }
        result = mongo.db.employees.insert_one(employee_data)
        print(result.inserted_id)

        # Create a conversation document for the user
        try:
            result = mongo.db.conversations.insert_one({
                "userId": str(result.inserted_id),  # Link the conversation to the newly created user
                "conversation": []  # Start with an empty conversation list
            })
            print("Conversation document created:", result.inserted_id)
        except Exception as e:
            print(f"Error inserting conversation document: {e}")

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        print(f"Error occurred: {e}")  # Log the error for debugging
        return jsonify({"message": "An error occurred while registering the user"}), 500


@app.route('/login', methods=['POST'])
def login():
    print("inside login")
    name = request.json.get('name')
    password = request.json.get('password')
    
    print(f"Received Name: {name}, Password: {password}")  # Debugging line

    # Retrieve user document from MongoDB
    user = mongo.db.employees.find_one({"name": name})

    print(f"User Found: {user}")  # Debugging line
    
    # Check if user exists and password is correct
    if user and check_password_hash(user['password'], password):
        # Store userId in the session for future requests
        session['userId'] = str(user['_id'])  # Assuming `_id` is the unique identifier
        print('session id is set to:',str(user['_id']))

        return jsonify({
            "message": "Success",
            "user": {
                "name": user['name'],
                "email": user['email']
            }
        }), 200

    # Return error if authentication fails
    return jsonify({"message": "Invalid username or password"}), 401



@app.route('/logout', methods=['OPTIONS'])
def logout():
	session.pop("userId", None)
	return '<h1>Session deleted!</h1>'

"""
