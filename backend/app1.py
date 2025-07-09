
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import datetime
from flask_marshmallow import Marshmallow
from marshmallow import fields
from flask_cors import CORS #ModuleNotFoundError: No module named 'flask_cors' = pip install Flask-Cors

app=Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "<p>Hello, Flask</p>"



#Database configuration
app.config['SQLALCHEMY_DATABASE_URI']='mysql+pymysql://root:''@localhost/test'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False
db=SQLAlchemy(app)
ma=Marshmallow(app)
class Users (db.Model):
    __tablename__='users'
    id=db.Column(db.Integer, primary_key=True, autoincrement=True)
    name=db.Column(db.String(100))
    description=db.Column(db.String(100))
    price=db.Column(db.Float(100))
    #date = db.Column(db.Date, default=datetime.date.today)


    def __init__(self, name, description):
        self.name=name
        self.description=description

    
class Userschema(ma.SQLAlchemyAutoSchema):
    date = fields.String() 
    #date = fields.Date(format='iso')
    class Meta:
        model=Users
        load_instance=True

userschema=Userschema()
users_schema=Userschema(many=True)        




#listUsers
@app.route('/listusers', methods=['GET'])
def userlist():
    all_users=Users.query.all()
    results=users_schema.dump(all_users)
    return jsonify(results)

@app.route('/userdetails/<id>', methods=['GET'])
def userdetails(id):
    users=Users.query.get(id)
    return userschema.jsonify(users)

@app.route('/userupdate/<id>', methods=['PUT'])
def userupdate(id):
    users=Users.query.get(id)

    name=request.json.get('name')
    email= request.json.get('email')

    users.name=name
    users.email=email

    db.session.commit()

    return userschema.jsonify(users)
@app.route('/userdelete/<id>', methods=['DELETE'])
def userdelete(id):
    users=Users.query.get(id)
    db.session.delete(users)
    db.session.commit()

    return userschema.jsonify(users)


#addUsers
@app.route('/useradd', methods=['POST'])
def useradd():
    name=request.json.get('name')
    description= request.json.get('description')
    price=request.json.get('price')

    users=Users(name, description)

    db.session.add(users)
    db.session.commit()

    return userschema.jsonify(users)


if __name__== "__main__":
    app.run(debug=True)


