# Updated Backend: app.py
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
# Security features
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt, datetime
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Yasamu123'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
CORS(app, supports_credentials=True)

# Rate limiting (DDoS protection)
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["5 per minute"]
)
limiter.init_app(app)

# MongoDB setup
app.config["MONGO_URI"] = "mongodb://localhost:27017/testdb"
mongo = PyMongo(app)
users_collection = mongo.db["users"]
products_collection = mongo.db["products"]

# Token verification decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('token')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        except:
            return jsonify({'message': 'Token is invalid!'}), 403
        return f(*args, **kwargs)
    return decorated

@app.route('/')
def home():
    return "<p>Welcome to backend Interface</p>"

@app.route('/submit-form', methods=['POST'])
@limiter.limit("10 per minute")
@token_required
def submit_form():
    data = request.get_json()
    if not all(k in data for k in ("id", "name", "description", "price")):
        return jsonify({"error": "Missing fields"}), 400
    if not isinstance(data["id"], int) or not isinstance(data["price"], (int, float)):
        return jsonify({"error": "Invalid data types for id or price"}), 400
    products_collection.insert_one(data)
    return jsonify({'message': 'Form submitted successfully'})

@app.route('/signUp-form', methods=['POST'])
def signUp_form():
    try:
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return jsonify({"error": "All fields are required"}), 400

        if users_collection.find_one({"email": email}):
            return jsonify({"error": "Email already exists"}), 400

        hashed_password = generate_password_hash(password)
        users_collection.insert_one({"name": name, "email": email, "password": hashed_password})
        return jsonify({"message": "Signup successful!"}), 200

    except Exception as e:
        return jsonify({"error": "Signup failed"}), 500

@app.route('/login-form', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    user = users_collection.find_one({"email": email})
    if user and check_password_hash(user["password"], password):
        token = jwt.encode({
            "email": email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
        }, app.config["SECRET_KEY"], algorithm="HS256")

        response = jsonify({"message": "Login successful!"})
        response.set_cookie(
            "token",
            token,
            httponly=True,
            samesite="Lax",
            secure=not app.debug,
            max_age=600
        )
        return response

    return jsonify({"message": "Invalid email or password"}), 401

@app.route('/protected', methods=['GET'])
@token_required
def protected():
    return jsonify({'message': 'This is a protected route'})

@app.route('/get-data', methods=['GET'])
def get_data():
    products = list(products_collection.find({}, {"_id": 0}))
    return jsonify(products)

@app.route('/productUpdate/<int:id>', methods=['PUT'])
@token_required
@limiter.limit("10 per minute")
def product_update(id):
    data = request.get_json()
    result = products_collection.update_one(
        {"id": id},
        {"$set": {
            "name": data.get("name"),
            "description": data.get("description"),
            "price": data.get("price")
        }}
    )
    if result.matched_count == 0:
        return jsonify({"error": "Product not found"}), 404

    updated = products_collection.find_one({"id": id}, {"_id": 0})
    return jsonify({"message": "Updated successfully", "product": updated}), 200

@app.route('/userdelete/<int:id>', methods=['DELETE'])
@token_required
@limiter.limit("10 per minute")
def product_delete(id):
    result = products_collection.delete_one({"id": id})
    if result.deleted_count == 0:
        return jsonify({"error": "Product not found"}), 404

    return jsonify({"message": "Deleted successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)
