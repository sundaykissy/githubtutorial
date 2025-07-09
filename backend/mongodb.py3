from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
CORS(app)

# Replace with your actual DB name
app.config["MONGO_URI"] = "mongodb://localhost:27017/testdb"
mongo = PyMongo(app)
users_collection = mongo.db["testdb"]

@app.route('/')
def home():
    return "<p>Welcome to backend Interface</p>"

@app.route('/submit-form', methods=['POST'])
def submit_form():
    data = request.get_json()
    if not data.get("id"):
        return jsonify({"error": "ID is required"}), 400
    mongo.db.products.insert_one(data)
    return jsonify({'message': 'Form submitted successfully'})



@app.route('/signUp-form', methods=['POST'])
def signUp_form():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # Optional: Check if user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    # Save to MongoDB
    hashed_password = generate_password_hash(password, method="scrypt")
    users_collection.insert_one({"name": name, "email": email, "password": hashed_password})

    return jsonify({"message": "Signup successful!"}), 200

@app.route('/login-form', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = users_collection.find_one({"email": email})
    if user and check_password_hash(user["password"], password):
        return jsonify({"message": "Login successful"})
    else:
        return jsonify({"error": "Invalid email or password"}), 401
    print("Login attempt:", email)
    print("User found:", bool(user))
    if user:
        print("Password matches:", check_password_hash(user["password"], password))


@app.route('/get-data', methods=['GET'])
def get_data():
    products = list(mongo.db.products.find({}, {"_id": 0}))  # Exclude _id
    return jsonify(products)

@app.route('/productUpdate/<int:id>', methods=['PUT'])
def product_update(id):
    data = request.get_json()
    result = mongo.db.products.update_one(
        {"id": id},
        {"$set": {
            "name": data.get("name"),
            "description": data.get("description"),
            "price": data.get("price")
        }}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Product not found"}), 404

    updated = mongo.db.products.find_one({"id": id}, {"_id": 0})
    return jsonify({"message": "Updated successfully", "product": updated}), 200

@app.route('/userdelete/<int:id>', methods=['DELETE'])
def product_delete(id):
    result = mongo.db.products.delete_one({"id": id})

    if result.deleted_count == 0:
        return jsonify({"error": "Product not found"}), 404

    return jsonify({"message": "Deleted successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)