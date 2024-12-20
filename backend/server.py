from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from dotenv import load_dotenv
import uuid
import os

# Load environment variables from .env
load_dotenv()

# Initialize Flask
app = Flask(__name__)
CORS(app)

# MySQL Configurations from .env
app.config['MYSQL_HOST'] = 'localhost'        
app.config['MYSQL_USER'] = 'root'             
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = 'eventApp'           
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')         

# Initialize MySQL
mysql = MySQL(app)

# ---------------------- USER ENDPOINTS ----------------------

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM EUser WHERE username=%s AND password=%s", (username, password))
        user = cur.fetchone()

        if user:
            return jsonify({"message": "Login successful", "user": username}), 200
        else:
            return jsonify({"error": "Invalid username or password"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Fetch All Users Endpoint
@app.route('/api/get_users', methods=['GET'])
def get_users():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT username FROM EUser")
        users = cur.fetchall()

        if not users:
            return jsonify({"error": "No users found"}), 404

        user_list = [{"username": user[0]} for user in users]
        return jsonify({"users": user_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




# Add Subscription API Endpoint
@app.route('/api/subscribe_event', methods=['POST'])
def subscribe_event():
    try:
        data = request.json
        eventName = data.get('eventName')
        userName = data.get('userName')

        if not eventName or not userName:
            return jsonify({"error": "Event name and username are required"}), 400

        cur = mysql.connection.cursor()

        # Verify user and event existence
        cur.execute("SELECT * FROM EUser WHERE username = %s", (userName,))
        user = cur.fetchone()
        if not user:
            return jsonify({"error": "User not found"}), 404

        cur.execute("SELECT * FROM EVENT WHERE Eventname = %s", (eventName,))
        event = cur.fetchone()
        if not event:
            return jsonify({"error": "Event not found"}), 404

        # Insert subscription
        cur.execute('''
            INSERT INTO Subscription (eventName, userName) 
            VALUES (%s, %s)
        ''', (eventName, userName))
        mysql.connection.commit()

        return jsonify({"message": f"{userName} subscribed to {eventName} successfully"}), 201

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/api/get_subscriptions', methods=['GET'])
def get_subscriptions():
    try:
        cur = mysql.connection.cursor()
        cur.execute('''
            SELECT S.subscription_id, S.eventName, S.userName, S.subscribeDate 
            FROM Subscription S
            JOIN EVENT E ON S.eventName = E.Eventname
            JOIN EUser U ON S.userName = U.username
            ORDER BY S.subscribeDate DESC;
        ''')
        subscriptions = cur.fetchall()
        subscription_list = [
            {
                "subscription_id": sub[0],
                "eventName": sub[1],
                "userName": sub[2],
                "subscribeDate": str(sub[3])
            } for sub in subscriptions
        ]
        return jsonify({"subscriptions": subscription_list}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    username = data.get('username')
    phone = data.get('phone')
    email = data.get('email')
    password = data.get('password')

    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM EUser WHERE username=%s OR email=%s", (username, email))
        existing_user = cur.fetchone()

        if existing_user:
            return jsonify({"error": "User already exists"}), 409

        cur.execute('''
            INSERT INTO EUser (firstName, lastName, phonenb, email, username, password, joindate)
            VALUES (%s, %s, %s, %s, %s, %s, CURDATE())
        ''', (firstName, lastName, phone, email, username, password))
        mysql.connection.commit()
        return jsonify({"message": "Signup successful"}), 201

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500



@app.route('/api/get_venues', methods=['GET'])
def get_venues():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT venuename FROM VENUE")
        venues = cur.fetchall()

        if not venues:
            return jsonify({"error": "No venues found"}), 404

        venue_list = [{"venuename": venue[0]} for venue in venues]
        return jsonify({"venues": venue_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/api/get_planners', methods=['GET'])
def get_planners():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT username FROM EUser")
        planners = cur.fetchall()
        return jsonify({"planners": [{"username": planner[0]} for planner in planners]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------- EVENT ENDPOINTS ----------------------
#to show all the details
@app.route('/api/get_events', methods=['GET'])
def get_events():
    try:
        cur = mysql.connection.cursor()
        cur.execute('''
            SELECT Eventname, date, time, EventBudget, phoneNumber, venuename, plannerusername 
            FROM EVENT ORDER BY date, time;
        ''')
        events = cur.fetchall()
        event_list = [
            {
                "Eventname": event[0],
                "date": str(event[1]),
                "time": str(event[2]),
                "EventBudget": event[3],
                "phoneNumber": event[4],
                "venuename": event[5],
                "plannerusername": event[6]
            } for event in events
        ]
        return jsonify({"events": event_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/edit_event_details/<string:event_name>', methods=['GET'])
def edit_event_details(event_name):
    try:
        cur = mysql.connection.cursor()
        cur.execute('''
            SELECT Eventname, date, time, EventBudget, phoneNumber, venuename, plannerusername
            FROM EVENT WHERE LOWER(Eventname) = LOWER(%s)
        ''', (event_name,))
        
        event = cur.fetchone()
        
        if event:
            event_data = {
                "Eventname": event[0],
                "date": str(event[1]),
                "time": str(event[2]),
                "EventBudget": event[3],
                "phoneNumber": event[4],
                "venuename": event[5],
                "plannerusername": event[6]
            }
            return jsonify({"event": event_data}), 200
        
        return jsonify({"error": "Event not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/api/create_event', methods=['POST'])
def create_event():
    data = request.json

    eventName = data.get('eventName')
    eventDate = data.get('eventDate')
    eventTime = data.get('eventTime')
    eventBudget = data.get('eventBudget')
    eventPhone = data.get('eventPhone')
    eventLocation = data.get('eventLocation')
    plannerUsername = data.get('plannerUsername')

    if not all([eventName, eventDate, eventTime, eventBudget, eventPhone, eventLocation, plannerUsername]):
        return jsonify({"error": "All fields are required."}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute('''
            INSERT INTO EVENT (Eventname, date, time, EventBudget, phoneNumber, venuename, plannerusername)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        ''', (eventName, eventDate, eventTime, eventBudget, eventPhone, eventLocation, plannerUsername))
        mysql.connection.commit()
        return jsonify({"message": "Event created successfully"}), 201

    except Exception as e:
        mysql.connection.rollback()
        print(f"Server Error: {e}")
        return jsonify({"error": str(e)}), 500

#get planner phones
# Get Planner Phone Number API
@app.route('/api/get_planner_phone/<string:username>', methods=['GET'])
def get_planner_phone(username):
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT phonenb FROM EUSER WHERE username = %s", (username,))
        result = cur.fetchone()

        if result:
            return jsonify({"phoneNumber": result[0]}), 200
        else:
            return jsonify({"error": "Planner not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Delete Venue API Endpoint
@app.route('/api/delete_venue/<string:venuename>', methods=['DELETE'])
def delete_venue(venuename):
    try:
        cur = mysql.connection.cursor()

        # Debug: Check if the venue exists
        cur.execute("SELECT * FROM VENUE WHERE LOWER(venuename) = LOWER(%s)", (venuename,))
        venue = cur.fetchone()

        if not venue:
            print(f"Venue '{venuename}' not found in VENUE table")
            return jsonify({'error': f"Venue '{venuename}' not found"}), 404

        # Debug: Check for references in the EVENT table
        cur.execute("SELECT * FROM EVENT WHERE LOWER(venuename) = LOWER(%s)", (venuename,))
        event_ref = cur.fetchone()

        if event_ref:
            print(f"Venue '{venuename}' is referenced in the EVENT table.")
            return jsonify({'error': f"Venue '{venuename}' is referenced in other events. Delete them first."}), 409

        # Proceed with deletion
        cur.execute("DELETE FROM VENUE WHERE LOWER(venuename) = LOWER(%s)", (venuename,))
        mysql.connection.commit()

        print(f"Venue '{venuename}' deleted successfully.")
        return jsonify({'message': f"Venue '{venuename}' deleted successfully"}), 200

    except Exception as e:
        mysql.connection.rollback()
        print(f"Error deleting venue '{venuename}': {e}")
        return jsonify({'error': f"Internal Server Error: {str(e)}"}), 500

# Get All Venues
# Fetch All Venue Details
@app.route('/api/fetch_venues', methods=['GET'])
def fetch_venues():
    try:
        cur = mysql.connection.cursor()
        cur.execute('''
            SELECT venuename, location, capacity, rental_cost, phone_number, services_offered, place_description
            FROM VENUE;
        ''')
        venues = cur.fetchall()
        venue_list = [
            {
                "venuename": venue[0],
                "location": venue[1],
                "capacity": venue[2],
                "rental_cost": venue[3],
                "phone_number": venue[4],
                "services_offered": venue[5],
                "place_description": venue[6]
            } for venue in venues
        ]
        return jsonify({"venues": venue_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/api/update_event/<string:event_name>', methods=['PUT'])
def update_event(event_name):
    try:
        data = request.json
        
        # Extract fields
        event_date = data.get('eventDate')
        event_time = data.get('eventTime')
        event_budget = data.get('eventBudget')
        event_phone = data.get('eventPhone')
        venue_name = data.get('venuename', '')  # Optional with default empty
        planner_username = data.get('plannerUsername')

        # Validate fields
        required_fields = [event_date, event_time, event_budget, event_phone, planner_username]
        if not all(required_fields):
            return jsonify({"error": "Missing required fields."}), 400
        
        cur = mysql.connection.cursor()

        # Ensure the event exists
        cur.execute("SELECT * FROM EVENT WHERE LOWER(Eventname) = LOWER(%s)", (event_name,))
        existing_event = cur.fetchone()

        if not existing_event:
            return jsonify({"error": f"Event '{event_name}' not found."}), 404

        # Update event
        cur.execute('''
            UPDATE EVENT 
            SET date=%s, time=%s, EventBudget=%s, phoneNumber=%s, venuename=%s, plannerusername=%s 
            WHERE LOWER(Eventname) = LOWER(%s)
        ''', (
            event_date, event_time, event_budget, event_phone, venue_name, planner_username, event_name
        ))

        mysql.connection.commit()
        return jsonify({"message": f"Event '{event_name}' updated successfully."}), 200

    except Exception as e:
        mysql.connection.rollback()
        print(f"Error updating event '{event_name}': {e}")
        return jsonify({"error": "Internal Server Error"}), 500



@app.route('/api/delete_event/<string:event_name>', methods=['DELETE'])
def delete_event(event_name):
    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM EVENT WHERE Eventname = %s", (event_name,))
        mysql.connection.commit()
        return jsonify({"message": f"Event '{event_name}' deleted successfully"}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500


# Create Venue API Endpoint
@app.route('/api/create_venue', methods=['POST'])
def create_venue():
    data = request.json
    venuename = data.get('venuename')
    location = data.get('location')
    capacity = data.get('capacity')
    rental_cost = data.get('rental_cost')
    phone_number = data.get('phone_number')
    services_offered = data.get('services_offered')
    place_description = data.get('place_description')

    if not all([venuename, location, capacity, rental_cost, phone_number, services_offered, place_description]):
        return jsonify({"error": "All fields are required."}), 400

    try:
        cur = mysql.connection.cursor()
        cur.execute('''
            INSERT INTO VENUE (venuename, location, capacity, rental_cost, phone_number, services_offered, place_description)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        ''', (venuename, location, capacity, rental_cost, phone_number, services_offered, place_description))
        mysql.connection.commit()
        return jsonify({"message": "Venue created successfully"}), 201
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500



# ---------------------- SERVICE ENDPOINTS ----------------------

@app.route('/api/get_all_services', methods=['GET'])
def get_all_services():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT serviceName, eventname, cost, contactInfo, details FROM SERVICES')
        services = cur.fetchall()
        service_list = [
            {
                "serviceName": service[0],
                "eventName": service[1],
                "cost": float(service[2]),
                "contactInfo": service[3],
                "details": service[4]
            } for service in services
        ]
        return jsonify({"services": service_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/add_service', methods=['POST'])
def add_service():
    data = request.json
    try:
        cur = mysql.connection.cursor()
        cur.execute('''
            INSERT INTO SERVICES (serviceName, eventname, cost, contactInfo, details)
            VALUES (%s, %s, %s, %s, %s)
        ''', (data['serviceName'], data['eventName'], data['cost'], 
              data['contactInfo'], data['details']))
        mysql.connection.commit()
        return jsonify({"message": "Service added successfully"}), 201
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/api/update_service/<int:service_id>', methods=['PUT'])
def update_service(service_id):
    data = request.json
    try:
        cur = mysql.connection.cursor()
        cur.execute('''
            UPDATE SERVICES SET serviceName=%s, eventname=%s, cost=%s, 
            contactInfo=%s, details=%s WHERE serviceID=%s
        ''', (data['serviceName'], data['eventName'], data['cost'], 
              data['contactInfo'], data['details'], service_id))
        mysql.connection.commit()
        return jsonify({"message": "Service updated successfully"}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/api/delete_service/<int:service_id>', methods=['DELETE'])
def delete_service(service_id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM SERVICES WHERE serviceID = %s", (service_id,))
        mysql.connection.commit()
        return jsonify({"message": "Service deleted successfully"}), 200
    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500


# ---------------------- RUN SERVER ----------------------

if __name__ == '__main__':
    app.run(debug=True)

